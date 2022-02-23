import React from "react";
import s from "./CommentRules.module.css";

const CommentRules = () => {
  return (
    <div id={s.commentRulesCnt}>
      <div id={s.commentRulesBody}>
        <h1>Pravila i uslovi korištenja komentara</h1>
        <p>
          Internet portal Klix.ba je najposjećeniji i najrelevantniji internet
          medij u Bosni i Hercegovini koji postoji više od 20 godina, a kojeg
          posjećuje veliki broj korisnika iz Bosne i Hercegovine i dijaspore.
          Dok većina korisnika nije registrovana i ne piše komentare, jedan dio
          korisnika predstavljaju <b>registrovani korisnici</b> portala Klix.ba
          i oni aktivno učestvuju u <b>diskusijama</b> na člancima kroz
          komentare.
        </p>
        <p>
          Klix.ba ozbiljno shvata problem govora mržnje u komentarima i
          poduzimamo sve mjere kako bismo onemogućili objavljivanje sadržaja
          koji potiče na nasilje ili mržnju. S obzirom da dnevni broj komentara
          može biti jako veliki, trenutno je nemoguće sve komentare pregledati u
          stvarnom vremenu i reagovati na one koji krše pravila i uslove
          korištenja, pa je moguće da u pojedinim komentarima još uvijek naiđete
          na poneki sadržaj koji predstavlja govor mržnje.
        </p>
        <p>
          Stoga, molimo sve korisnike da koriste{" "}
          <b>opciju za prijavu komentara</b>
          koja se nalazi pored svakog komentara (govor mržnje, neprikladan
          riječnik, off topic, vrijeđanje, spam, reklama) i tako nam pomognu
          kako bismo prijavljene komentare prioritetnije pregledali.
          Neprimjerene komentare možete prijaviti i putem e-maila&nbsp;
          <b>komentari@klix.ba</b>, što je i način službene žalbe.
        </p>
        <h3>
          Svi korisnici su dužni da se pridržavaju sljedećih pravila uslova
          korištenja:
        </h3>
        <ul>
          <li>
            Komentari odražavaju stavove njihovih autora, a ne nužno i stavove
            uredništva i novinara internet portala Klix.ba.
          </li>
          <li>
            Molimo korisnike da se suzdrže od vrijeđanja, psovanja i vulgarnog
            izražavanja.
          </li>
          <li>
            Komentari koji su agresivni, bezobrazni, uvredljivi po bilo kojoj
            osnovi bit će uklonjeni. Ne pišite komentare koji podstiču na
            mržnju. Lični i necivilizirani napadi na bilo koga mogu rezultirati
            potpunom zabranom komentarisanja.
          </li>
          <li>
            Klix.ba zadržava pravo da zabrani komentarisanje na pojedine članke.
          </li>
          <li>
            Zbog velikog broja komentara Klix.ba nije dužan obrisati sve
            komentare koji krše pravila.
          </li>
          <li>
            Svaki čitatelj koji koristi govor mržnje može biti krivično gonjen.
          </li>
          <li>
            Klix.ba ima pravo i obavezu na zahtjev zvaničnih organa dostaviti
            sve podatke o korisniku čiji komentari sadrže govor mržnje.
          </li>
          <li>
            Portal Klix.ba zadržava pravo da obriše komentar bez najave i
            objašnjenja.
          </li>
          <li>
            Kao čitalac također prihvatate mogućnost da među komentarima mogu
            biti pronađeni sadržaji koji mogu biti u suprotnosti sa vašim
            vjerskim, moralnim i drugim načelima i uvjerenjima. Na takve
            komentare ne odgovarajte neprimjerenim riječima već ukoliko su
            uvredljivi prijavite ih po gore opisanom modelu.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CommentRules;
