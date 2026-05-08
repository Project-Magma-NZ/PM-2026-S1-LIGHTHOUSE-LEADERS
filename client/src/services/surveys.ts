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



export async function listSurveys(): Promise<SurveyListItem[]> {
  const res = await api.get<SurveyListItem[]>("/surveys");
  return res.data;
}

export async function getSurvey(surveyId: number): Promise<SurveyDetail> {
  const res = await api.get<SurveyDetail>(`/survey/${surveyId}`);
  return res.data;
}
