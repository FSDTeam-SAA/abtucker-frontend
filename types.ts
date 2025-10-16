export interface Theme {
  colors: string[]
  logo: string | null
}

export interface FormSubmission {
  id: string
  serial: number
  childName: string
  age: number
  quote: string
  status: "active" | "inactive"
  photos: string
  createdAt: string
}

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: "admin" | "user"
}

export type SubmissionStatus = "pending" | "approved" | "rejected"
