import React from 'react';
import s from './Footer.module.css';

const Footer = () => {
  return (
    <div id={s.footer}>
      <nav>
        <ul>
          <li>Početna</li>
          <li>Impressum</li>
          <li>Komentari</li>
          <li>Kontakt</li>
          <li>Marketing</li>
          <li>O nama</li>
          <li>Privatnost</li>
          <li>RSS</li>
        </ul>
      </nav>
      <div id={s.followUs}>
        Pratite nas <i class="fab fa-facebook"></i>
        <i class="fab fa-twitter"></i>
        <i class="fab fa-instagram"></i>
        <i class="fab fa-youtube"></i>
        <i class="fab fa-linkedin"></i>
      </div>
      <div id={s.cpr}>
        Copyright 2000-2021 InvolSoft d.o.o. Sarajevo. ISSN 2143-3271. Sva prava
        zadržana. Zabranjeno preuzimanje sadržaja bez dozvole izdavača.
      </div>
    </div>
  );
};

export default Footer;
