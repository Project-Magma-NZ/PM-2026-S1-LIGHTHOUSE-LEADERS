import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useSurveys } from '../hooks/useSurveys';

const Dashboard = () => {
    const navigate = useNavigate()
    const { surveys, loading, error } = useSurveys();
    const todo = surveys.filter(s => s.status === "active" && !s.has_submitted);
    const completed = surveys.filter(s => s.has_submitted);
    const activeSurveys = surveys.filter((s) => s.status === "active");
    return (
        <div className="dashboard-wrapper">
            <div className="dashboard-page">
                <div className="dashboard-header">
                    <h1>Dashboard</h1>
                    <p>
                        Welcome to the Lighthouse Leaders Dashboard! Here you can view and
                        manage your surveys, track responses, and analyze results.
                    </p>
                </div>
                <div className="dashboard-content">
                    {loading && <div className="dashboard-card">Loading surveys...</div>}
                    {error && <div className="dashboard-card">{error}</div>}

                    <>
                            <div
                                onClick={() => {
                                    if (todo.length > 0) navigate(`/survey/${todo[0].id}`)
                                }}
                                className="dashboard-card"
                                style={{ cursor: todo.length > 0 ? 'pointer' : 'default' }}
                            >
                                <img src={assets.surveyIcon} alt="Survey Icon" />
                                <h1>To do</h1>
                                {todo.length === 0 && (
                                    <p style={{ opacity: 0.8 }}>
                                        You have no active surveys waiting for you right now.
                                    </p>
                                )}
                            </div>

                            <div
                                onClick={() => {
                                    if (completed.length > 0) navigate(`/survey/complete`)
                                }}
                                className="dashboard-card"
                                style={{ cursor: completed.length > 0 ? 'pointer' : 'default' }}
                            >
                                <img src={assets.completedIcon} alt="Completed Survey Icon" />
                                <h1>Completed</h1>
                                {completed.length === 0 && (
                                    <p style={{ opacity: 0.8 }}>
                                        Once you submit a survey, it will appear here.
                                    </p>
                                )}
                            </div>

                            <div onClick={() => navigate('/analytics')} className="dashboard-card">
                                <img src={assets.dataIcon} alt="Analytics Icon" />
                                <h1>Analytics</h1>
                                <p>View data breakdown of your survey responses</p>
                            </div>
                        </>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
