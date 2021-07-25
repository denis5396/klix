import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import LoginContext from '../../context';
import { auth } from '../../firebase';
import UserInfo from '../UserInfo/UserInfo';
import s from './Login.module.css';
import LoginForm from './LoginForm';

const LoginP = (props) => {
  const ctx = useContext(LoginContext);
  const user = auth.currentUser;
  const history = useHistory();

  useEffect(() => {
    // if (ctx.user.displayName) {
    //   history.replace(`/profil/${ctx.user.displayName}`);
    // }
  }, []);

  return (
    <div id={!ctx.isLoggedIn ? s.border : s.borderTwo}>
      {/* {!ctx.user.displayName && <LoginForm />}
      {ctx.user.displayName && <UserInfo />} */}
      {props.children}
    </div>
  );
};

export default LoginP;
