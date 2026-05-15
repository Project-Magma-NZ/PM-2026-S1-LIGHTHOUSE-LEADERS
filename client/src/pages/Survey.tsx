import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TextQuestion from '../components/survey/TextQuestion'
import RatingQuestion from '../components/survey/RatingQuestion'
import PhotoVoice from '../components/survey/PhotoVoice'

const capabilities = [
    { id: 'vision', label: 'Vision', title: 'My ability to see possibilities and imagine a positive future', type: 'rating' },
    { id: 'strategy', label: 'Strategy', title: 'My ability to plan and think through how to achieve my goals', type: 'rating' },
    { id: 'resources', label: 'Resources', title: 'My ability to identify and use the tools and support available to me', type: 'rating' },
    { id: 'risk', label: 'Risk', title: 'My ability to try new things and learn from challenges', type: 'rating' },
    { id: 'action', label: 'Action', title: 'My ability to take steps forward and get things done', type: 'rating' },
    { id: 'connection', label: 'Connection', title: 'My ability to build relationships and feel connected to others', type: 'rating' },
    { id: 'purpose', label: 'Purpose', title: 'My understanding of what matters to me and what I stand for', type: 'rating' },
] as const

const reflectionQuestions = [
    { id: 'strengths', label: 'Strengths', title: 'What are you most proud of about yourself right now?', type: 'text', placeholder: 'Think about recent achievements, personal qualities, or moments where you showed strength...' },
    { id: 'goals', label: 'Goals', title: 'What is one thing you would like to improve or work on?', type: 'text', placeholder: "Consider areas where you'd like to grow or challenges you'd like to overcome..." },
    { id: 'support', label: 'Support', title: 'Who or what helps you when things get tough?', type: 'text', placeholder: 'Think about people, activities, or resources that support you...' },
] as const

const allQuestions = [...capabilities, ...reflectionQuestions]

const Survey = () => {
    const navigate = useNavigate()
    const [currentStep, setCurrentStep] = useState(0)
    const [ratings, setRatings] = useState<Record<string, number>>({})
    const [textResponses, setTextResponses] = useState<Record<string, string>>({})
    const [photoPreview, setPhotoPreview] = useState('')
    const [caption, setCaption] = useState('')

    const totalSteps = allQuestions.length + 1
    const isPhotoStep = currentStep === allQuestions.length

    const isStepComplete = () => {
        if (isPhotoStep) return photoPreview.length > 0 && caption.trim().length > 0
        const current = allQuestions[currentStep]
        if (current.type === 'rating') return ratings[current.id] !== undefined
        return (textResponses[current.id] ?? '').trim().length > 0
    }

    const handleSubmit = () => {
        const existingSurveys = JSON.parse(localStorage.getItem('studentSurveys') || '[]')
        const newSurvey = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            ratings,
            textResponses,
            photo: photoPreview,
            caption,
            type: existingSurveys.length === 0 ? 'initial' : 'follow-up',
        }
        localStorage.setItem('studentSurveys', JSON.stringify([...existingSurveys, newSurvey]))
        navigate('/analytics')
    }

    const progressPercent = Math.round((currentStep / totalSteps) * 100)
    const progressLabel = isPhotoStep ? 'PhotoVoice - Final Step' : `Question ${currentStep + 1} of ${totalSteps}`

    return (
        <main className="survey-page">
            {/* Progress bar — outside the card */}
            <div className="survey-progress">
                <div className="survey-progress-labels">
                    <span>{progressLabel}</span>
                    <span>{progressPercent}% Complete</span>
                </div>
                <div className="survey-progress-track">
                    <div className="survey-progress-fill" style={{ width: `${progressPercent}%` }} />
                </div>
            </div>

            {/* Card */}
            <div className="survey-card">
                {!isPhotoStep ? (
                    allQuestions[currentStep].type === 'rating' ? (
                        <RatingQuestion
                            key={allQuestions[currentStep].id}
                            id={allQuestions[currentStep].id}
                            title={allQuestions[currentStep].title}
                            badge={capabilities.find(c => c.id === allQuestions[currentStep].id)?.label}
                            rating={ratings[allQuestions[currentStep].id]}
                            onRate={(value) => setRatings(r => ({ ...r, [allQuestions[currentStep].id]: value }))}
                        />
                    ) : (
                        <TextQuestion
                            key={allQuestions[currentStep].id}
                            id={allQuestions[currentStep].id}
                            title={allQuestions[currentStep].title}
                            placeholder={(allQuestions[currentStep] as typeof reflectionQuestions[number]).placeholder}
                            value={textResponses[allQuestions[currentStep].id] || ''}
                            onChange={(val) => setTextResponses(r => ({ ...r, [allQuestions[currentStep].id]: val }))}
                        />
                    )
                ) : (
                    <PhotoVoice
                        photoPreview={photoPreview}
                        caption={caption}
                        onPhotoUpload={setPhotoPreview}
                        onCaptionChange={setCaption}
                    />
                )}

                {/* Navigation */}
                <div className="survey-nav-row">
                    <button
                        type="button"
                        className="survey-nav-prev"
                        onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
                        disabled={currentStep === 0}
                    >
                        ← Previous
                    </button>
                    {isPhotoStep ? (
                        <button
                            type="button"
                            className="survey-nav-next"
                            onClick={handleSubmit}
                            disabled={!isStepComplete()}
                        >
                            Submit Survey →
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="survey-nav-next"
                            onClick={() => setCurrentStep(s => s + 1)}
                            disabled={!isStepComplete()}
                        >
                            {currentStep === allQuestions.length - 1 ? 'Continue to PhotoVoice →' : 'Next →'}
                        </button>
                    )}
                </div>
            </div>
        </main>
    )
}

export default Survey