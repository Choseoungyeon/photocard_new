'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import Modal from '../_component/Modal';

interface ModalConfig {
  id: string;
  type: 'alert' | 'confirm' | 'error' | 'success' | 'info';
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
}

interface ModalContextType {
  showModal: (config: Omit<ModalConfig, 'id'>) => Promise<boolean>;
  closeModal: (id: string) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modals, setModals] = useState<ModalConfig[]>([]);

  const showModal = (config: Omit<ModalConfig, 'id'>): Promise<boolean> => {
    return new Promise((resolve) => {
      const id = `modal-${Date.now()}-${Math.random()}`;

      const modalConfig: ModalConfig = {
        ...config,
        id,
        onConfirm: () => {
          config.onConfirm?.();
          closeModal(id);
          resolve(true);
        },
        onCancel: () => {
          config.onCancel?.();
          closeModal(id);
          resolve(false);
        },
        onClose: () => {
          config.onClose?.();
          closeModal(id);
          resolve(false);
        },
      };

      setModals((prev) => [...prev, modalConfig]);
    });
  };

  const closeModal = (id: string) => {
    setModals((prev) => prev.filter((modal) => modal.id !== id));
  };

  return (
    <ModalContext.Provider value={{ showModal, closeModal }}>
      {children}
      {modals.map((modal) => (
        <Modal
          key={modal.id}
          open={true}
          type={modal.type}
          title={modal.title}
          message={modal.message}
          confirmText={modal.confirmText}
          cancelText={modal.cancelText}
          onConfirm={modal.onConfirm}
          onCancel={modal.onCancel}
          onClose={modal.onClose}
        />
      ))}
    </ModalContext.Provider>
  );
};
