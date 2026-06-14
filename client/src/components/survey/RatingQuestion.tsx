import './question.css'
type RatingQuestionProps = {
    id: string
    title: string
    badge?: string
    rating: number | undefined
    onRate: (value: number) => void
}

const OPTIONS = [1, 2, 3, 4, 5]

const RatingQuestion = ({ id, title, badge, rating, onRate }: RatingQuestionProps) => {
    return (
        <div id={id} className="survey-rating-question">
            {badge && <div className="survey-badge">{badge}</div>}

            <div className="survey-question-header">
                <h2 className="survey-question">{title}</h2>
                <p className="survey-question-subtitle">
                    Rate yourself where the left is "Not at all" and the right is "Completely"
                </p>
            </div>

            <div
                className="survey-radio-group"
                role="radiogroup"
                aria-labelledby={id + '-label'}
            >
                {OPTIONS.map((opt, idx) => (
                    <label
                        key={opt}
                        className="survey-radio"
                        aria-label={opt === 1 ? 'Not at all' : opt === 5 ? 'Completely' : `Option ${opt}`}
                    >
                        <input
                            type="radio"
                            name={id}
                            value={opt}
                            checked={rating === opt}
                            onChange={() => onRate(opt)}
                        />
                        <span className="survey-radio-visual" aria-hidden="true" />
                        <span className="sr-only">Value {opt}</span>
                    </label>
                ))}
            </div>

            <div className="survey-rating-labels survey-rating-labels--below">
                <span className="survey-rating-label survey-rating-label--left">Not at all</span>
                <span className="survey-rating-label survey-rating-label--right">Completely</span>
            </div>
        </div>
    )
}

export default RatingQuestion