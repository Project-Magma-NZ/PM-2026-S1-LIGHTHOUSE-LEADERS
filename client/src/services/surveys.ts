import api from "../api";

export type SurveyListItem = { // This is what goes to the dashboard to determine which surveys are todo
  id: number;
  title: string;
  audience: string;
  version: number;
  status: string;
};

export type SurveyQuestion = {
  id: number;
  survey_id: number;
  question_text: string;
  category: string;
  question_type: string;
  sort_order: number;

};

export type SurveyDetail = {
  id: number;
  title: string;
  audience: string;
  version: number;
  status: string;
  questions: SurveyQuestion[];
};

export type SubmitSurveyResponseIn = {
  answers: { question_id: number; answer: string }[];
};

export type SubmitSurveyResponseOut = {
  response_id: number;
  survey_id: number;
  submitted_at: string;
};

export type SurveyResponseOut = {
  id: number;
  survey_id: number;
  user_id: number;
  submitted_at: string;
  answers: { question_id: number; answer: string }[];
};

export type SurveyListItemWithStatus = SurveyListItem & {
  has_submitted: boolean;
  response_id: number | null;
  submitted_at: string | null;
};

export type SurveyCreateIn = {
  title: string;
  audience: string;
  version: number;
  status?: "draft" | "active" | "archived";
};

export type SurveyUpdateIn = {
  title?: string;
  audience?: string;
  version?: number;
  status?: "draft" | "active" | "archived";
};

export type SurveyQuestionCreateIn = {
  question_text: string;
  category: string;
  question_type: "text" | "rating";
  sort_order: number;
};

export async function listAvailableSurveys(): Promise<SurveyListItemWithStatus[]> {
  const res = await api.get<SurveyListItemWithStatus[]>("/survey/available");
  return res.data;
}

export async function listSurveys(): Promise<SurveyListItem[]> {
  const res = await api.get<SurveyListItem[]>("/survey");
  return res.data;
}

export async function getSurvey(surveyId: number): Promise<SurveyDetail> {
  const res = await api.get<SurveyDetail>(`/survey/${surveyId}`);
  return res.data;
}

export async function submitSurveyResponse(
  surveyId: number,
  body: SubmitSurveyResponseIn
): Promise<SubmitSurveyResponseOut> {
  const res = await api.post(`/survey/${surveyId}/responses`, body);
  return res.data;
}

export async function getMySurveyResponse(surveyId: number): Promise<SurveyResponseOut> {
  const res = await api.get(`/survey/${surveyId}/my-response`);
  return res.data;
}

export async function createSurvey(body: SurveyCreateIn): Promise<SurveyDetail> {
  const res = await api.post<SurveyDetail>("/survey", body);
  return res.data;
}

export async function addSurveyQuestions(
  surveyId: number,
  questions: SurveyQuestionCreateIn[]
): Promise<{ created: number }> {
  const res = await api.post<{ created: number }>(`/survey/${surveyId}/questions`, { questions });
  return res.data;
}

export async function updateSurvey(
  surveyId: number,
  body: SurveyUpdateIn
): Promise<SurveyDetail> {
  const res = await api.patch<SurveyDetail>(`/survey/${surveyId}`, body);
  return res.data;
}