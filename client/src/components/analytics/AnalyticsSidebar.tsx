type Props = {
    latestSurvey: any
    previousSurvey: any
    showLatest: boolean
    showPrevious: boolean
    onToggleLatest: (val: boolean) => void
    onTogglePrevious: (val: boolean) => void
    isAdmin: boolean
    surveyCount: number
}

const getDateLabel = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-NZ', { month: 'short', day: 'numeric', year: 'numeric' })

const calculateAverage = (ratings: Record<string, number>) => {
    const values = Object.values(ratings)
    return (values.reduce((acc, val) => acc + val, 0) / values.length).toFixed(1)
}

const AnalyticsSidebar = ({
    latestSurvey, previousSurvey,
    showLatest, showPrevious,
    onToggleLatest, onTogglePrevious,
    isAdmin, surveyCount
}: Props) => {
    const improvement = previousSurvey
        ? (parseFloat(calculateAverage(latestSurvey.ratings)) - parseFloat(calculateAverage(previousSurvey.ratings))).toFixed(1)
        : null

    return (
        <aside className="analytics-sidebar">
            {/* Data Layers */}
            <div className="analytics-card">
                <h2 className="analytics-card-title">Data Layers</h2>
                <div className="analytics-layers">
                    <label className="analytics-layer-item">
                        <input type="checkbox" className="analytics-checkbox" checked={showLatest} onChange={(e) => onToggleLatest(e.target.checked)} />
                        <span className="analytics-layer-dot analytics-layer-dot--primary" />
                        <span>Latest ({getDateLabel(latestSurvey.date)})</span>
                    </label>
                    {previousSurvey ? (
                        <label className="analytics-layer-item">
                            <input type="checkbox" className="analytics-checkbox" checked={showPrevious} onChange={(e) => onTogglePrevious(e.target.checked)} />
                            <span className="analytics-layer-dot analytics-layer-dot--secondary" />
                            <span>Previous ({getDateLabel(previousSurvey.date)})</span>
                        </label>
                    ) : (
                        <p className="analytics-layer-hint">Complete another survey to compare</p>
                    )}
                </div>
            </div>

            {/* Statistics */}
            <div className="analytics-card">
                <h2 className="analytics-card-title">Statistics</h2>
                <div className="analytics-stats">
                    {showLatest && (
                        <div className="analytics-stat analytics-stat--primary">
                            <p className="analytics-stat-label">Latest Average</p>
                            <p className="analytics-stat-value">{calculateAverage(latestSurvey.ratings)}</p>
                        </div>
                    )}
                    {showPrevious && previousSurvey && (
                        <div className="analytics-stat analytics-stat--secondary">
                            <p className="analytics-stat-label">Previous Average</p>
                            <p className="analytics-stat-value">{calculateAverage(previousSurvey.ratings)}</p>
                        </div>
                    )}
                    {showLatest && showPrevious && previousSurvey && improvement !== null && (
                        <div className="analytics-stat analytics-stat--neutral">
                            <p className="analytics-stat-label">Improvement</p>
                            <p className={`analytics-stat-value ${parseFloat(improvement) > 0 ? 'analytics-stat-value--positive' : parseFloat(improvement) < 0 ? 'analytics-stat-value--negative' : ''}`}>
                                {parseFloat(improvement) > 0 ? '+' : ''}{improvement}
                            </p>
                        </div>
                    )}
                    {isAdmin && (
                        <div className="analytics-stat analytics-stat--neutral">
                            <p className="analytics-stat-label">Total Surveys</p>
                            <p className="analytics-stat-value">{surveyCount}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* PhotoVoice */}
            {latestSurvey.photo && (
                <div className="analytics-card">
                    <h2 className="analytics-card-title">PhotoVoice</h2>
                    <img src={latestSurvey.photo} alt="PhotoVoice" className="analytics-photo" />
                    <p className="analytics-photo-caption">"{latestSurvey.caption}"</p>
                    <p className="analytics-photo-date">{getDateLabel(latestSurvey.date)}</p>
                </div>
            )}

            {/* Reflections */}
            {latestSurvey.textResponses && Object.keys(latestSurvey.textResponses).length > 0 && (
                <div className="analytics-card">
                    <h2 className="analytics-card-title">{isAdmin ? 'Latest Reflections' : 'Your Reflections'}</h2>
                    <div className="analytics-reflections">
                        {latestSurvey.textResponses.strengths && (
                            <div className="analytics-reflection-item">
                                <p className="analytics-reflection-label">What are you most proud of?</p>
                                <p className="analytics-reflection-text">{latestSurvey.textResponses.strengths}</p>
                            </div>
                        )}
                        {latestSurvey.textResponses.goals && (
                            <div className="analytics-reflection-item">
                                <p className="analytics-reflection-label">What would you like to improve?</p>
                                <p className="analytics-reflection-text">{latestSurvey.textResponses.goals}</p>
                            </div>
                        )}
                        {latestSurvey.textResponses.support && (
                            <div className="analytics-reflection-item">
                                <p className="analytics-reflection-label">What helps you when things get tough?</p>
                                <p className="analytics-reflection-text">{latestSurvey.textResponses.support}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </aside>
    )
}

export default AnalyticsSidebar