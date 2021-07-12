import React from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../../firebase';
import firebase from '../../firebase';
import s from './LoginForm.module.css';
const provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

const LoginForm = () => {
  const submitForm = (e) => {
    e.preventDefault();
    auth.signInWithPopup(provider).then((result) => {
      let credential = result.credential;
      console.log(credential.accessToken);
      var user = result.user;
      console.log(user);
    });
  };

  return (
    <form id={s.loginForm} onSubmit={submitForm}>
      <h3></h3>
      <div id={s.fbgoo}>
        <div id={s.fb}>
          <i class="fab fa-facebook"></i>
        </div>
        <div id={s.goo}>
          <img src={require('../../assets/img/gooicon.png').default} />
        </div>
      </div>
      <div id={s.nastavite}>
        <span></span>
        ili nastavite sa
        <span></span>
      </div>
      <div id={s.username}>
        <label htmlFor="username">Korisničko ime ili e-mail adresa</label>
        <input type="text" required id="username" />
      </div>
      <div id={s.password}>
        <label htmlFor="password">Lozinka</label>
        <input type="password" required id="password" />
      </div>
      <div id={s.remember}>
        <label>
          <input type="checkbox" />
          <span className={s.checkmark} />
          Zapamti me
        </label>
        <Link to="/resetpass">Zaboravljena lozinka?</Link>
      </div>
      <button type="submit">Prijavi se</button>
    </form>
  );
};

export default LoginForm;
