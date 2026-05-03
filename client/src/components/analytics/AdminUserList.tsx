import { useState } from 'react'
import { Search, Users, BarChart3, ChevronRight } from 'lucide-react'

interface UserData {
    id: string
    name: string
    email: string
    surveyCount: number
    latestSurveyDate: string
    averageScore: number
}

type Props = {
    users: UserData[]
    onSelectUser: (user: UserData) => void
}

const getRelativeDate = (dateString: string) => {
    const diffDays = Math.floor((Date.now() - new Date(dateString).getTime()) / 86400000)
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return new Date(dateString).toLocaleDateString('en-NZ', { month: 'short', day: 'numeric', year: 'numeric' })
}

const AdminUserList = ({ users, onSelectUser }: Props) => {
    const [searchQuery, setSearchQuery] = useState('')

    const filteredUsers = searchQuery.trim() === ''
        ? users
        : users.filter(u =>
            u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase())
        )

    const totalSurveys = users.reduce((sum, u) => sum + u.surveyCount, 0)
    const platformAvg = users.length > 0
        ? (users.reduce((sum, u) => sum + u.averageScore, 0) / users.length).toFixed(1) : '0.0'

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
                        <p className="admin-stat-card-value">{users.length}</p>
                    </div>
                    <div className="analytics-card admin-stat-card">
                        <div className="admin-stat-card-header">
                            <BarChart3 className="admin-stat-icon" />
                            <span className="admin-stat-card-label">Total Surveys</span>
                        </div>
                        <p className="admin-stat-card-value">{totalSurveys}</p>
                    </div>
                    <div className="analytics-card admin-stat-card">
                        <div className="admin-stat-card-header">
                            <BarChart3 className="admin-stat-icon" />
                            <span className="admin-stat-card-label">Platform Average</span>
                        </div>
                        <p className="admin-stat-card-value">{platformAvg}</p>
                    </div>
                </div>

                <div className="analytics-card admin-search-card">
                    <div className="admin-search-wrap">
                        <Search className="admin-search-icon" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="admin-search-input"
                        />
                    </div>
                    <p className="admin-search-count">Showing {filteredUsers.length} of {users.length} users</p>
                </div>

                {filteredUsers.length === 0 ? (
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
                        <div className="analytics-table-wrap">
                            <table className="analytics-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Surveys</th>
                                        <th>Avg Score</th>
                                        <th>Last Activity</th>
                                        <th className="admin-table-action-col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="admin-table-row" onClick={() => onSelectUser(user)}>
                                            <td>
                                                <div className="admin-user-cell">
                                                    <div className="admin-avatar">
                                                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                    </div>
                                                    <span className="admin-user-name">{user.name}</span>
                                                </div>
                                            </td>
                                            <td className="admin-user-email">{user.email}</td>
                                            <td>
                                                <span className="admin-survey-badge">
                                                    {user.surveyCount} {user.surveyCount === 1 ? 'survey' : 'surveys'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="admin-score-cell">
                                                    <BarChart3 className="admin-score-icon" />
                                                    <span className="admin-score-value">{user.averageScore.toFixed(1)}</span>
                                                </div>
                                            </td>
                                            <td className="admin-date">{getRelativeDate(user.latestSurveyDate)}</td>
                                            <td className="admin-table-action-col">
                                                <button className="admin-view-btn">
                                                    View Analytics
                                                    <ChevronRight className="admin-view-btn-icon" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminUserList