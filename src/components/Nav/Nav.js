import React from 'react';
import { Link } from 'react-router-dom';
import s from './Nav.module.css';

const Nav = () => {
  return (
    <header id={s.navHeader}>
      <div id={s.logo}>
        <Link to="/">
          <h1>klix</h1>
        </Link>
      </div>
      <ul id={s.headerUl}>
        <li>
          <span className={s.box}></span>Vijesti
        </li>
        <li>
          <span className={s.box}></span>Biznis
        </li>
        <li>
          <span className={s.box}></span>Sport
        </li>
        <li>
          <span className={s.box}></span>Magazin
        </li>
        <li>
          <span className={s.box}></span>Lifestyle
        </li>
        <li>
          <span className={s.box}></span>Scitech
        </li>
        <li>
          <span className={s.box}></span>Auto
        </li>
        <li>
          <span className={s.box}></span>Forum
        </li>
      </ul>
      <div id={s.bundle}>
        <i class="fas fa-search"></i>
        <Link to="/login">
          <i class="far fa-user"></i>
        </Link>
        <i class="fas fa-bars"></i>
      </div>
    </header>
  );
};

export default Nav;
