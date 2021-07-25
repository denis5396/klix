import React from 'react';
import s from './Modal.module.css';

const Modal = () => {
  return (
    <div id={s.modal}>
      <div>Da li ste sigurni?</div>
      <div id={s.modalBtns}>
        <button>Da</button>
        <button>Ne</button>
      </div>
    </div>
  );
};

export default Modal;
