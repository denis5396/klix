import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { auth } from "../../firebase";
import LoginContext from "../../context";
import firebase from "../../firebase";
import s from "./LoginForm.module.css";
const gooProvider = new firebase.auth.GoogleAuthProvider();
const fbProvider = new firebase.auth.FacebookAuthProvider();
gooProvider.addScope("https://www.googleapis.com/auth/contacts.readonly");
fbProvider.addScope("user_birthday");

const LoginForm = () => {
  const ctx = useContext(LoginContext);
  const [uId, setUid] = useState();
  const history = useHistory();
  const emailRef = useRef();
  const passwordRef = useRef();
  const rememberMe = useRef();
  const user = auth.currentUser;
  const newPassword = "jedandvatri";
  const newEmail = "denis5396@gmail.com";

  const API_KEY = "AIzaSyDDpLMfCuKs4jQJwf_5xsNQ5VuSBPZtIDk";

  const submitForm = (e) => {
    e.preventDefault();
    let url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;
    let expirationTime;
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: emailRef.current.value,
        password: passwordRef.current.value,
        returnSecureToken: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        if (data) {
          if (rememberMe.current.checked) {
            firebase
              .auth()
              .setPersistence(firebase.auth.Auth.Persistence.LOCAL);
          } else if (!rememberMe.current.checked) {
            firebase
              .auth()
              .setPersistence(firebase.auth.Auth.Persistence.SESSION);
          }
          expirationTime = new Date(
            new Date().getTime() + +data.expiresIn * 1000
          );
          auth.onAuthStateChanged((user) => {
            if (user) {
              ctx.signUp(user.uid);
              ctx.login(data.idToken, expirationTime.toISOString());
              console.log(data);
              history.push("/");
            }
          });
        }
      })
      .catch((error) => {
        alert(error.message);
      });

    auth
      .signInWithEmailAndPassword(
        emailRef.current.value,
        passwordRef.current.value
      )
      .then((userCredential) => {
        const uId = userCredential.user.providerData[0].uid.slice(0, 10);
        console.log(userCredential.user);
        console.log(userCredential.user.refreshToken);
      });

    // if (user) {
    //   alert('y');
    //   user.updateEmail(newEmail).then(() => {
    //     console.log('update successful');
    //   });
    // }
  };

  useEffect(() => {
    if (user) {
      console.log(user);
    }
  }, [user]);

  const login = (provider) => {
    provider = provider === "fb" ? fbProvider : gooProvider;
    // auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(
    if (!rememberMe.current.checked) {
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
    } else if (rememberMe.current.checked) {
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      localStorage.setItem("rememberMe", true);
      // ctx.setRememberMe(true);
    }
    auth.signInWithPopup(provider).then((result) => {
      let credential = result.credential;
      console.log(credential);
      let providerName = credential.signInMethod.includes("google")
        ? "gooUser"
        : "fbUser";
      auth.onAuthStateChanged((user) => {
        if (user) {
          console.log(user);
          providerName = providerName.concat(
            user.providerData[0].uid.slice(0, 10)
          );
          let date = new Date()
            .toJSON()
            .slice(0, 10)
            .split("-")
            .reverse()
            .join(".");
          ctx.signUp(user.uid, providerName, date);
          const expirationTime = new Date(new Date().getTime() + 3600 * 1000);
          if (!localStorage.getItem("rememberMe")) {
            ctx.login(user.refreshToken, expirationTime.toISOString());
          }
          history.push("/");
        }
      });

      // var user = result.user;
      console.log(user);
      // if (user) {
      //   user
      //     .updatePassword('jedandvatri')
      //     .then(() => {
      //       // Update successful.
      //       console.log('update successful');
      //     })
      //     .catch((error) => {
      //       // An error ocurred
      //       // ...
      //     });
      // }
      // if (user) {
      //   user.updateEmail(newEmail).then(() => {
      //     console.log('update successful');
      //   });
      // }
    });
  };

  return (
    <>
      <h1>Prijava korisnika</h1>
      <p>
        Na portal se možeš prijaviti ili registrovati putem svog Facebook ili
        Google računa.
      </p>
      <form id={s.loginForm} onSubmit={submitForm}>
        <h3></h3>
        <div id={s.fbgoo}>
          <div id={s.fb} onClick={() => login("fb")}>
            <i class="fab fa-facebook"></i>
          </div>
          <div id={s.goo} onClick={() => login("goo")}>
            <img src={require("../../assets/img/gooicon.png").default} />
          </div>
        </div>
        <div id={s.nastavite}>
          <span></span>
          ili nastavite sa
          <span></span>
        </div>
        <div id={s.username}>
          <label htmlFor="username">Korisničko ime ili e-mail adresa</label>
          <input ref={emailRef} type="text" required id="username" />
        </div>
        <div id={s.password}>
          <label htmlFor="password">Lozinka</label>
          <input ref={passwordRef} type="password" id="password" />
        </div>
        <div id={s.remember}>
          <label>
            <input type="checkbox" ref={rememberMe} />
            <span className={s.checkmark} />
            Zapamti me
          </label>
          <Link to="/resetpass">Zaboravljena lozinka?</Link>
        </div>
        <button type="submit">Prijavi se</button>
      </form>
    </>
  );
};

export default LoginForm;
