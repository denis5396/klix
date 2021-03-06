import React, { useContext, useEffect, useRef, useState } from "react";
import LoginContext from "../../context";
import { auth, db } from "../../firebase";
import s from "./EditProfile.module.css";

const EditProfile = () => {
  const ctx = useContext(LoginContext);
  const [error, setError] = useState({
    username: "",
    password: "",
    success: "",
  });
  const username = useRef();
  const avatarColor = useRef();
  const password = useRef();
  const repeatPassword = useRef();
  const gender = useRef();

  const [uData, setUData] = useState({
    username: "",
    avatarColor: "",
    password: "",
    gender: "",
  });

  useEffect(() => {
    let clrUser = ctx.user.avatarColor;

    for (let i = 0; i < avatarColor.current.children.length; i++) {
      let temp = window
        .getComputedStyle(avatarColor.current.children[i])
        .getPropertyValue("background-color")
        .match(/(\d+)/g);
      temp = rgbToHex(+temp[0], +temp[1], +temp[2]);
      if (temp === clrUser) {
        avatarColor.current.children[i].children[0].click();
      }
    }
    if (ctx.user.gender === "Ženski") {
      gender.current.children[1].children[0].click();
    }
  }, []);

  const rgbToHex = (r, g, b) =>
    [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
  //  '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');

  const saveInfo = async () => {
    setError((old) => {
      return { ...old, success: "" };
    });
    let usernameVal =
      username.current.value.trim().length >= 4 &&
      username.current.value.trim().length <= 20
        ? username.current.value.trim()
        : "";
    const ok =
      username.current.value.trim().length >= 4 &&
      username.current.value.trim().length <= 20;
    console.log(ok);
    console.log(usernameVal);
    let passwordNum;
    if (password.current.value.trim().length > 0) {
      passwordNum = /\d/.test(password.current.value.trim());
    }
    let check = true;
    let clr;
    let genderVal;
    let passwordVal;
    for (let i = 0; i < avatarColor.current.children.length; i++) {
      if (avatarColor.current.children[i].children[0].checked) {
        clr = window
          .getComputedStyle(avatarColor.current.children[i])
          .getPropertyValue("background-color");
        // console.log(rgbToHex(clr));
        clr = clr.match(/(\d+)/g);
        clr = rgbToHex(+clr[0], +clr[1], +clr[2]);
      }
    }
    for (let i = 0; i < gender.current.children.length; i++) {
      if (gender.current.children[i].children[0].checked) {
        genderVal = gender.current.children[i].children[1].textContent;
      }
    }
    if (
      password.current.value.trim().length >= 6 &&
      repeatPassword.current.value.trim() === password.current.value.trim() &&
      passwordNum
    ) {
      passwordVal = password.current.value;
      setError((old) => {
        return {
          ...old,
          password: "",
        };
      });
    } else if (
      password.current.value.trim().length >= 6 &&
      repeatPassword.current.value.trim() !== password.current.value.trim() &&
      repeatPassword.current.value.trim().length > 0 &&
      passwordNum
    ) {
      check = false;
      setError((old) => {
        return {
          ...old,
          password: "Lozinke se ne podudaraju.",
        };
      });
    } else if (
      password.current.value.trim().length >= 6 &&
      repeatPassword.current.value.trim().length === 0 &&
      passwordNum
    ) {
      check = false;
      setError((old) => {
        return {
          ...old,
          password: "Ponovite lozinku.",
        };
      });
    } else if (
      password.current.value.trim().length < 6 &&
      password.current.value.trim().length > 0 &&
      passwordNum
    ) {
      check = false;
      setError((old) => {
        return {
          ...old,
          password: "Lozinka mora imati minimalno 6 karaktera.",
        };
      });
    } else if (
      password.current.value.trim().length < 6 &&
      password.current.value.trim().length > 0 &&
      !passwordNum
    ) {
      check = false;
      setError((old) => {
        return {
          ...old,
          password:
            "Lozinka mora imati minimalno 6 karaktera i barem jedan broj",
        };
      });
    } else if (
      password.current.value.trim().length >= 6 &&
      // repeatPassword.current.value.trim() === password.current.value.trim() &&
      !passwordNum
    ) {
      check = false;
      setError((old) => {
        return {
          ...old,
          password: "Lozinka mora imati minimalno jedan broj",
        };
      });
    } else if (
      password.current.value.trim().length === 0 &&
      repeatPassword.current.value.trim().length === 0
    ) {
      setError((old) => {
        return {
          ...old,
          password: "",
        };
      });
    }
    console.log(clr);
    console.log(usernameVal ? usernameVal : ctx.user.displayName);
    if (usernameVal.includes(" ") && ok) {
      check = false;
      setError((old) => {
        return {
          ...old,
          username: "Korisničko ime ne može imati razmak, koristite _ ili -",
        };
      });
    } else if (usernameVal.includes(" ") && !ok) {
      check = false;
      setError((old) => {
        return {
          ...old,
          username:
            "Korisničko ime ne može imati razmak, koristite _ ili -, i mora imati između 4 i 20 karaktera",
        };
      });
    } else if (!usernameVal.includes(" ") && !ok) {
      check = false;
      setError((old) => {
        return {
          ...old,
          username: "Korisničko ime mora imati između 4 i 20 karaktera",
        };
      });
    } else {
      usernameVal = usernameVal ? usernameVal : ctx.user.displayName;
      setError((old) => {
        return {
          ...old,
          username: "",
        };
      });
    }
    passwordVal = passwordVal ? passwordVal : "";
    genderVal = genderVal ? genderVal : "";
    if (check) {
      // setUData({
      //   username: usernameVal ? usernameVal : ctx.user.displayName,
      //   avatarColor: clr ? clr : ctx.user.avatarColor,
      //   password: passwordVal
      //     ? passwordVal
      //     : ctx.user.password
      //     ? ctx.user.password
      //     : "",
      //   gender: genderVal ? genderVal : "",
      // });
      let oldObjCopy;
      const userNameExists = await checkIfUserNameExists(usernameVal);
      console.log(userNameExists);
      console.log("see?");
      if (userNameExists || usernameVal === ctx.user.displayName) {
        setError((old) => {
          return {
            ...old,
            success: "Trenutno korisničko ime je zauzeto.",
          };
        });
        return;
      } else {
        const promises = [
          fetch(
            `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/userNames/${usernameVal}.json`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(auth.currentUser.email),
            }
          ).then((res) => res.json()),
          fetch(
            `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/userNames/${ctx.user.displayName}.json`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            }
          ).then((res) => res.json()),
        ];
        const promisedData = await Promise.all(promises);
        // promisedData.then((data) => console.log(data));
        console.log(promisedData);
      }
      console.log("why?");
      ctx.setUserObj((oldObj) => {
        oldObjCopy = {
          ...oldObj,
          displayName: usernameVal,
          avatarColor: clr ? clr : ctx.user.avatarColor,
          password: passwordVal
            ? passwordVal
            : ctx.user.password
            ? ctx.user.password
            : "",
          gender: genderVal,
        };
        return oldObjCopy;
      });
      let keyId;
      auth.onAuthStateChanged((user) => {
        if (user) {
          if (passwordVal) {
            user
              .updatePassword(passwordVal)
              .then(() => {
                // Update successful.
                console.log("update successful");
              })
              .catch((error) => {
                // An error ocurred
                // ...
                console.log(error);
              });
          }
          const dbRef = db.ref(`/users/${user.uid}/userData`);
          dbRef.update({ ...oldObjCopy }).then((res) => {
            setError((old) => {
              return {
                ...old,
                success: "Uspješno ste editovali profil.",
              };
            });
          });
          // dbRef.get().then((snapshot) => {
          // if (snapshot.exists) {
          //   console.log(snapshot.val());
          //   const data = snapshot.val();
          //   console.log(user.uid);
          //   for (let key in data) {
          //     console.log(data[key]);
          //     if (data[key].uId === user.uid) {
          //       keyId = key;
          //       console.log(key);
          //       dbRef
          //         .child(`${key}`)
          //         .update({ ...oldObjCopy })
          //         .then((res) => {
          //           setError((old) => {
          //             return {
          //               ...old,
          //               success: 'Uspješno ste editovali profil.',
          //             };
          //           });
          //         });
          //       break;
          //     }
          //   }
          // }
          // });
        }
      });
    }

    window.scrollTo(0, 0);
  };

  const checkIfUserNameExists = async (userName) => {
    const res = await fetch(
      `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/userNames/${userName}.json`
    );
    const data = await res.json();
    console.log(data);

    return data;
  };

  useEffect(() => {
    // auth.onAuthStateChanged((user) => {
    //   if (user) {
    //     setUData({ ...uData });
    //   }
    // });
  }, []);

  return (
    <div id={s.border}>
      <div id={s.editProfileContainer}>
        <div id={s.possibleErrors}>
          {error.success ? (
            <h2>{error.success}</h2>
          ) : (
            <>
              <h2>{error.username.length > 0 ? error.username : ""}</h2>
              <h2>{error.password.length > 0 ? error.password : ""}</h2>
            </>
          )}
        </div>
        <div className={s.editProfileItem}>
          <h2>Editovanje profila</h2>
          <p>Uredite vaš korisnički profil</p>
        </div>
        <div className={`${s.editProfileItem} ${s.bundle}`}>
          <div>
            <h3>Korisničko ime</h3>
          </div>
          <div id={s.username}>
            <div>www.klix.ba/profil/</div>
            <input
              ref={username}
              type="text"
              defaultValue={ctx.user.displayName}
              spellCheck={false}
            />
          </div>
        </div>
        <div className={`${s.editProfileItem} ${s.bundle}`}>
          <div>
            <h3>Boja avatara</h3>
          </div>
          <div id={s.colors} ref={avatarColor}>
            <div className={s.radioField}>
              <input type="radio" name="radiobutton" />
            </div>
            <div className={s.radioField}>
              <input type="radio" name="radiobutton" />
            </div>
            <div className={s.radioField}>
              <input type="radio" name="radiobutton" />
            </div>
            <div className={s.radioField}>
              <input type="radio" name="radiobutton" />
            </div>
            <div className={s.radioField}>
              <input type="radio" name="radiobutton" />
            </div>
            <div className={s.radioField}>
              <input type="radio" name="radiobutton" />
            </div>
            <div className={s.radioField}>
              <input type="radio" name="radiobutton" />
            </div>
            <div className={s.radioField}>
              <input type="radio" name="radiobutton" />
            </div>
            <div className={s.radioField}>
              <input type="radio" name="radiobutton" />
            </div>
            <div className={s.radioField}>
              <input type="radio" name="radiobutton" />
            </div>
            <div className={s.radioField}>
              <input type="radio" name="radiobutton" />
            </div>
            <div className={s.radioField}>
              <input type="radio" name="radiobutton" />
            </div>
            <div className={s.radioField}>
              <input type="radio" name="radiobutton" />
            </div>
            <div className={s.radioField}>
              <input type="radio" name="radiobutton" />
            </div>
          </div>
        </div>
        <div className={`${s.editProfileItem} ${s.bundle}`}>
          <div>
            <h3>Lozinka</h3>
          </div>
          <div>
            <input id={s.password} type="password" ref={password} />
          </div>
        </div>
        <div className={`${s.editProfileItem} ${s.bundle}`}>
          <div>
            <h3>Ponovi lozinku</h3>
          </div>
          <div>
            <input
              id={s.passwordConfirm}
              type="password"
              ref={repeatPassword}
            />
          </div>
        </div>
        <div className={`${s.editProfileItem} ${s.bundle}`}>
          <div>
            <h3>Spol</h3>
          </div>
          <div id={s.gender} ref={gender}>
            <div>
              <input
                className={s.xd}
                id="spol"
                name="spol"
                type="radio"
                defaultChecked
              />
              <label htmlFor="spol">Muški</label>
            </div>
            <div>
              <input
                id="spol2"
                className={s.gender2}
                name="spol"
                type="radio"
              />
              <label htmlFor="spol">Ženski</label>
            </div>
          </div>
        </div>
        <div className={`${s.editProfileItem}`}>
          <h2>Napomena</h2>
          <p>
            Na komentarima i drugim servisima portala će biti prikazano samo
            Vaše korisničko ime i spol, dok nijedan drugi podatak neće biti
            javno dostupan.
          </p>
        </div>
        <div id={s.saveBtn}>
          <button onClick={saveInfo}>Spasi</button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
