import api from "../api";

export type SurveyListItem = {
  id: number;
  title: string;
  audience: string;
  version: number;
  status: string;
};

export async function listSurveys(): Promise<SurveyListItem[]> {
  const res = await api.get<SurveyListItem[]>("/surveys");
  return res.data;
}