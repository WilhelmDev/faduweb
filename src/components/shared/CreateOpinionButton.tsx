import React from 'react';
import { Button } from "@/components/ui/button";
import { useStore } from '@nanostores/react';
import { isAuthenticated } from '@/stores/authStore';
import { toast } from 'sonner';
import { openCreateOpinionModal, openLoginModal } from '@/stores/modalStore';

const CreateOpinionButton: React.FC = () => {
  const $isAuthenticated = useStore(isAuthenticated);
  const handleCreateOpinion = () => {
    if (!$isAuthenticated) {
      toast.error('Debes iniciar sesión', {
        position: 'top-center',
        duration: 3000,
        description: 'Para crear una opinión o ver tus opiniones debes iniciar sesión.',
      });
      openLoginModal()
    } else {
      openCreateOpinionModal();
    }
  };

  return (
    <Button 
      onClick={handleCreateOpinion} 
      variant="secondary" 
    >
      Crear Opinión
    </Button>
  );
};

export default CreateOpinionButton;