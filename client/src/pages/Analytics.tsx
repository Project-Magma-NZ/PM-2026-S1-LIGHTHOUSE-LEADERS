import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Image } from 'lucide-react'
import AdminUserList from '../components/analytics/AdminUserList'
import AdminUserDetail from '../components/analytics/AdminUserDetail'
import AnalyticsView from '../components/analytics/AnalyticsView'
import { generateMockUsers, generateMockSurveys } from '../utils/mockData'

interface UserData {
    id: string
    name: string
    email: string
    surveyCount: number
    latestSurveyDate: string
    averageScore: number
}

const Analytics = () => {
    const navigate = useNavigate()
    const isAdmin = localStorage.getItem('isAdmin') === 'true'

    const [surveys, setSurveys] = useState<any[]>([])
    const [users, setUsers] = useState<UserData[]>([])
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
    const [selectedUserSurveys, setSelectedUserSurveys] = useState<any[]>([])

    useEffect(() => {
        if (isAdmin) {
            const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]')
            if (allUsers.length === 0) {
                const mockUsers = generateMockUsers()
                localStorage.setItem('allUsers', JSON.stringify(mockUsers))
                setUsers(mockUsers)
            } else {
                setUsers(allUsers)
            }
        } else {
            const storedSurveys = JSON.parse(localStorage.getItem('studentSurveys') || '[]')
            setSurveys(storedSurveys)
        }
    }, [isAdmin])

    const handleSelectUser = (user: UserData) => {
        setSelectedUser(user)
        setSelectedUserSurveys(generateMockSurveys(user.surveyCount))
    }

    const handleBackToUsers = () => {
        setSelectedUser(null)
        setSelectedUserSurveys([])
    }

    // ─── Admin: user detail ─────────────────────────────────────────
    if (isAdmin && selectedUser) {
        return (
            <AdminUserDetail
                user={selectedUser}
                surveys={selectedUserSurveys}
                onBack={handleBackToUsers}
            />
        )
    }

    // ─── Admin: user list ───────────────────────────────────────────
    if (isAdmin) {
        return (
            <AdminUserList
                users={users}
                onSelectUser={handleSelectUser}
            />
        )
    }

    // ─── Student: empty ─────────────────────────────────────────────
    if (surveys.length === 0) {
        return (
            <div className="analytics-page">
                <div className="analytics-inner">
                    <h1 className="analytics-heading">Analytics Dashboard</h1>
                    <div className="analytics-empty">
                        <div className="analytics-empty-icon-wrap">
                            <Image className="analytics-empty-icon" />
                        </div>
                        <h2 className="analytics-empty-title">No Survey Data Yet</h2>
                        <p className="analytics-empty-desc">Complete your first SHINE assessment to see your results and track your progress.</p>
                        <button onClick={() => navigate('/survey')} className="analytics-empty-btn">
                            Take Your First Survey
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // ─── Student: analytics ─────────────────────────────────────────
    return (
        <div className="analytics-page">
            <div className="analytics-inner">
                <h1 className="analytics-heading">Analytics Dashboard</h1>
                <AnalyticsView surveys={surveys} isAdmin={false} />
            </div>
        </div>
    )
}

export default Analytics