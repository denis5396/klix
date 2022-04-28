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
                {/* <h1>plus</h1> */}
                <svg
                  className={`${s.wlogo} ${s.hlogo}`}
                  id="logo"
                  data-name="logo"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 57.93 24"
                >
                  <defs>
                    <style
                      dangerouslySetInnerHTML={{
                        __html:
                          ".cls-1{fill:#1599c9;}.cls-2,.cls-3{fill:#6a696e;}.cls-3{fill-rule:evenodd;}",
                      }}
                    />
                  </defs>
                  <title>Klix logo</title>
                  <polygon
                    className="cls-1"
                    points="42.81 4.37 38.48 8.69 43.98 14.18 38.48 19.68 42.81 24 52.63 14.18 42.81 4.37"
                  />
                  <rect
                    className="cls-2"
                    x="29.44"
                    y="4.74"
                    width="6.32"
                    height="18.95"
                  />
                  <rect
                    className="cls-2"
                    x="20.33"
                    width="6.32"
                    height="23.68"
                  />
                  <rect className="cls-2" width="6.32" height="23.68" />
                  <polygon
                    className="cls-3"
                    points="17.86 8.76 13.58 4.47 8.08 9.97 3.8 14.25 8.08 18.54 13.24 23.7 17.53 23.7 17.53 19.41 12.37 14.25 17.86 8.76"
                  />
                  <polygon
                    className="cls-2"
                    points="57.93 8.69 53.18 13.56 48.86 9.24 53.6 4.37 57.93 8.69"
                  />
                  <polygon
                    className="cls-2"
                    points="48.86 19.12 53.6 24 57.93 19.68 53.18 14.8 48.86 19.12"
                  />
                </svg>
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
