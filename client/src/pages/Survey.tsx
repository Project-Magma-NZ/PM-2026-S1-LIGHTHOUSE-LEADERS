import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TextQuestion from '../components/survey/TextQuestion'
import RatingQuestion from '../components/survey/RatingQuestion'
import PhotoVoice from '../components/survey/PhotoVoice'
import { useParams } from 'react-router-dom'
import { useSurvey } from '../hooks/useSurvey'
import { submitSurveyResponse } from '../services/surveys'

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

// type UIQuestion = {
//     id: string
//     dbId: number
//     label: string
//     title: string;
//     type: 'rating';
// };

type UIQuestion =
    | {
          uiId: string
          dbId: number
          title: string
          type: 'rating'
          badge?: string
      }
    | {
          uiId: string
          dbId: number
          title: string
          type: 'text'
          placeholder?: string
      }

const badgeForCategory = (category?: string | null) => {
    const mapping: Record<string, string> = {
        vision: 'Vision',
        strategy: 'Strategy',
        resources: 'Resources',
        risk: 'Risk',
        action: 'Action',
        connection: 'Connection',
        purpose: 'Purpose',
    }
    if (!category) return undefined
    return mapping[category] ?? category
}

const placeholderForTextCategory = (category?: string | null) => {
    if (!category) return undefined
    if (category === 'reflection')
        return 'Think about recent achievements, personal qualities, or moments where you showed strength...'
    return undefined
}


//const allQuestions = [...capabilities, ...reflectionQuestions]
const Survey = () => {
    const navigate = useNavigate()
    const { surveyId } = useParams()

    const numericSurveyId = useMemo(() => {
        const n = Number(surveyId)
        return Number.isFinite(n) ? n : undefined
    }, [surveyId])

    const { survey, loading, error } = useSurvey(numericSurveyId)

    // Stepper state
    const [currentStep, setCurrentStep] = useState(0)

    // Store answers by DB question id (required by backend)
    const [ratingsByQuestionId, setRatingsByQuestionId] = useState<Record<number, number>>({})
    const [textByQuestionId, setTextByQuestionId] = useState<Record<number, string>>({})

    // PhotoVoice remains local-only for now (backend doesn't have a file upload endpoint yet)
    const [photoPreview, setPhotoPreview] = useState('')
    const [caption, setCaption] = useState('')

    const [submitting, setSubmitting] = useState(false)

    const questions: UIQuestion[] = useMemo(() => {
        if (!survey) return []

        return [...survey.questions]
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((q, idx) => {
                const uiId = `q${idx + 1}`

                const qt = String(q.question_type ?? '').toLowerCase()
                const isText = qt === 'text' || qt === 'textarea'
                if (isText) {
                    return {
                        uiId,
                        dbId: q.id,
                        title: q.question_text,
                        type: 'text',
                        placeholder: placeholderForTextCategory(q.category),
                    }
                }

                // default to rating
                return {
                    uiId,
                    dbId: q.id,
                    title: q.question_text,
                    type: 'rating',
                    badge: badgeForCategory(q.category),
                }
            })
    }, [survey])

    const totalSteps = questions.length + 1
    const isPhotoStep = currentStep === questions.length

    const isStepComplete = () => {
        if (isPhotoStep) return photoPreview.length > 0 && caption.trim().length > 0
        const current = questions[currentStep]
        if (current.type === 'rating') return ratingsByQuestionId[current.dbId] !== undefined
        return (textByQuestionId[current.dbId] ?? '').trim().length > 0
    }

    const handleSubmit = async () => {
        if (!numericSurveyId) {
            alert('Invalid survey id')
            return
        }

        // Build payload expected by backend: { answers: [{question_id, answer}] }
        const answers = questions.map((q) => {
            if (q.type === 'rating') {
                const v = ratingsByQuestionId[q.dbId]
                return { question_id: q.dbId, answer: v == null ? '' : String(v) }
            }

            const t = textByQuestionId[q.dbId]
            return { question_id: q.dbId, answer: (t ?? '').trim() }
        })

        const missing = answers.filter((a) => !a.answer)
        if (missing.length > 0) {
            alert('Please answer all questions before submitting.')
            return
        }

        try {
            setSubmitting(true)
            await submitSurveyResponse(numericSurveyId, { answers })
            navigate('/analytics')
        } catch (err: any) {
            alert(err?.response?.data?.detail ?? 'Failed to submit survey')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <main className="survey-page">Loading survey…</main>
    if (error) return <main className="survey-page">Error: {error}</main>
    if (!survey) return <main className="survey-page">Survey not found.</main>

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
                    questions[currentStep].type === 'rating' ? (
                        <RatingQuestion
                            key={questions[currentStep].uiId}
                            id={questions[currentStep].uiId}
                            title={questions[currentStep].title}
                            badge={questions[currentStep].badge}
                            rating={ratingsByQuestionId[questions[currentStep].dbId]}
                            onRate={(value) => setRatingsByQuestionId(r => ({ ...r, [questions[currentStep].dbId]: value }))}
                        />
                    ) : (
                        <TextQuestion
                            key={questions[currentStep].uiId}
                            id={questions[currentStep].uiId}
                            title={questions[currentStep].title}
                            placeholder={''}
                            value={textByQuestionId[questions[currentStep].dbId] || ''}
                            onChange={(val) =>
                                setTextByQuestionId((curr) => ({ ...curr, [questions[currentStep].dbId]: val }))
                            }
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
                            {currentStep === questions.length - 1 ? 'Continue to PhotoVoice →' : 'Next →'}
                        </button>
                    )}
                </div>
            </div>
        </main>
    )
}

export default Survey