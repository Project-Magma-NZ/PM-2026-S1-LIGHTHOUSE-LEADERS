import { useMemo, useState } from 'react'
import TextQuestion from '../components/TextQuestion'
import RatingQuestion from '../components/RatingQuestion'
import SurveyNav from '../components/SurveyNav'
import { useParams } from 'react-router-dom'
import { useSurvey } from '../hooks/useSurvey'

// In future iterations, we can fetch this from the backend and use it to dynamically generate the survey form
const testQuestions = [
    {
        id: 'q1',
        label: 'Question 1',
        title: 'Q1: How supported do you feel in your current program?',
        type: 'text',
        placeholder: 'Type your answer here...',
    },
    {
        id: 'q2',
        label: 'Question 2',
        title: 'Q2: Rate your level of engagement with the activities.',
        type: 'rating',
    },
    {
        id: 'q3',
        label: 'Question 3',
        title: 'Q3: What suggestions do you have for improvement?',
        type: 'text',
        placeholder: 'Type your answer here...',
    },
    {
        id: 'q4',
        label: 'Question 4',
        title: 'Q4: How would you rate the communication within your team?',
        type: 'rating',
    },
    {
        id: 'q5',
        label: 'Question 5',
        title: "Q5: Rate your confidence in applying what you've learned.",
        type: 'rating',
    },
    {
        id: 'q6',
        label: 'Question 6',
        title: 'Q6: How satisfied are you with the program resources?',
        type: 'rating',
    },
    {
        id: 'q7',
        label: 'Question 7',
        title: 'Q7: Rate your overall experience with the program.',
        type: 'rating',
    },
] as const

type UIQuestion = {
    id: string
    dbId: number
    label: string
    title: string;
    type: 'rating';
};

const Survey = () => {
    const [activeQuestion, setActiveQuestion] = useState('q1')
    const [ratings, setRatings] = useState<Record<string, number>>({})

    const { surveyId } = useParams();

    const numericSurveyId = useMemo(() => {
    const n = Number(surveyId);
    return Number.isFinite(n) ? n : undefined;
  }, [surveyId]);

    console.log("surveyId param:", surveyId, "numericSurveyId:", numericSurveyId);

    const { survey, loading, error } = useSurvey(numericSurveyId);

    const questions: UIQuestion[] = useMemo(() => {
    if (!survey) return [];

    return [...survey.questions]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((q, idx) => {
        const id = `q${idx + 1}`;

        // default to rating for now
        return {
          id,
          dbId: q.id,
          label: `Question ${idx + 1}`,
          title: q.question_text,
          type: "rating",
        };
      });
  }, [survey]);


    const scrollToQuestion = (questionId: string) => {
        const section = document.getElementById(questionId)
        if (section) {
            setActiveQuestion(questionId)
            section.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    };

    if (loading) return <main className="survey-page">Loading survey…</main>;
    if (error) return <main className="survey-page">Error: {error}</main>;
    if (!survey) return <main className="survey-page">Survey not found.</main>;

    return (
        <main className="survey-page">
            <SurveyNav
                questions={questions}
                activeQuestion={activeQuestion}
                onSelect={scrollToQuestion}
            />

            <section className="survey-content">
                <h1 className="survey-title">SURVEY 1</h1>

                {questions.map((question) => (
                    <RatingQuestion
                        key={question.id}
                        id={question.id}
                        title={question.title}
                        rating={ratings[question.id]}
                        onRate={(value) =>
                            setRatings((current) => ({ ...current, [question.id]: value }))
                        }
                        />
                    )
                )}

                <div className="survey-submit-row">
                    <button type="button" className="survey-submit-button">
                        Submit Survey
                    </button>
                    <button type="button" className="survey-clear-button">
                        Clear Survey
                    </button>
                </div>
            </section>
        </main>
    )
}

export default Survey