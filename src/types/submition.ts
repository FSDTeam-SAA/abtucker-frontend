export interface SubmissionForm {
  childName: string;
  age: number;
  quote: string;
  photos: File | null;
  serial:string;
}

export interface Child {
  _id: string;
  childName: string;
  age: number;
  email: string;
  serial: number;
  quote: string;
  status: string;
  photos: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface Theme {
  color?: string;
  logo?: string;
  backgroundColors?: string[];  // ADD THIS
  heroImage?: string;           // ADD THIS
  catImage?: string[];          // ADD THIS
}