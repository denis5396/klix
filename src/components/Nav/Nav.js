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
          <Link to={{ pathname: "/Vijesti" }}>
            <span className={s.box}></span>Vijesti
          </Link>
        </li>
        <li>
          <Link to={{ pathname: "/Biznis" }}>
            <span className={s.box}></span>Biznis
          </Link>
        </li>
        <li>
          <Link to={{ pathname: "/Sport" }}>
            <span className={s.box}></span>Sport
          </Link>
        </li>
        <li>
          <Link to={{ pathname: "/Magazin" }}>
            <span className={s.box}></span>Magazin
          </Link>
        </li>
        <li>
          <Link to={{ pathname: "/Lifestyle" }}>
            <span className={s.box}></span>Lifestyle
          </Link>
        </li>
        <li>
          <Link to={{ pathname: "/Scitech" }}>
            <span className={s.box}></span>Scitech
          </Link>
        </li>
        <li>
          <Link to={{ pathname: "/Auto" }}>
            <span className={s.box}></span>Auto
          </Link>
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
