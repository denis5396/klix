import React from 'react';
import s from './Login.module.css';
import LoginForm from './LoginForm';

const LoginP = () => {
  return (
    <div id={s.border}>
      <h1>Prijava korisnika</h1>
      <p>
        Na portal se možeš prijaviti ili registrovati putem svog Facebook ili
        Google računa.
      </p>
      <LoginForm />
    </div>
  );
};

export default LoginP;
