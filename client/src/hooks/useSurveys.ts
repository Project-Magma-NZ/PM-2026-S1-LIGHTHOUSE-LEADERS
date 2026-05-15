import { useEffect, useState } from "react";
import { listAvailableSurveys, type SurveyListItemWithStatus } from "../services/surveys";

export function useSurveys() {
  const [surveys, setSurveys] = useState<SurveyListItemWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await listAvailableSurveys();
        if (mounted) setSurveys(data);
      } catch (err: any) {
        if (mounted) setError(err?.response?.data?.detail ?? "Failed to load surveys");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return { surveys, loading, error };
}