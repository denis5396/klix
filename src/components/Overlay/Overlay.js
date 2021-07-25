import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import ReactDOM from 'react-dom';
import LoginContext from '../../context';
import s from './Overlay.module.css';

const Overlay = (props) => {
  const ctx = useContext(LoginContext);
  const handleClick = (e) => {
    const id = e.target.id;
    console.log(id);
    if (
      (ctx.overlay && id.includes('overlay')) ||
      (ctx.overlay && e.target.textContent === 'Ne')
    ) {
      ctx.handleOverlay();
    } else if (ctx.overlay && e.target.textContent === 'Da') {
      props.handleConfirm();
      ctx.handleOverlay();
    }
  };

  useEffect(() => {
    // return () => {
    //   alert('d');
    //   setHide(false);
    // };
  }, []);

  return (
    <div id={s.overlay} onClick={handleClick}>
      {props.children}
    </div>
  );
};

export default Overlay;
