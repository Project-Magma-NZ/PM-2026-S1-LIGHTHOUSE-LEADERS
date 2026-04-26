const ratingScale = [1, 2, 3, 4, 5, 6, 7]

type RatingQuestionProps = {
    id: string
    title: string
    badge?: string
    rating: number | undefined
    onRate: (value: number) => void
}

const RatingQuestion = ({ id, title, badge, rating, onRate }: RatingQuestionProps) => {
    return (
        <div id={id}>
            {badge && <div className="survey-badge">{badge}</div>}
            <div className="survey-question-header">
                <h2 className="survey-question">{title}</h2>
                <p className="survey-question-subtitle">Rate yourself on a scale of 1 to 7, where 1 is "Not at all" and 7 is "Completely"</p>
            </div>
            <div className="survey-rating-labels">
                <span>Not at all</span>
                <span>Completely</span>
            </div>
            <div className="survey-rating-row">
                {ratingScale.map((value) => (
                    <button
                        key={value}
                        type="button"
                        className={`survey-rating-option${rating === value ? ' is-selected' : ''}`}
                        onClick={() => onRate(value)}
                    >
                        {value}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default RatingQuestion