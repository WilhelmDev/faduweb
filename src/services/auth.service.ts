import type { User, UserPayload } from "@/interfaces/User";
import Api from "@/services";

export async function loginUser(userOrEmail: string, password: string) {
  try {
    const data = await Api.post<{token: string}>('/auth/login', {
      userOrEmail,
      password,
    })
    return data.token
  } catch (error) {
    throw error;
  }
}

export async function validateToken() {
  try {
    const data = await Api.get<{token: string}>('/auth/validate-token')
    return data.token
  } catch (error) {
    throw error;
  }
}

export async function createUser(payload:UserPayload) {
  try {
    const data = await Api.post<{ token:string }>('/auth/register', payload)
    return data.token
  } catch (error) {
    throw error;
  }
}

export async function updateUser(userId: number, payload: FormData) {
  try {
    const data = await Api.put<User>(`/auth/update/${userId}`, payload)
    return data
  } catch (error) {
    throw error;
  }
}

export async function revalidateToken() {
  try {
    const data = await Api.get<{token: string}>('/auth/validate-token')
    return data.token
  } catch (error) {
    throw error;
  }
}