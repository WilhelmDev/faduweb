// src/components/shared/ModalProvider.tsx
import React from 'react';
import { useStore } from '@nanostores/react';
import { isLoginModalOpen, isRegisterModalOpen, openLoginModal, openRegisterModal, closeModals, isCreateOpinionModalOpen } from '@/stores/modalStore';
import LoginModal from '../LoginModal';
import RegisterModal from '../RegisterModal';
import CreateOpinionModal from '@/components/opinions/CreateOpinionModal';

export const ModalProvider: React.FC = () => {
  const $isLoginModalOpen = useStore(isLoginModalOpen);
  const $isRegisterModalOpen = useStore(isRegisterModalOpen);
  const $isCreateOpinionModalOpen = useStore(isCreateOpinionModalOpen);

  return (
    <>
      <LoginModal 
        isOpen={$isLoginModalOpen} 
        onClose={closeModals} 
        onRegisterClick={openRegisterModal}
      />
      <RegisterModal 
        isOpen={$isRegisterModalOpen} 
        onClose={closeModals} 
        onLoginClick={openLoginModal}
      />
    </>
  );
};