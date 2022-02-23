import React, { useRef, useState } from "react";
import { auth } from "../../firebase";
import s from "./ResetPassword.module.css";

const ResetPassword = () => {
  const emailRef = useRef(null);
  const [errMsg, setErrMsg] = useState(null);
  const reset = async () => {
    if (emailRef.current.value.length < 3) {
      return;
    }
    let userNameLoginEmail = undefined;
    if (!emailRef.current.value.includes("@")) {
      const res = await fetch(
        `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/userNames/${emailRef.current.value}.json`
      );
      userNameLoginEmail = await res.json();
      console.log(userNameLoginEmail);
      if (!userNameLoginEmail) {
        setErrMsg("Korisnicko ime ne postoji.");
        return;
      }
    }
    auth
      .sendPasswordResetEmail(userNameLoginEmail || emailRef.current.value)
      .then((data) => {
        console.log(data);
        console.log("pass email sent");
        setErrMsg("Lozinka je resetovana, provjerite vasu email adresu.");
      })
      .catch((err) => {
        console.log(err);
        if (err.code.includes("user-not-found")) {
          setErrMsg("Email adresa nije odgovarajuća.");
        }
      });
    // window.Email.send({
    //   SecureToken: "3cd1b780-5c5d-4846-9d91-2d6e018085ff",
    //   To: "denis5396@gmail.com",
    //   From: "mahmudxsd3@gmail.com",
    //   Subject: "ememail",
    //   Body: "And this is the body",
    // }).then((message) => alert(message));
  };

  return (
    <>
      <h1 id={s.header}>Zaboravljena lozinka</h1>
      <p id={s.parag}>
        Da biste resetovali vašu lozinku molimo unesite email koji ste <br />
        koristili prilikom registracije.
      </p>
      <form id={s.form} onSubmit={(e) => e.preventDefault()}>
        {errMsg && <p id={s.errMsg}>{errMsg}</p>}
        <div id={s.inputBundle}>
          <label htmlFor="email">Korisničko ime ili e-mail adresa</label>
          <input id="email" ref={emailRef} />
        </div>
        {/* <div
          class="g-recaptcha"
          data-sitekey="6LdCcWkeAAAAAJXA7ZrPRvz9iSTFq5CLLiCzrX2u"
        ></div> */}
        <button onClick={reset}>Resetuj</button>
      </form>
    </>
  );
};

export default ResetPassword;
