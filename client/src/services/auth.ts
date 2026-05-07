import api from "../api";

export type Role = "student" | "management" | "adult" | "educator" | "parent";

export type Me = {
  id: number;
  username: string;
  first_name: string | null;
  last_name: string | null;
  role: Role;
  school_id: number | null;
};

export type SignupRequest = {
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  school_id: number;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export async function signup(payload: SignupRequest): Promise<Me> {
  const res = await api.post<Me>("/auth/signup", payload);
  return res.data;
}

export async function login(payload: LoginRequest): Promise<Me> {
  const res = await api.post<Me>("/auth/login", payload);
  return res.data;
}

export async function me(): Promise<Me> {
  const res = await api.get<Me>("/auth/me");
  return res.data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}