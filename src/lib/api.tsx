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

// auth

export async function resetPassword(email: string) {
  try {
    const res = api.post(`auth/forgot-password`,{email:email} );
    return res;
  } catch (error) {
    console.log(error);
  }
}

export async function verifyOTP({
  email,
  otp,
}: {
  email: string;
  otp: string;
}) {
  try {
    const res = api.post(`auth/verify-otp`, { email, otp });
    return res;
  } catch (error) {
    console.log(error);
  }
}

// export async function createPassword(newPassword: string) {
//   try {
//     const res = api.post(`auth/reset-password`, newPassword);
//     return res;
//   } catch (error) {
//     console.log(error);
//   }
// }
// export async function createPassword(token:string,newPassword: string) {
//   try {
//     const res = await api.post(`auth/reset-password`, {
//       newPassword,
//     });
//     return res.data;
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// }

export async function createPassword(token: string, newPassword: string) {
  try {
    const res = await api.post(
      `auth/reset-password`,
      { newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}


// them update
export async function themChange(data: FormData) {
  try {
    const res = await api.post(`theme`, data);
    return res.data;
  } catch (error) {
    console.log('sorry for the error',error);
  }
}
// export async function themChange(data: FormData) {
//   try {
//     const res = await fetch('theme', { // Adjust the endpoint as needed
//       method: 'POST',
//       body: data,
//     });

//     if (!res.ok) {
//       throw new Error('Failed to update theme');
//     }

//     return await res.json();
//   } catch (error) {
//     console.error('Theme change error:', error);
//     throw error;
//   }
// }

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

export async function them() {
  try {
    const res = api.get("theme");
    return res;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
  }
}
