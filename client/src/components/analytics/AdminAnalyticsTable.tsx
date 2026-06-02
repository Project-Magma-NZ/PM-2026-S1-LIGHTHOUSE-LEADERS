import type { MockAdminAnalyticsUserRow } from '../../utils/mockData'
import './analytics.css'

type Props = {
    rows: MockAdminAnalyticsUserRow[]
    onRowClick?: (row: MockAdminAnalyticsUserRow) => void
}

const fmt = (n: number | null) => (n == null ? '—' : n.toFixed(1))

const calcDiff = (s1: number | null, s2: number | null) => {
    if (s1 == null || s2 == null) return null
    return s2 - s1
}

const AdminAnalyticsTable = ({ rows, onRowClick }: Props) => {
    return (
        <div className="analytics-table-wrapper">
            <table className="analytics-table">
                <thead>
                    <tr>
                        <th>User code</th>
                        <th>Name</th>
                        <th>School</th>
                        <th>Class</th>
                        <th>Previous score</th>
                        <th>Latest score</th>
                        <th>Difference</th>
                    </tr>
                </thead>

                <tbody>
                    {rows.map((r) => {
                        const d = calcDiff(r.survey1Score, r.survey2Score)
                        const diffText = d == null ? '—' : d >= 0 ? `+${d.toFixed(1)}` : d.toFixed(1)

                        const diffClass =
                            d == null ? 'admin-pill admin-pill--muted'
                                : d > 0 ? 'admin-pill admin-pill--purple'
                                    : d < 0 ? 'admin-pill admin-pill--yellow'
                                        : 'admin-pill admin-pill--muted'

                        return (
                            <tr
                                key={r.id}
                                onClick={() => onRowClick?.(r)}
                                role={onRowClick ? 'button' : undefined}
                                tabIndex={onRowClick ? 0 : undefined}
                                style={{ cursor: onRowClick ? 'pointer' : undefined }}
                                onKeyDown={(e) => {
                                    if (!onRowClick) return
                                    if (e.key === 'Enter' || e.key === ' ') onRowClick(r)
                                }}
                            >
                                <td><span className="admin-pill admin-pill--muted">{r.userCode}</span></td>
                                <td style={{ fontWeight: 600 }}>{r.name}</td>
                                <td>{r.school}</td>
                                <td><span className="admin-pill admin-pill--muted">{r.className}</span></td>
                                <td>{fmt(r.survey1Score)}</td>
                                <td>{fmt(r.survey2Score)}</td>
                                <td><span className={diffClass}>{diffText}</span></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default AdminAnalyticsTable