//import { useState, useEffect, useMemo } from 'react'
//import { useLocation, useNavigate } from 'react-router-dom'
//import { Image } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminUserList from '../components/analytics/AdminUserList'
import AdminUserDetail from '../components/analytics/AdminUserDetail'
import AnalyticsView from '../components/analytics/AnalyticsView'
import { generateMockUsers, generateMockSurveys } from '../utils/mockData'
import { getMySurveyResponse, getSurvey } from '../services/surveys'
import { useAuth } from '../context/AuthProvider'
import { useSurveys } from '../hooks/useSurveys'

interface UserData {
    id: string
    name: string
    email: string
    surveyCount: number
    latestSurveyDate: string
    averageScore: number
}

const AXES = ['vision', 'strategy', 'resources', 'risk', 'action', 'connection', 'purpose'] as const
type Axis = (typeof AXES)[number]

const toScore = (value: unknown) => {
    const n = typeof value === 'number' ? value : Number(String(value ?? '').trim())
    return Number.isFinite(n) ? n : 0
}

const Analytics = () => {
    const navigate = useNavigate()
    //const location = useLocation()
    const { user } = useAuth()
    const isAdmin = user?.role === 'admin'

    //const qs = useMemo(() => new URLSearchParams(location.search), [location.search])
    //const surveyIdParam = qs.get('surveyId')
    //const surveyId = surveyIdParam ? Number(surveyIdParam) : undefined


    //const [surveys, setSurveys] = useState<any[]>([])
    const [users, setUsers] = useState<UserData[]>([])
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
    const [selectedUserSurveys, setSelectedUserSurveys] = useState<any[]>([])

    const { surveys: availableSurveys, loading: surveysLoading, error: surveysError } = useSurveys()


    //const [loading, setLoading] = useState(false)
    //const [loadError, setLoadError] = useState<string | null>(null)

    const [completedSurveys, setCompletedSurveys] = useState<any[]>([])
    const [loadingCompleted, setLoadingCompleted] = useState(false)
    const [completedError, setCompletedError] = useState<string | null>(null)


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

        if (!availableSurveys || availableSurveys.length === 0) {
            setCompletedSurveys([])
            return
        }

        let cancelled = false

        const load = async () => {
            setLoadingCompleted(true)
            setCompletedError(null)

            try {
                const results = await Promise.all(
                    availableSurveys.map(async (s: any) => {
                        try {
                            // 1) response for this survey (404 means not completed)
                            const resp = await getMySurveyResponse(s.id)

                            // 2) need survey questions to map question_id -> category
                            const def = await getSurvey(s.id)

                            const answersById = new Map<number, string>()
                            for (const a of resp.answers ?? []) answersById.set(a.question_id, a.answer)

                            const ratings: Record<Axis, number> = {
                                vision: 0,
                                strategy: 0,
                                resources: 0,
                                risk: 0,
                                action: 0,
                                connection: 0,
                                purpose: 0,
                            }

                            for (const q of def.questions ?? []) {
                                const cat = String(q.category ?? '').toLowerCase()
                                if ((AXES as readonly string[]).includes(cat)) {
                                    ratings[cat as Axis] = toScore(answersById.get(q.id))
                                }
                            }

                            return {
                                id: s.id,
                                title: def.title ?? s.title ?? 'Survey',
                                date: resp.submitted_at, // important: AnalyticsView expects .date
                                completed: true,
                                ratings,
                                textResponses: {}, // optional; keep to avoid undefined usage elsewhere
                            }
                        } catch (err: any) {
                            // Treat 404 "No response found" as simply "not completed"
                            const status = err?.response?.status
                            if (status === 404) return null
                            throw err
                        }
                    })
                )

                const onlyCompleted = results
                    .filter(Boolean)
                    .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())

                if (!cancelled) setCompletedSurveys(onlyCompleted)
            } catch (e: any) {
                if (!cancelled) setCompletedError(e?.response?.data?.detail ?? 'Failed to load completed surveys')
            } finally {
                if (!cancelled) setLoadingCompleted(false)
            }
        }

        load()

        return () => {
            cancelled = true
        }
    }, [isAdmin, availableSurveys])
    
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
    if (surveysLoading || loadingCompleted) {
        return (
            <div className="analytics-page">
                <div className="analytics-inner">
                    <div className="analytics-empty">
                        <p className="analytics-empty-desc">Loading your analytics…</p>
                    </div>
                </div>
            </div>
        )
    }

    if (surveysError || completedError) {
        return (
            <div className="analytics-page">
                <div className="analytics-inner">
                    <div className="analytics-empty">
                        <p className="analytics-empty-desc">{String(surveysError ?? completedError)}</p>
                    </div>
                </div>
            </div>
        )
    }

    if (completedSurveys.length === 0) {
        return (
            <div className="analytics-page">
                <div className="analytics-inner">
                    <div className="analytics-empty">
                        <p className="analytics-empty-desc">
                            Complete your first SHINE assessment to see your results and track your progress.
                        </p>
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
                <AnalyticsView surveys={completedSurveys} isAdmin={true} />
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
