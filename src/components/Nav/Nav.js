import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import LoginContext from "../../context";
import Dropdown from "../Dropdown/Dropdown";
import s from "./Nav.module.css";
import Search from "./Search";

const Nav = () => {
  const ctx = useContext(LoginContext);
  const isLogged = ctx.isLoggedIn;
  const dropdownRef = useRef();
  const headerRef = useRef();
  const [showDropdown, setShowDropdown] = useState(false);
  const [search, setSearch] = useState(false);

  return (
    <>
      <header id={s.navHeader} ref={headerRef}>
        {!search ? (
          <>
            <div id={s.logo}>
              <Link onClick={() => setShowDropdown(false)} to="/">
                <h1>plus</h1>
              </Link>
            </div>
            <ul id={s.headerUl}>
              <li>
                <Link
                  onClick={() => setShowDropdown(false)}
                  to={{ pathname: "/Vijesti" }}
                >
                  <span className={s.box}></span>Vijesti
                </Link>
              </li>
              <li>
                <Link
                  onClick={() => setShowDropdown(false)}
                  to={{ pathname: "/Biznis" }}
                >
                  <span className={s.box}></span>Biznis
                </Link>
              </li>
              <li>
                <Link
                  onClick={() => setShowDropdown(false)}
                  to={{ pathname: "/Sport" }}
                >
                  <span className={s.box}></span>Sport
                </Link>
              </li>
              <li>
                <Link
                  onClick={() => setShowDropdown(false)}
                  to={{ pathname: "/Magazin" }}
                >
                  <span className={s.box}></span>Magazin
                </Link>
              </li>
              <li>
                <Link
                  onClick={() => setShowDropdown(false)}
                  to={{ pathname: "/Lifestyle" }}
                >
                  <span className={s.box}></span>Lifestyle
                </Link>
              </li>
              <li>
                <Link
                  onClick={() => setShowDropdown(false)}
                  to={{ pathname: "/Scitech" }}
                >
                  <span className={s.box}></span>Scitech
                </Link>
              </li>
              <li>
                <Link
                  onClick={() => setShowDropdown(false)}
                  to={{ pathname: "/Auto" }}
                >
                  <span className={s.box}></span>Auto
                </Link>
              </li>
              <li>
                <span className={s.box}></span>Forum
              </li>
            </ul>
          </>
        ) : (
          <Search />
        )}
        <div id={s.bundle}>
          {search ? (
            <i
              onClick={() => setSearch((old) => !old)}
              class="fas fa-times"
              style={{ fontSize: "2rem" }}
            ></i>
          ) : (
            <i
              onClick={() => setSearch((old) => !old)}
              class="fas fa-search"
            ></i>
          )}
          {!search ? (
            <Link
              onClick={() => setShowDropdown(false)}
              to={
                ctx.user.displayName
                  ? `/profil/${ctx.user.displayName}`
                  : "/login"
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
          ) : null}
          {!showDropdown ? (
            <i
              onClick={() => {
                setShowDropdown((old) => !old);
                if (headerRef.current.nextSibling.id.includes("borderTwo")) {
                  headerRef.current.nextSibling.style.margin = "2rem auto 5rem";
                }
              }}
              class="fas fa-bars"
            ></i>
          ) : (
            <i
              style={{ fontSize: "2rem" }}
              onClick={() => {
                setShowDropdown((old) => !old);
                if (
                  headerRef.current.nextSibling.nextSibling.id.includes(
                    "tagsCnt"
                  )
                ) {
                  headerRef.current.nextSibling.nextSibling.removeAttribute(
                    "style"
                  );
                  headerRef.current.nextSibling.nextSibling.setAttribute(
                    "style",
                    "margin-top: 7.5rem !important;"
                  );
                } else if (
                  headerRef.current.nextSibling.nextSibling.id.includes(
                    "borderTwo"
                  )
                ) {
                  headerRef.current.nextSibling.nextSibling.style.margin =
                    "10rem auto 5rem";
                } else {
                  console.log(
                    headerRef.current.nextSibling.nextSibling.children[0]
                  );
                  headerRef.current.nextSibling.nextSibling.children[0].removeAttribute(
                    "style"
                  );
                  headerRef.current.nextSibling.nextSibling.children[0].setAttribute(
                    "style",
                    "margin-top: 10rem;"
                  );
                }
              }}
              class="fas fa-times"
            ></i>
          )}
        </div>
      </header>
      {showDropdown && (
        <Dropdown showHide={setShowDropdown} ref={dropdownRef} />
      )}
    </>
  );
};

export default Nav;
