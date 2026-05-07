import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useSurveys } from '../hooks/useSurveys';

const Dashboard = () => {
    const navigate = useNavigate()
    const { surveys, loading, error } = useSurveys();

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

                    {!loading &&
                        !error &&
                        activeSurveys.map((survey) => (
                        <div
                            key={survey.id}
                            className="dashboard-card"
                            onClick={() => navigate(`/survey/${survey.id}`)}
                        >
                            <img src={assets.surveyIcon} alt="Survey Icon" />
                            <h1>{survey.title}</h1>
                        </div>
                        ))}
                    <div onClick={() => navigate('/completed')} className="dashboard-card">
                        <img src={assets.completedIcon} alt="Completed Survey Icon" />
                        <h1>Completed Surveys</h1>
                        <p>View your last submitted survey.</p>
                    </div>
                    <div onClick={() => navigate('/analytics')} className="dashboard-card">
                        <img src={assets.dataIcon} alt="Analytics Icon" />
                        <h1>Analytics</h1>
                        <p>View data breakdown of your survey responses</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
