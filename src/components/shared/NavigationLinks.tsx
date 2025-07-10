import React from 'react';
import { useStore } from '@nanostores/react';
import { isAuthenticated } from '@/stores/authStore';

const NavigationLinks: React.FC = () => {
  const $isAuthenticated = useStore(isAuthenticated);

  return (
    <nav className="flex items-center space-x-4">
      <a href="/" className="text-foreground hover:text-primary transition-colors">Opiniones</a>
      {$isAuthenticated && (
        <a href="/mis-opiniones" className="text-foreground hover:text-primary transition-colors">Mis Opiniones</a>
      )}
    </nav>
  );
};

export default NavigationLinks;