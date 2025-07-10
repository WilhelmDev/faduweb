// src/stores/modalStore.ts
import { atom } from 'nanostores';

export const isLoginModalOpen = atom(false);
export const isRegisterModalOpen = atom(false);
export const isCreateOpinionModalOpen = atom(false);

export function openLoginModal() {
  isLoginModalOpen.set(true);
  isRegisterModalOpen.set(false);
}

export function openRegisterModal() {
  isRegisterModalOpen.set(true);
  isLoginModalOpen.set(false);
}

export function openCreateOpinionModal() {
  isCreateOpinionModalOpen.set(true);
}

export function closeModals() {
  isLoginModalOpen.set(false);
  isRegisterModalOpen.set(false);
  isCreateOpinionModalOpen.set(false);
}
