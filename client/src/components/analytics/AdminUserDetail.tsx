import { ArrowLeft, Image } from 'lucide-react'
import AnalyticsView from './AnalyticsView'

interface UserData {
    id: string
    name: string
    email: string
    surveyCount: number
    latestSurveyDate: string
    averageScore: number
}

type Props = {
    user: UserData
    surveys: any[]
    onBack: () => void
}

const AdminUserDetail = ({ user, surveys, onBack }: Props) => {
    return (
        <div className="analytics-page">
            <div className="analytics-inner">
                <button onClick={onBack} className="admin-back-btn">
                    <ArrowLeft className="admin-back-icon" /> Back to All Users
                </button>

                <div className="analytics-card admin-user-header-card">
                    <div className="admin-avatar admin-avatar--lg">
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div>
                        <h1 className="analytics-heading">{user.name}</h1>
                        <p className="admin-user-email">{user.email}</p>
                    </div>
                </div>

                {surveys.length === 0 ? (
                    <div className="analytics-empty">
                        <div className="analytics-empty-icon-wrap">
                            <Image className="analytics-empty-icon" />
                        </div>
                        <h2 className="analytics-empty-title">No Data Yet</h2>
                        <p className="analytics-empty-desc">This student hasn't completed any assessments yet.</p>
                    </div>
                ) : (
                    <AnalyticsView surveys={surveys} isAdmin={false} />
                )}
            </div>
        </div>
    )
}

export default AdminUserDetail
