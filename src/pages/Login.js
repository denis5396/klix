import React from 'react';
import LoginP from '../components/Login/Login';
import Nav from '../components/Nav/Nav';

const Login = (props) => {
  return (
    <>
      <Nav />
      <LoginP>{props.children}</LoginP>
    </>
  );
};

export default Login;
