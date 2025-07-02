import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { authToken, isAuthenticated } from '@/stores/authStore';

export function AuthInitializer() {
  const $authToken = useStore(authToken);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      authToken.set(token);
      isAuthenticated.set(true);
    }
  }, []);

  return null; // Este componente no renderiza nada
}