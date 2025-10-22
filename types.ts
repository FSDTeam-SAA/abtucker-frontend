export interface Theme {
  colors: string[];
  logo: string | null;
}

export interface FormSubmission {
  _id: string;
  serial: number;
  childName: string;
  age: number;
  quote: string;
  status: "active" | "deactivate" | "pending";
  photos: string[] | null | File[];
  createdAt: string;
}

export interface SubmissionType {
  _id: string;
  serial: number;
  childName: string;
  age: number;
  quote: string;
  status: "active" | "deactivate" | "pending";
  photos: File[] | null;
  createdAt: string;
  email?:string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
}

export type SubmissionStatus = "pending" | "approved" | "rejected";
