import { useEffect, useState } from "react";
import { getSurvey, type SurveyDetail } from "../services/surveys";

export function useSurvey(surveyId: number | undefined) {
  const [survey, setSurvey] = useState<SurveyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!surveyId || Number.isNaN(surveyId)) {
      setSurvey(null);
      setError("Invalid survey id");
      setLoading(false);
      return;
    }

    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getSurvey(surveyId);
        if (mounted) setSurvey(data);
      } catch (err: any) {
        if (mounted) setError(err?.response?.data?.detail ?? "Failed to load survey");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [surveyId]);

  return { survey, loading, error };
}