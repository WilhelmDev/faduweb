import { atom } from 'nanostores';
import { jwtDecode } from "jwt-decode";
import type { User } from '@/interfaces/User';

// Función para obtener el token inicial del localStorage
const getInitialToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

export const authToken = atom<string | null>(getInitialToken());
export const isAuthenticated = atom<boolean>(!!getInitialToken());
export const currentUser = atom<User | null>(null);

export function login(token: string) {
  localStorage.setItem('authToken', token);
  authToken.set(token);
  isAuthenticated.set(true);
  
  // Decodificar el token y establecer los datos del usuario
  try {
    const data: { userData: User } = jwtDecode(token);
    currentUser.set(data.userData);
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    currentUser.set(null);
  }
}

export function logout() {
  localStorage.removeItem('authToken');
  authToken.set(null);
  isAuthenticated.set(false);
  currentUser.set(null);
}

// Función para obtener los datos del usuario actual
export function getCurrentUser(): User | null {
  const user = currentUser.get();
  if (user) {
    return user;
  }
  const token = authToken.get();
  if (token) {
    try {
      const data: { userData: User } = jwtDecode(token);
      currentUser.set(data.userData);
      return data.userData;
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      currentUser.set(null);
    }
  }
  return null;
}