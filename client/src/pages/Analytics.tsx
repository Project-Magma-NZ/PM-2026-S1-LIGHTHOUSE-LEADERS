import { useState, useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Image } from 'lucide-react'
import AdminUserList from '../components/analytics/AdminUserList'
import AdminUserDetail from '../components/analytics/AdminUserDetail'
import AnalyticsView from '../components/analytics/AnalyticsView'
import { generateMockUsers, generateMockSurveys } from '../utils/mockData'
import { getMySurveyResponse, getSurvey } from '../services/surveys'

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
    const location = useLocation()
    const isAdmin = localStorage.getItem('isAdmin') === 'true'

    const qs = useMemo(() => new URLSearchParams(location.search), [location.search])
    const surveyIdParam = qs.get('surveyId')
    const surveyId = surveyIdParam ? Number(surveyIdParam) : undefined


    const [surveys, setSurveys] = useState<any[]>([])
    const [users, setUsers] = useState<UserData[]>([])
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
    const [selectedUserSurveys, setSelectedUserSurveys] = useState<any[]>([])

    const [loading, setLoading] = useState(false)
    const [loadError, setLoadError] = useState<string | null>(null)

    // const loadStudentSurveys = () => {
    //     const storedSurveys = JSON.parse(localStorage.getItem('studentSurveys') || '[]')
    //     setSurveys(storedSurveys)
    // }

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
            return
        } 

        const load = async () => {
                if (!surveyId || !Number.isFinite(surveyId)) {
                    setSurveys([])
                    return
                }

                setLoading(true)
                setLoadError(null)

                try {
                    const [surveyDef, myResp] = await Promise.all([
                        getSurvey(surveyId),
                        getMySurveyResponse(surveyId),
                    ])

                    // Build an object similar to what your mockData produces:
                    // { date, completed, ratings: {vision..}, textResponses: {...}, photo, caption }
                    const answersByQuestionId = new Map<number, string>()
                    for (const a of myResp.answers ?? []) {
                        answersByQuestionId.set(a.question_id, a.answer)
                    }

                    const ratings: Record<string, string> = {}
                    const textResponses: Record<string, string> = {}

                    const orderedQuestions = [...(surveyDef.questions ?? [])].sort(
                        (a, b) => a.sort_order - b.sort_order
                    )

                    for (const q of orderedQuestions) {
                        const raw = answersByQuestionId.get(q.id) ?? ''
                        const qt = String(q.question_type ?? '').toLowerCase()

                        if (qt.startsWith('scale') || qt.includes('rating')) {
                            // analytics expects rating keys like vision/strategy/etc
                            if (q.category) ratings[String(q.category).toLowerCase()] = raw
                        } else {
                            // store text by question text or category
                            const key = q.question_text || q.category || `q_${q.id}`
                            textResponses[key] = raw
                        }
                    }

                    const completedSurveyLike = {
                        id: surveyDef.id,
                        title: surveyDef.title,
                        date: myResp.submitted_at ?? new Date().toISOString(),
                        completed: true,
                        ratings,
                        textResponses,
                    }

                    setSurveys([completedSurveyLike])
                } catch (e: any) {
                    setLoadError(e?.response?.data?.detail ?? e?.message ?? 'Failed to load analytics')
                    setSurveys([])
                } finally {
                    setLoading(false)
                }
            }

            load()
        }, [isAdmin, surveyId])
    
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

    // ─── Student: loading/error for specific survey ─────────────────
    if (loading) {
        return (
            <div className="analytics-page">
                <div className="analytics-inner">
                    <h1 className="analytics-heading">Analytics Dashboard</h1>
                    <p>Loading analytics…</p>
                </div>
            </div>
        )
    }

    if (loadError) {
        return (
            <div className="analytics-page">
                <div className="analytics-inner">
                    <h1 className="analytics-heading">Analytics Dashboard</h1>
                    <p style={{ color: 'crimson' }}>{loadError}</p>
                </div>
            </div>
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
                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={() => navigate('/dashboard')} className="analytics-empty-btn">
                        Take Another Survey
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Analytics
