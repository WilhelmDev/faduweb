import { atom } from 'nanostores';

// Función para obtener el token inicial del localStorage
const getInitialToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

export const authToken = atom<string | null>(getInitialToken());

export const isAuthenticated = atom<boolean>(!!getInitialToken());

export function login(token: string) {
  localStorage.setItem('authToken', token);
  authToken.set(token);
  isAuthenticated.set(true);
}

export function logout() {
  localStorage.removeItem('authToken');
  authToken.set(null);
  isAuthenticated.set(false);
}