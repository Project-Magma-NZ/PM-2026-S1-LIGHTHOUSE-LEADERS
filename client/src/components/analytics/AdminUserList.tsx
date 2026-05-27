import { useMemo, useState } from 'react'
import { Search, Users, BarChart3 } from 'lucide-react'
import AdminAnalyticsTable from './AdminAnalyticsTable'
import { generateMockAdminAnalyticsUsers, type MockAdminAnalyticsUserRow } from '../../utils/mockData'
import './analytics.css'

type UserData = { id: string; name: string; email: string; surveyCount: number; latestSurveyDate: string; averageScore: number }


type Props = {
    users: UserData[]
    onSelectUser: (user: UserData) => void
}
const AdminUserList = ({ users: _users, onSelectUser }: Props) => {
    const [searchQuery, setSearchQuery] = useState('')

    // Seeded mock rows (new columns)
    const rows = useMemo(() => generateMockAdminAnalyticsUsers(30), [])

    const filteredRows: MockAdminAnalyticsUserRow[] =
        searchQuery.trim() === ''
            ? rows
            : rows.filter(r =>
                r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.userCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.className.toLowerCase().includes(searchQuery.toLowerCase())
            )

    // basic summary stats (optional)
    const totalUsers = rows.length
    const completedSurvey2 = rows.filter(r => r.survey2Score != null).length
    const platformAvg = (() => {
        const nums = rows.map(r => r.survey2Score).filter((n): n is number => typeof n === 'number')
        if (nums.length === 0) return '—'
        const avg = nums.reduce((a, b) => a + b, 0) / nums.length
        return avg.toFixed(1)
    })()

    const toUserData = (row: MockAdminAnalyticsUserRow): UserData => {
        const surveyCount = [row.survey1Score, row.survey2Score].filter(v => v != null).length
        const avg = row.survey2Score ?? row.survey1Score ?? 0
        return {
            id: row.id,
            name: row.name,
            email: `${row.userCode.toLowerCase()}@example.com`,
            surveyCount,
            latestSurveyDate: new Date().toISOString(),
            averageScore: avg,
        }
    }

    return (
        <div className="analytics-page">
            <div className="analytics-inner">
                <div className="admin-header">
                    <div className="admin-header-title">
                        <Users className="admin-header-icon" />
                        <h1 className="analytics-heading">All Users</h1>
                    </div>
                    <p className="admin-header-desc">View and analyze survey data for all students</p>
                </div>

                <div className="admin-stats-row">
                    <div className="analytics-card admin-stat-card">
                        <div className="admin-stat-card-header">
                            <Users className="admin-stat-icon" />
                            <span className="admin-stat-card-label">Total Users</span>
                        </div>
                        <p className="admin-stat-card-value">{totalUsers}</p>
                    </div>

                    <div className="analytics-card admin-stat-card">
                        <div className="admin-stat-card-header">
                            <BarChart3 className="admin-stat-icon" />
                            <span className="admin-stat-card-label">Survey 2 Completed</span>
                        </div>
                        <p className="admin-stat-card-value">{completedSurvey2}</p>
                    </div>

                    <div className="analytics-card admin-stat-card">
                        <div className="admin-stat-card-header">
                            <BarChart3 className="admin-stat-icon" />
                            <span className="admin-stat-card-label">Survey 2 Average</span>
                        </div>
                        <p className="admin-stat-card-value">{platformAvg}</p>
                    </div>
                </div>

                <div className="analytics-card admin-search-card">
                    <div className="admin-search-wrap">
                        <Search className="admin-search-icon" />
                        <input
                            type="text"
                            placeholder="Search by user code, name, school, or class..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="admin-search-input"
                        />
                    </div>
                    <p className="admin-search-count">Showing {filteredRows.length} of {rows.length} users</p>
                </div>

                {filteredRows.length === 0 ? (
                    <div className="analytics-empty">
                        <div className="analytics-empty-icon-wrap">
                            <Search className="analytics-empty-icon" />
                        </div>
                        <h2 className="analytics-empty-title">No users found</h2>
                        <p className="analytics-empty-desc">
                            {searchQuery ? `No results for "${searchQuery}"` : 'No users in the system'}
                        </p>
                    </div>
                ) : (
                    <div className="analytics-card admin-table-card">
                        <AdminAnalyticsTable
                            rows={filteredRows}
                            onRowClick={(row) => onSelectUser(toUserData(row))}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminUserList