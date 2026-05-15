type Capability = { id: string; name: string }

type Props = {
    capabilities: Capability[]
    latestSurvey: any
    previousSurvey: any
    showLatest: boolean
    showPrevious: boolean
}

const toScore = (value: unknown) => {
    const n = typeof value === "number" ? value : Number(String(value ?? "").trim())
    return Number.isFinite(n) ? n : 0
}

const AnalyticsTable = ({ capabilities, latestSurvey, previousSurvey, showLatest, showPrevious }: Props) => {
    return (
        <div className="analytics-card">
            <h2 className="analytics-card-title">Category Breakdown</h2>
            <div className="analytics-table-wrap">
                <table className="analytics-table">
                    <thead>
                        <tr>
                            <th>Category</th>
                            {showLatest && <th>Latest</th>}
                            {showPrevious && previousSurvey && <th>Previous</th>}
                            {showLatest && showPrevious && previousSurvey && <th>Change</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {capabilities.map((cap) => {
                            const latestValue = toScore(latestSurvey?.ratings?.[cap.id])
                            const previousValue = toScore(previousSurvey?.ratings?.[cap.id])

                            const change = showLatest && showPrevious && previousValue
                                ? (latestValue - previousValue).toFixed(1) : null
                            return (
                                <tr key={cap.id}>
                                    <td className="analytics-table-name">{cap.name}</td>
                                    {showLatest && <td>{latestValue?.toFixed(1)}</td>}
                                    {showPrevious && previousSurvey && <td>{previousValue?.toFixed(1)}</td>}
                                    {change !== null && (
                                        <td className={parseFloat(change) > 0 ? 'analytics-change--positive' : parseFloat(change) < 0 ? 'analytics-change--negative' : ''}>
                                            {parseFloat(change) > 0 ? '+' : ''}{change}
                                        </td>
                                    )}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AnalyticsTable