import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2 } from 'lucide-react'

interface Question {
    id: string
    type: 'text' | 'rating'
    question: string
}

const CreateSurvey = () => {
    const navigate = useNavigate()
    const [surveyTitle, setSurveyTitle] = useState('')
    const [surveyDescription, setSurveyDescription] = useState('')
    const [questions, setQuestions] = useState<Question[]>([
        { id: '1', type: 'text', question: '' },
    ])

    const addQuestion = () => {
        const newId = (questions.length + 1).toString()
        setQuestions([...questions, { id: newId, type: 'text', question: '' }])
    }

    const removeQuestion = (id: string) => {
        if (questions.length > 1) {
            setQuestions(questions.filter((q) => q.id !== id))
        }
    }

    const updateQuestion = (id: string, field: keyof Question, value: string) => {
        setQuestions(questions.map((q) => (q.id === id ? { ...q, [field]: value } : q)))
    }

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault()
        console.log('Survey created:', { surveyTitle, surveyDescription, questions })
        navigate('/dashboard')
    }

    return (
        <div className="create-page">
            <div className="create-inner">
                <h1 className="create-heading">Create New Survey</h1>

                <form onSubmit={handleSubmit} className="create-form">
                    {/* Survey Details */}
                    <div className="create-card">
                        <h2 className="create-card-title">Survey Details</h2>
                        <div className="create-fields">
                            <div className="create-field">
                                <label htmlFor="title" className="create-label">Survey Title</label>
                                <input
                                    id="title"
                                    type="text"
                                    value={surveyTitle}
                                    onChange={(e) => setSurveyTitle(e.target.value)}
                                    required
                                    placeholder="Enter survey title"
                                    className="create-input"
                                />
                            </div>
                            <div className="create-field">
                                <label htmlFor="description" className="create-label">Description</label>
                                <textarea
                                    id="description"
                                    value={surveyDescription}
                                    onChange={(e) => setSurveyDescription(e.target.value)}
                                    placeholder="Enter survey description"
                                    className="create-textarea"
                                    rows={4}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Questions */}
                    <div className="create-card">
                        <div className="create-card-header">
                            <h2 className="create-card-title">Questions</h2>
                            <button type="button" onClick={addQuestion} className="create-btn-primary">
                                <Plus className="create-btn-icon" />
                                New Question
                            </button>
                        </div>

                        <div className="create-question-list">
                            {questions.map((question, index) => (
                                <div key={question.id} className="create-question-item">
                                    <div className="create-question-header">
                                        <h3 className="create-question-title">Question {index + 1}</h3>
                                        {questions.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeQuestion(question.id)}
                                                className="create-btn-remove"
                                            >
                                                <Trash2 className="create-btn-icon" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="create-fields">
                                        <div className="create-field">
                                            <label className="create-label">Question Type</label>
                                            <select
                                                value={question.type}
                                                onChange={(e) => updateQuestion(question.id, 'type', e.target.value as 'text' | 'rating')}
                                                className="create-select"
                                            >
                                                <option value="text">Text Response</option>
                                                <option value="rating">Rating (1-7)</option>
                                            </select>
                                        </div>
                                        <div className="create-field">
                                            <label className="create-label">Question Text</label>
                                            <textarea
                                                value={question.question}
                                                onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                                                required
                                                placeholder="Enter your question"
                                                className="create-textarea"
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="create-actions">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="create-btn-outline"
                        >
                            Cancel
                        </button>
                        <button type="submit" className="create-btn-submit">
                            Create Survey
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateSurvey