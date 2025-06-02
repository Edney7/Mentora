// src/components/Modal.jsx (Crie esta pasta e ficheiro)
import React from 'react';
import '../styles/Modal.css'; // Criaremos este CSS a seguir
import { FaTimes } from 'react-icons/fa';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}> {/* Fecha ao clicar fora */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}> {/* Impede que o clique dentro feche */}
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose} className="modal-close-btn">
            <FaTimes />
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
