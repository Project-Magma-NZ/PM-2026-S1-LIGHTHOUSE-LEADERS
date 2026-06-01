import './question.css'
type RatingQuestionProps = {
    id: string
    title: string
    badge?: string
    rating: number | undefined
    onRate: (value: number) => void
}

const RatingQuestion = ({ id, title, badge, rating, onRate }: RatingQuestionProps) => {
    const value = rating ?? 3

    return (
        <div id={id} className="survey-rating-question">
            {badge && <div className="survey-badge">{badge}</div>}

            <div className="survey-question-header">
                <h2 className="survey-question">{title}</h2>
                <p className="survey-question-subtitle">Rate yourself on a scale where the left is "Not at all" and the right is "Completely"</p>
            </div>

            <div className="survey-rating-labels">
                <span>Not at all</span>
                <span>Completely</span>
            </div>

            <div className="survey-range-wrap">
                <input
                    type="range"
                    min={1}
                    max={5}
                    step={1}
                    value={value}
                    className="survey-range"
                    aria-label={title}
                    onChange={(e) => onRate(Number(e.target.value))}
                />
                {/* visually-hidden numeric value for screen readers */}
                <span className="sr-only">Selected value: {value}</span>
            </div>
        </div>
    )
}

export default RatingQuestion