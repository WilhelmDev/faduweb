import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { Button } from "@/components/ui/button";
import { isAuthenticated, logout, getCurrentUser } from '@/stores/authStore';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import { LogOut } from 'lucide-react'; // Importamos el icono de LogOut de lucide-react
import { openLoginModal } from '@/stores/modalStore';

const AuthButton: React.FC = () => {
  const $isAuthenticated = useStore(isAuthenticated);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const $currentUser = getCurrentUser();
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const switchToLoginModal = () => {
    setIsRegisterModalOpen(false)
    setIsModalOpen(true);
  }

  if ($isAuthenticated && $currentUser) {
    return (
      <Button 
        variant="outline" 
        onClick={logout} 
        className="flex items-center space-x-2"
      >
        <span>{$currentUser.name}</span>
        <LogOut className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button variant="secondary" onClick={openLoginModal}>
      Iniciar sesión
    </Button>
  );
};

export default AuthButton;