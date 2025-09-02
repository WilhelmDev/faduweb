import type { Career } from "./Career"
import type { Image } from "./Image"

export interface User{
  "id": number,
  "username": string,
  "email": string,
  "password": string,
  "name": string,
  "lastname": string,
  "phone": string,
  "instagram": string,
  "web": string,
  "uid": string,
  "active": boolean,
  "career_id": number,
  "image_id": number,
  "remember_token": string,
  "device_token": string,
  "created_at": Date,
  "updated_at": Date,
  "userRole": UserRole[],
  "career": Career,
  "image": Image,
  "faculty_id": number | null,
}
export interface UserRole{
  "id": number,
  "user_id": number,
  "role_id": number,
  "created_at": Date,
  "updated_at": Date,
  "role": Role
}
export interface Role{
  "id": number,
  "name": string,
  "created_at": Date,
  "updated_at": Date
}

export type UserPayload = {
  email: string
  emailError: null,
  password: string
  passwordError: null,
  name: string
  lastname: string
  apple_user: boolean,
  role_id: number,
  username: string
}