import React from 'react';

import s from './Modal.module.css';

const Modal = (props, ref) => {
  return (
    <div id={s.modal} ref={ref} onClick={props.handleClick}>
      <div>Da li ste sigurni?</div>
      <div id={s.modalBtns}>
        <button>Da</button>
        <button>Ne</button>
      </div>
    </div>
  );
};

export default React.forwardRef(Modal);
