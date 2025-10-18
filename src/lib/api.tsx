import axios from "axios";

import { getSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.user.accessToken) {
      config.headers.Authorization = `Bearer ${session.user.accessToken}`;
    } else {
      console.warn("No token in session");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export async function Submission() {
  try {
    const res = await api.get(`form-submissions`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export async function formSubmission(data: FormData) {
  try {
    const res = await api.post(`form-submissions`, data);
    return res.data;
  } catch (error) {
    console.error(" Upload failed:", error);
    throw error;
  }
}

export async function deleteSubmission(id: string) {
  try {
    const res = await api.delete(`form-submissions/${id}`);
    return res.data;
  } catch (error) {
    console.error(" Upload failed:", error);
    throw error;
  }
}

export async function updateSubmission(id: string, status: string) {
  try {
    const res = await api.patch(`form-submissions/${id}/status`, { status });
    return res.data;
  } catch (error) {
    console.error(" Upload failed:", error);
    throw error;
  }
}
