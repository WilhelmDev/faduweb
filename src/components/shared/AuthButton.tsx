import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { Button } from "@/components/ui/button";
import { isAuthenticated, login, logout } from '@/stores/authStore';
import LoginModal from './LoginModal';

const AuthButton: React.FC = () => {
  const $isAuthenticated = useStore(isAuthenticated);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  if ($isAuthenticated) {
    return (
      <Button variant="outline" onClick={logout}>
        Cerrar sesión
      </Button>
    );
  }

  return (
    <>
      <Button variant="outline" onClick={handleOpenModal}>
        Iniciar sesión
      </Button>
      <LoginModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default AuthButton;