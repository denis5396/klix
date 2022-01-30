import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoginContext from "../../context";
import s from "./Nav.module.css";

const Nav = () => {
  const ctx = useContext(LoginContext);
  const isLogged = ctx.isLoggedIn;

  return (
    <header id={s.navHeader}>
      <div id={s.logo}>
        <Link to="/">
          <h1>plus</h1>
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
        <Link
          to={
            ctx.user.displayName ? `/profil/${ctx.user.displayName}` : "/login"
          }
        >
          {!ctx.isLoggedIn && <i class="far fa-user"></i>}

          {ctx.isLoggedIn && (
            <i
              class="fas fa-user"
              style={{
                backgroundColor: `#${ctx.user.avatarColor}`,
                color: "#fff",
                padding: ".7rem",
                borderRadius: ".3rem",
                fontSize: "1.3rem",
              }}
            ></i>
          )}
        </Link>
        <i class="fas fa-bars"></i>
      </div>
    </header>
  );
};

export default Nav;
