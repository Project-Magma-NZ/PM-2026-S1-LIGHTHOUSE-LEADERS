type TextQuestionProps = {
    id: string
    title: string
    placeholder: string
    value: string
    onChange: (value: string) => void
}

const TextQuestion = ({ id, title, placeholder, value, onChange }: TextQuestionProps) => {
    return (
        <div id={id}>
            <div className="survey-badge">Reflection Question</div>
            <div className="survey-question-header">
                <h2 className="survey-question">{title}</h2>
                <p className="survey-question-subtitle">Take a moment to reflect and share your thoughts</p>
            </div>

            <textarea
                className="survey-textarea"
                placeholder={placeholder}
                rows={6}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                maxLength={1000}
            />
            <div className="survey-char-count">{value.length}/1000 characters</div>
        </div>
    )
}

export default TextQuestion