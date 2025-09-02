
import React, { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { faculties, loadingFaculties } from '@/stores/facultyStore';
import { Loader2 } from 'lucide-react';

interface ContentLoaderProps {
  children: React.ReactNode;
}

const ContentLoader: React.FC<ContentLoaderProps> = ({ children }) => {
  const $faculties = useStore(faculties);
  const $loadingFaculties = useStore(loadingFaculties);
  const [isReady, setIsReady] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    // Verificamos si las facultades ya están cargadas
    if (!$loadingFaculties && $faculties.length > 0) {
      // Añadimos un pequeño delay para asegurar que todo esté listo
      const timer = setTimeout(() => {
        setIsReady(true);
        
        // Añadimos una transición suave para ocultar el loader
        setTimeout(() => {
          setShowLoader(false);
        }, 300);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [$loadingFaculties, $faculties]);

  if (showLoader) {
    return (
      <div 
        className={`fixed inset-0 bg-background flex flex-col items-center justify-center z-50 transition-opacity duration-300 ${isReady ? 'opacity-0' : 'opacity-100'}`}
      >
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium text-muted-foreground">Cargando información...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ContentLoader;
