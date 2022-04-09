import React, { forwardRef, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import s from "./Dropdown.module.css";

const Dropdown = forwardRef(({ showHide }, ref) => {
  const history = useHistory();
  useEffect(() => {
    console.log(ref);
    if (ref.current.nextSibling.id.includes("tagsCnt")) {
      ref.current.nextSibling.style.cssText += ";margin-top:2rem !important;";
    } else {
      ref.current.nextSibling.children[0].style.cssText +=
        ";margin-top:2rem !important;";
    }
  });
  useEffect(() => {
    const html = document.getElementsByTagName("html");
    html[0].style.scrollBehavior = "smooth";
    setTimeout(() => {
      window.scrollTo(0, 0);
      html[0].style.scrollBehavior = "auto";
    }, 50);
  }, []);

  const handleFn = (route) => {
    showHide(false);
    if (history.location.pathname === route) {
      ref.current.nextSibling.children[0].style.cssText +=
        ";margin-top:10rem !important;";
    } else {
      if (ref.current.nextSibling.id.includes("tagsCnt")) {
        ref.current.nextSibling.style.cssText +=
          ";margin-top:7.5rem !important;";
      }
    }
  };

  return (
    <div id={s.dropdown} ref={ref}>
      <div className={s.dropdownColumn}>
        <div className={s.dropdownItemHeader}>
          <Link onClick={() => handleFn("/")} to="/">
            <span id={s.početna}></span>
            <h3>Naslovnica</h3>
          </Link>
        </div>
        <div className={s.dropdownColumnItem}>
          <Link onClick={() => handleFn()} to="/najnovije">
            <span></span>
            <p>Najnovije</p>
          </Link>
        </div>
        <div className={s.dropdownColumnItem}>
          <Link
            onClick={() => {
              handleFn();
            }}
            to="/najčitanije"
          >
            <span></span>
            <p>Najčitanije</p>
          </Link>
        </div>
        <div className={s.dropdownColumnItem}>
          <Link
            onClick={() => {
              handleFn();
            }}
            to="/popularno"
          >
            <span></span>
            <p>Popularno</p>
          </Link>
        </div>
        <div className={s.dropdownColumnItem}>
          <Link
            onClick={() => {
              handleFn();
            }}
            to="/vremenska prognoza"
          >
            <span></span>
            <p>Vremenska prognoza</p>
          </Link>
        </div>
        <div className={s.dropdownColumnItem}>
          <Link
            onClick={() => {
              handleFn();
            }}
            to="/Dojavi vijest"
          >
            <span></span>
            <p>Dojavi vijest</p>
          </Link>
        </div>
        <div className={s.dropdownColumnItem}>
          <span></span>
          <p>Forum</p>
        </div>
      </div>
      <div className={s.dropdownColumn}>
        <div className={s.dropdownItemHeader}>
          <Link onClick={() => handleFn("/Vijesti")} to="/Vijesti">
            <span id={s.vijesti}></span>
            <h3>Vijesti</h3>
          </Link>
        </div>
        <div className={s.dropdownColumnItem}>
          <Link onClick={() => handleFn()} to="/Vijesti/BiH">
            <span></span>
            <p>BiH</p>
          </Link>
        </div>
        <div className={s.dropdownColumnItem}>
          <Link onClick={() => handleFn()} to="/Vijesti/Regija">
            <span></span>
            <p>Regija</p>
          </Link>
        </div>
        <div className={s.dropdownColumnItem}>
          <Link onClick={() => handleFn()} to="/Vijesti/Svijet">
            <span></span>
            <p>Svijet</p>
          </Link>
        </div>
        <div className={s.dropdownColumnItem}>
          <Link onClick={() => handleFn()} to="/Vijesti/Dijaspora">
            <span></span>
            <p>Dijaspora</p>
          </Link>
        </div>
        <div className={s.dropdownColumnItem}>
          <Link onClick={() => handleFn()} to="/Vijesti/Crna hronika">
            <span></span>
            <p>Crna hronika</p>
          </Link>
        </div>
        <div className={s.dropdownColumnItem}>
          <Link onClick={() => handleFn()} to="/Vijesti/Humanitarne akcije">
            <span></span>
            <p>Humanitarne akcije</p>
          </Link>
        </div>
      </div>
      <div className={s.dropdownColumn}>
        <div className={s.dropdownItemHeader}>
          <Link onClick={() => handleFn("/Biznis")} to="/Biznis">
            <span id={s.biznis}></span>
            <h3>Biznis</h3>
          </Link>
        </div>
        <div className={s.dropdownColumnItem}>
          <Link onClick={() => handleFn()} to="/Biznis/Privreda">
            <span></span>
            <p>Privreda</p>
          </Link>
        </div>
        <div className={s.dropdownColumnItem}>
          <Link onClick={() => handleFn()} to="/Biznis/Finansije">
            <span></span>
            <p>Finansije</p>
          </Link>
        </div>
        <div className={s.dropdownColumnItem}>
          <Link onClick={() => handleFn()} to="/Biznis/Investicije">
            <span></span>
            <p>Investicije</p>
          </Link>
        </div>
        <div className={s.dropdownColumnItem}>
          <Link onClick={() => handleFn()} to="/Biznis/Smart Cash">
            <span></span>
            <p>Smart Cash</p>
          </Link>
        </div>
        <div className={s.dropdownColumnItem}>
          <Link onClick={() => handleFn()} to="/Biznis/Berza">
            <span></span>
            <p>Berza</p>
          </Link>
        </div>
        <div className={s.dropdownColumnItem}>
          <Link onClick={() => handleFn()} to="/Biznis/Startupi">
            <span></span>
            <p>Startupi</p>
          </Link>
        </div>
        <div className={s.dropdownColumnItem}>
          <Link onClick={() => handleFn()} to="/Biznis/Posao">
            <span></span>
            <p>Posao</p>
          </Link>
        </div>
      </div>
      <div className={s.dropdownColumn}>
        <div className={s.dropdownItemHeader}>
          <Link onClick={() => handleFn("/Sport")} to="/Sport">
            <span id={s.sport}></span>
            <h3>Sport</h3>
          </Link>
        </div>
        <div className={s.dropdownColumnItem}>
          <Link onClick={() => handleFn()} to="/Sport/Nogomet">
            <span></span>
            <p>Nogomet</p>
          </Link>
        </div>
        <div className={s.dropdownColumnItem}>
          <Link onClick={() => handleFn()} to="/Sport/Košarka">
            <span></span>
            <p>Košarka</p>
          </Link>
        </div>
        <div className={s.dropdownColumnItem}>
          <Link onClick={() => handleFn()} to="/Sport/Tenis">
            <span></span>
            <p>Tenis</p>
          </Link>
        </div>
        <div className={s.dropdownColumnItem}>
          <Link onClick={() => handleFn()} to="/Sport/Rukomet">
            <span></span>
            <p>Rukomet</p>
          </Link>
        </div>
        <div className={s.dropdownColumnItem}>
          <Link onClick={() => handleFn()} to="/Sport/Formula 1">
            <span></span>
            <p>Formula 1</p>
          </Link>
        </div>
        <div className={s.dropdownColumnItem}>
          <Link onClick={() => handleFn()} to="/Sport/Skijanje">
            <span></span>
            <p>Skijanje</p>
          </Link>
        </div>
        <div className={s.dropdownColumnItem}>
          <Link onClick={() => handleFn()} to="/Sport/Atletika">
            <span></span>
            <p>Atletika</p>
          </Link>
        </div>
        <div className={s.dropdownColumnItem}>
          <Link onClick={() => handleFn()} to="/Sport/Borilački sportovi">
            <span></span>
            <p>Borilački sportovi</p>
          </Link>
        </div>
        <div className={s.dropdownColumnItem}>
          <Link onClick={() => handleFn()} to="/Sport/Plivanje">
            <span></span>
            <p>Plivanje</p>
          </Link>
        </div>
      </div>
      <div className={s.dropdownColumn}>
        <div className={s.dropdownItemHeader}>
          <Link onClick={() => handleFn("/Magazin")} to="/Magazin">
            <span id={s.magazin}></span>
            <h3>Magazin</h3>
          </Link>
        </div>
        <div className={s.dropdownColumnItem}>
          <Link onClick={() => handleFn()} to="/Magazin/Kultura">
            <span></span>
            <p>Kultura</p>
          </Link>
        </div>
        <div className={s.dropdownColumnItem}>
          <Link onClick={() => handleFn()} to="/Magazin/Muzika">
            <span></span>
            <p>Muzika</p>
          </Link>
        </div>
        <div className={s.dropdownColumnItem}>
          <Link onClick={() => handleFn()} to="/Magazin/Film-TV">
            <span></span>
            <p>Film/TV</p>
          </Link>
        </div>
        <div className={s.dropdownColumnItem}>
          <Link onClick={() => handleFn()} to="/Magazin/Showbiz">
            <span></span>
            <p>Showbiz</p>
          </Link>
        </div>
        <div className={s.dropdownColumnItem}>
          <Link onClick={() => handleFn()} to="/Magazin/Zanimljivosti">
            <span></span>
            <p>Zanimljivosti</p>
          </Link>
        </div>
      </div>
      <div className={s.dropdownColumn}>
        <div className={s.dropdownItemHeader}>
          <Link onClick={() => handleFn("/Lifestyle")} to="/Lifestyle">
            <span id={s.lifestyle}></span>
            <h3>Lifestyle</h3>
          </Link>
        </div>
        <div className={s.dropdownColumnItem}>
          <Link onClick={() => handleFn()} to="/Lifestyle/Moda i ljepota">
            <span></span>
            <p>Moda i ljepota</p>
          </Link>
        </div>
        <div className={s.dropdownColumnItem}>
          <Link onClick={() => handleFn()} to="/Lifestyle/Zdravlje">
            <span></span>
            <p>Zdravlje</p>
          </Link>
        </div>
        <div className={s.dropdownColumnItem}>
          <Link onClick={() => handleFn()} to="/Lifestyle/Veze i seks">
            <span></span>
            <p>Veze i seks</p>
          </Link>
        </div>
        <div className={s.dropdownColumnItem}>
          <Link onClick={() => handleFn()} to="/Lifestyle/Gastro">
            <span></span>
            <p>Gastro</p>
          </Link>
        </div>
        <div className={s.dropdownColumnItem}>
          <Link onClick={() => handleFn()} to="/Lifestyle/Kuća i ured">
            <span></span>
            <p>Kuća i ured</p>
          </Link>
        </div>
        <div className={s.dropdownColumnItem}>
          <Link onClick={() => handleFn()} to="/Lifestyle/Putovanja">
            <span></span>
            <p>Putovanja</p>
          </Link>
        </div>
        <div className={s.dropdownColumnItem}>
          <Link onClick={() => handleFn()} to="/Lifestyle/Bebe">
            <span></span>
            <p>Bebe</p>
          </Link>
        </div>
        <div className={s.dropdownColumnItem}>
          <Link onClick={() => handleFn()} to="/Lifestyle/Fitness">
            <span></span>
            <p>Fitness</p>
          </Link>
        </div>
        <div className={s.dropdownColumnItem}>
          <Link onClick={() => handleFn()} to="/Lifestyle/Ljubimci">
            <span></span>
            <p>Ljubimci</p>
          </Link>
        </div>
      </div>
      <div className={s.dropdownColumn}>
        <div className={s.dropdownItemHeader}>
          <Link onClick={() => handleFn("/Scitech")} to="/Scitech">
            <span id={s.scitech}></span>
            <h3>Scitech</h3>
          </Link>
        </div>
        <div className={s.dropdownColumnItem}>
          <Link onClick={() => handleFn()} to="/Scitech/Nauka">
            <span></span>
            <p>Nauka</p>
          </Link>
        </div>
        <div className={s.dropdownColumnItem}>
          <Link onClick={() => handleFn()} to="/Scitech/Tehnologija">
            <span></span>
            <p>Tehnologija</p>
          </Link>
        </div>
      </div>
      <div className={s.dropdownColumn}>
        <div className={s.dropdownItemHeader}>
          <Link onClick={() => handleFn("/Auto")} to="/Auto">
            <span id={s.auto}></span>
            <h3>Auto</h3>
          </Link>
        </div>
        <div className={s.dropdownColumnItem}>
          <Link onClick={() => handleFn()} to="/Auto/Testovi">
            <span></span>
            <p>Testovi</p>
          </Link>
        </div>
        <div className={s.dropdownColumnItem}>
          <Link onClick={() => handleFn()} to="/Auto/Noviteti">
            <span></span>
            <p>Noviteti</p>
          </Link>
        </div>
        <div className={s.dropdownColumnItem}>
          <Link onClick={() => handleFn()} to="/Auto/Koncepti">
            <span></span>
            <p>Koncepti</p>
          </Link>
        </div>
        <div className={s.dropdownColumnItem}>
          <Link onClick={() => handleFn()} to="/Auto/Tuning">
            <span></span>
            <p>Tuning</p>
          </Link>
        </div>
      </div>
    </div>
  );
});

export default Dropdown;
