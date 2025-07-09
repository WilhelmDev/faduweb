import React, { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { isAuthenticated, isInOnboarding } from '@/stores/authStore';
import { Button } from '@/components/ui/button';

const OnboardingModal: React.FC = () => {
  const $isAuthenticated = useStore(isAuthenticated);
  const $isInOnboarding = useStore(isInOnboarding);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const checkPath = () => {
      const currentPath = window.location.pathname;
      if ($isAuthenticated && $isInOnboarding && currentPath !== '/onboarding') {
        setShowModal(true);
      } else {
        setShowModal(false);
      }
    };

    checkPath();
    window.addEventListener('popstate', checkPath);

    return () => {
      window.removeEventListener('popstate', checkPath);
    };
  }, [$isAuthenticated, $isInOnboarding]);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50" 
         aria-modal="true"
         role="dialog">
      <div 
        className="bg-background/80 backdrop-blur-md p-8 rounded-lg shadow-lg max-w-md w-full"
      >
        <h2 className="text-2xl font-bold mb-4 text-foreground">Completa tu información</h2>
        <p className="mb-6 text-muted-foreground">
          Para acceder a todas las funcionalidades de la plataforma, es necesario que completes tu perfil.
          Esta información es esencial para brindarte una mejor experiencia.
        </p>
        <Button 
          onClick={() => window.location.href = '/onboarding'}
          className="w-full"
        >
          Completar perfil ahora
        </Button>
      </div>
    </div>
  );
};

export default OnboardingModal;