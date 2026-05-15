import { Link } from "react-router-dom";
import { CheckCircle, Clock, PlayCircle } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useSurveys } from '../hooks/useSurveys';

const Dashboard = () => {

    const { surveys, loading, error } = useSurveys();
    const todo = useMemo(
        () => surveys.filter((s) => s.status === "active" && !s.has_submitted),
        [surveys]
    );
    const completed = useMemo(
        () => surveys.filter((s) => s.has_submitted),
        [surveys]
    );
    //const activeSurveys = surveys.filter((s) => s.status === "active");

    const firstTodo = todo[0];
    const firstCompleted = completed[0];

    //const [completedSurveys, setCompletedSurveys] = useState<any[]>([]);
    //const [hasInitialSurvey, setHasInitialSurvey] = useState(false);

    useEffect(() => {
        const loadSurveys = () => {
            //const surveys = JSON.parse(localStorage.getItem("studentSurveys") || "[]");
            //setCompletedSurveys(surveys);
            //setHasInitialSurvey(surveys.length > 0);
        };

        loadSurveys();

        const handleStorage = (event: StorageEvent) => {
            if (event.key === "studentSurveys" || event.key === null) {
                loadSurveys();
            }
        };

        const handleFocus = () => loadSurveys();

        window.addEventListener("storage", handleStorage);
        window.addEventListener("focus", handleFocus);

        return () => {
            window.removeEventListener("storage", handleStorage);
            window.removeEventListener("focus", handleFocus);
        };
    }, []);

    // const calculateAverageScore = (ratings: Record<string, number>) => {
    //     const values = Object.values(ratings);
    //     const sum = values.reduce((acc, val) => acc + val, 0);
    //     return (sum / values.length).toFixed(1);
    // };

    //const latestSurvey = completedSurveys[completedSurveys.length - 1];
    //const hasCompletedFollowUp = latestSurvey?.type === "follow-up";

    
    return (
        <div className="dashboard-wrapper">
            <div className="dashboard-page">
                <div className="dashboard-header">
                    <h1>Dashboard</h1>
                    <p>Welcome to the Lighthouse Leaders Dashboard! Here you can view and manage your surveys, track responses, and analyze results.</p>
                </div>


                <div className="dashboard-content">
                    {/* Available Surveys */}
                    <div className="dashboard-panel">
                        <div className="dashboard-panel-header">
                        <Clock className="dashboard-panel-icon" />
                        <h2>Available Surveys</h2>
                        </div>

                        <div className="dashboard-panel-list">
                        {loading && (
                            <div className="dashboard-empty-box dashboard-empty-box--center">
                            <p>Loading surveys...</p>
                            </div>
                        )}

                        {error && (
                            <div className="dashboard-empty-box dashboard-empty-box--center">
                            <p>{error}</p>
                            </div>
                        )}

                        {!loading && !error && firstTodo ? (
                            <Link to={`/survey/${firstTodo.id}`} className="dashboard-survey-initial">
                            <div className="dashboard-survey-initial-header">
                                <PlayCircle className="dashboard-survey-initial-icon" />
                                <h3>{firstTodo.title}</h3>
                            </div>
                            <p>Complete your active survey</p>
                            <div className="dashboard-survey-badge">Start</div>
                            </Link>
                        ) : (
                            !loading &&
                            !error && (
                            <div className="dashboard-empty-box dashboard-empty-box--center">
                                <CheckCircle className="dashboard-empty-icon" />
                                <p>No available surveys</p>
                                <p className="dashboard-empty-subtext">
                                You have nothing to complete right now.
                                </p>
                            </div>
                            )
                        )}
                        </div>
                    </div>

                    {/* Completed Surveys */}
                    <div className="dashboard-panel">
                        <div className="dashboard-panel-header">
                        <CheckCircle className="dashboard-panel-icon" />
                        <h2>Completed Surveys</h2>
                        </div>

                        <div className="dashboard-panel-list">
                        {!loading && !error && completed.length > 0 ? (
                            completed.map((s) => (
                            <Link
                                key={s.id}
                                to={`/analytics?surveyId=${s.id}`}
                                className="dashboard-completed-item"
                                style={{ textDecoration: "none", color: "inherit" }}
                            >
                                <div className="dashboard-completed-item-inner">
                                <div>
                                    <div className="dashboard-completed-item-meta">
                                    <h3>{s.title}</h3>
                                    </div>
                                    {s.submitted_at ? (
                                    <p className="dashboard-completed-date">
                                        Completed: {new Date(s.submitted_at).toLocaleDateString()}
                                    </p>
                                    ) : (
                                    <p className="dashboard-completed-date">Completed</p>
                                    )}
                                </div>
                                </div>
                            </Link>
                            ))
                        ) : (
                            !loading &&
                            !error && (
                            <div className="dashboard-empty-box dashboard-empty-box--center">
                                <CheckCircle className="dashboard-empty-icon" />
                                <p>No completed surveys yet</p>
                                <p className="dashboard-empty-subtext">Your survey history will appear here</p>
                            </div>
                            )
                        )}
                        </div>

                        {firstCompleted && (
                        <Link to="/analytics" className="dashboard-analytics-link">
                            View Detailed Analytics
                        </Link>
                        )}
                    </div>
                    </div>
                </div>
                </div>
    );
}

export default Dashboard;
