// src/components/Modal.jsx (Crie esta pasta e ficheiro)
import React from 'react';
import '../styles/Modal.css'; 
import { FaTimes } from 'react-icons/fa';

const Modal = ({ isOpen, onClose, title, children, className= '' }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}> 
      <div className={`modal-content ${className}`} onClick={(e) => e.stopPropagation()}>
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
