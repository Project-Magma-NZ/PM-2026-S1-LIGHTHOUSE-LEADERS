import { Camera, Upload } from 'lucide-react'

type PhotoVoiceProps = {
    photoPreview: string
    caption: string
    onPhotoUpload: (dataUrl: string) => void
    onCaptionChange: (caption: string) => void
}

const PhotoVoice = ({ photoPreview, caption, onPhotoUpload, onCaptionChange }: PhotoVoiceProps) => {
    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onloadend = () => onPhotoUpload(reader.result as string)
        reader.readAsDataURL(file)
    }

    return (
        <article className="survey-card">
            <div className="survey-question-header">
                <div>
                    <div className="survey-badge">PhotoVoice</div>
                </div>
                <h2 className="survey-question">Share Your Story</h2>
                <p className="survey-photovoice-desc">
                    Upload a photo that represents you as a leader or how you're feeling right now, and give it a voice with a caption.
                </p>
            </div>

            <div className="survey-photo-upload">
                {!photoPreview ? (
                    <label className="survey-photo-dropzone">
                        <Camera className="survey-photo-icon" />
                        <p><strong>Click to upload</strong> or drag and drop</p>
                        <p className="survey-photo-hint">PNG, JPG or GIF (MAX. 10MB)</p>
                        <input type="file" className="survey-photo-input" accept="image/*" onChange={handleFile} />
                    </label>
                ) : (
                    <div className="survey-photo-preview">
                        <img src={photoPreview} alt="Uploaded photo" />
                        <button
                            type="button"
                            className="survey-photo-change"
                            onClick={() => onPhotoUpload('')}
                        >
                            <Upload className="survey-photo-change-icon" />
                        </button>
                    </div>
                )}
            </div>
            <div>
                <label className="survey-label">Caption — Give Your Photo a Voice</label>
                <textarea
                    className="survey-textarea"
                    value={caption}
                    onChange={(e) => onCaptionChange(e.target.value)}
                    placeholder="Describe what this photo means to you, how you're feeling, or what you see in your future..."
                    rows={4}
                    maxLength={500}
                />
            </div>
            <div className="survey-char-count">{caption.length}/500 characters</div>
        </article>
    )
}

export default PhotoVoice