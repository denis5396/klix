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
  const [errMsg, setErrMsg] = useState(null);
  const [forgotten, setForgotten] = useState(false);
  const history = useHistory();
  const emailRef = useRef();
  const passwordRef = useRef();
  const rememberMe = useRef();
  const user = auth.currentUser;
  const newPassword = "jedandvatri";
  const newEmail = "denis5396@gmail.com";

  const API_KEY = "AIzaSyDDpLMfCuKs4jQJwf_5xsNQ5VuSBPZtIDk";

  const handleError = (err) => {
    console.log(err);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    let url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;
    let expirationTime;
    console.log(emailRef.current.value);
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
    await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: userNameLoginEmail || emailRef.current.value,
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
            localStorage.setItem("rememberMe", true);
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
              let date = new Date()
                .toJSON()
                .slice(0, 10)
                .split("-")
                .reverse()
                .join(".");
              ctx.signUp(user.uid);
              if (!rememberMe.current.checked) {
                ctx.login(data.idToken, expirationTime.toISOString());
              }
              console.log(data);
              history.push("/");
            }
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });

    auth
      .signInWithEmailAndPassword(
        userNameLoginEmail || emailRef.current.value,
        passwordRef.current.value
      )
      .then((userCredential) => {
        const uId = userCredential.user.providerData[0].uid.slice(0, 10);
        console.log(userCredential.user);
        console.log(userCredential.user.refreshToken);
      })
      .catch((err) => {
        console.log(err);
        if (err.code.includes("user-not-found")) {
          setErrMsg("Email adresa ne odgovara nijednom profilu.");
        } else if (err.code.includes("password")) {
          setErrMsg("Lozinka je neispravna.");
        } else if (err.code.includes("too-many-requests")) {
          setErrMsg(
            "Previse puta ste unijeli pogresne podatke, tako da pristup ovom profilu je privremeno zabranjen, molimo vas pokusajte kasnije, ili resetujte lozinku."
          );
        }
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
          ctx.signUp(user.uid, providerName, date); //check if acc is created already or not if not push acc information to db, otherwise take data and put it in ls
          const expirationTime = new Date(new Date().getTime() + 3600 * 1000);
          if (!localStorage.getItem("rememberMe")) {
            ctx.login(user.refreshToken, expirationTime.toISOString()); //set ls with token and exp time
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
        Na portal se možeš prijaviti ili registrovati putem svog Facebook <br />
        ili Google računa.
      </p>
      <form id={s.loginForm} onSubmit={submitForm}>
        {errMsg && (
          <div id={s.error}>
            <h3>{errMsg}</h3>
          </div>
        )}
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
