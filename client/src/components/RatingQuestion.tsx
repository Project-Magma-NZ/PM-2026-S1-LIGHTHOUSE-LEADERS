const ratingScale = [1, 2, 3, 4, 5]

type RatingQuestionProps = {
    id: string
    title: string
    rating: number
    onRate: (value: number) => void
}

const RatingQuestion = ({ id, title, rating, onRate }: RatingQuestionProps) => {
    return (
        <article id={id} className="survey-card survey-card-rating">
            <h2 className="survey-question">{title}</h2>
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
        </article>
    )
}

export default RatingQuestion