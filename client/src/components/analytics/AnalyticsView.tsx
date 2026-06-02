import { useMemo, useState } from 'react'
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Legend } from 'recharts'
import AnalyticsSidebar from './AnalyticsSidebar'
import AnalyticsTable from './AnalyticsTable'
import AdminAnalyticsTable from './AdminAnalyticsTable'
import { generateMockAdminAnalyticsUsers } from '../../utils/mockData'
import { useNavigate } from 'react-router-dom'
//import { Users } from 'lucide-react'

const capabilities = [
    { id: 'vision', name: 'Vision' },
    { id: 'strategy', name: 'Strategy' },
    { id: 'resources', name: 'Resources' },
    { id: 'risk', name: 'Risk' },
    { id: 'action', name: 'Action' },
    { id: 'connection', name: 'Connection' },
    { id: 'purpose', name: 'Purpose' },
]

type Props = {
    surveys: any[]
    isAdmin: boolean
}

const toScore = (value: unknown) => {
    const n = typeof value === 'number' ? value : Number(String(value ?? '').trim())
    return Number.isFinite(n) ? n : 0
}

const AnalyticsView = ({ surveys, isAdmin }: Props) => {
    const [showLatest, setShowLatest] = useState(true)
    const [showPrevious, setShowPrevious] = useState(false)
    const navigate = useNavigate()

    const adminRows = useMemo(() => generateMockAdminAnalyticsUsers(30), [])

    const latestSurvey = surveys[surveys.length - 1]
    const previousSurvey = surveys.length > 1 ? surveys[surveys.length - 2] : null

    const chartData = capabilities.map(cap => ({
        category: cap.name,
        latest: toScore(latestSurvey?.ratings?.[cap.id]),
        previous: toScore(previousSurvey?.ratings?.[cap.id]),
    }))

    const getDateLabel = (dateString: string) =>
        new Date(dateString).toLocaleDateString('en-NZ', { month: 'short', day: 'numeric', year: 'numeric' })

    return (
        <div className="analytics-layout">
            <AnalyticsSidebar
                latestSurvey={latestSurvey}
                previousSurvey={previousSurvey}
                showLatest={showLatest}
                showPrevious={showPrevious}
                onToggleLatest={setShowLatest}
                onTogglePrevious={setShowPrevious}
                isAdmin={isAdmin}
                surveyCount={surveys.length}
            />

            <div className="analytics-main">
                {isAdmin ? (
                    <div className="analytics-card">
                        <h2 className="analytics-card-title">Student Analytics</h2>
                        <p className="analytics-framework-desc">
                            Compare results and filter insights by school/class (mock data for now).
                        </p>

                        <AdminAnalyticsTable rows={adminRows} onRowClick={(row) => navigate(`/admin/users/${row.id}`)} />

                        <AnalyticsTable
                            capabilities={capabilities}
                            latestSurvey={latestSurvey}
                            previousSurvey={previousSurvey}
                            showLatest={showLatest}
                            showPrevious={showPrevious}
                        />
                    </div>
                ) : (
                    <>
                        <div className="analytics-card">
                            <h2 className="analytics-card-title">SHINE Leader Self-Assessment Results</h2>
                            <ResponsiveContainer width="100%" height={500}>
                                <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="80%">
                                    <PolarGrid stroke="#e5e7eb" />
                                    <PolarAngleAxis dataKey="category" tick={{ fill: '#1f2937', fontSize: 13, fontWeight: 600 }} />
                                    <PolarRadiusAxis angle={90} domain={[0, 7]} tick={{ fill: '#4b5563', fontSize: 12 }} tickCount={8} />

                                    {showPrevious && previousSurvey && (
                                        <Radar
                                            name={`Previous (${getDateLabel(previousSurvey.date)})`}
                                            dataKey="previous"
                                            stroke="#F4C542"
                                            fill="#F4C542"
                                            fillOpacity={0.4}
                                            strokeWidth={2}
                                            dot={true}
                                        />
                                    )}

                                    {showLatest && latestSurvey && (
                                        <Radar
                                            name={`Latest (${getDateLabel(latestSurvey.date)})`}
                                            dataKey="latest"
                                            stroke="#7f49b2"
                                            fill="#7f49b2"
                                            fillOpacity={0.4}
                                            strokeWidth={2}
                                            dot={true}
                                        />
                                    )}

                                    <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                                </RadarChart>
                            </ResponsiveContainer>

                            <div className="analytics-framework">
                                <h3 className="analytics-framework-title">SHINE Framework</h3>
                                <p className="analytics-framework-desc">Each capability is scored on a scale from 1–7.</p>
                                <div className="analytics-framework-grid">
                                    <div><strong>Vision:</strong> See possibilities & imagine future</div>
                                    <div><strong>Strategy:</strong> Plan and achieve goals</div>
                                    <div><strong>Resources:</strong> Identify tools and support</div>
                                    <div><strong>Risk:</strong> Try new things & learn</div>
                                    <div><strong>Action:</strong> Take steps forward</div>
                                    <div><strong>Connection:</strong> Build relationships</div>
                                    <div><strong>Purpose:</strong> What matters most</div>
                                </div>
                            </div>
                        </div>

                        {/* Table hidden for students */}
                    </>
                )}
            </div>
        </div>
    )
}

export default AnalyticsView