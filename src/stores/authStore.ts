import { atom } from 'nanostores';

export const isAuthenticated = atom(false);

export function login() {
  // Aquí iría la lógica real de login
  isAuthenticated.set(true);
}

export function logout() {
  // Aquí iría la lógica real de logout
  isAuthenticated.set(false);
}