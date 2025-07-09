import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { Button } from "@/components/ui/button";
import { isAuthenticated, login, logout } from '@/stores/authStore';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

const AuthButton: React.FC = () => {
  const $isAuthenticated = useStore(isAuthenticated);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const switchToLoginModal = () => {
    setIsRegisterModalOpen(false)
    setIsModalOpen(true);
  }

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
      <LoginModal isOpen={isModalOpen} onClose={handleCloseModal} onRegisterClick={() => setIsRegisterModalOpen(true)}/>
      <RegisterModal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} onLoginClick={switchToLoginModal}/>
    </>
  );
};

export default AuthButton;