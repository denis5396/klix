import { createContext, useCallback, useState, useEffect, useRef } from "react";
import { auth, db } from "../firebase";

const LoginContext = createContext({
  token: "",
  isLoggedIn: false,
  user: {
    uId: "",
    displayName: "",
    gender: "",
    avatarColor: "",
    banned: false,
    registered: "",
  },
  overlay: false,
  signUp: (uId, displayName, time) => {},
  setUserObj: () => {},
  login: (token) => {},
  logout: () => {},
  handleOverlay: () => {},
});

const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();
  const remainingDuration = adjExpirationTime - currentTime;
  // return 5000;
  return remainingDuration;
};

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem("token");
  const storedExpirationDate = localStorage.getItem("expirationTime");

  const remainingTime = calculateRemainingTime(storedExpirationDate);

  if (remainingTime <= 60000) {
    //60kms = 1minute
    // 3595000 -> more than 5s
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    return null;
  }

  return {
    token: storedToken,
    duration: remainingTime,
  };
};

export const LoginContextProvider = (props) => {
  const tokenData = retrieveStoredToken();
  // alert(tokenData.token);
  let initialToken;
  if (tokenData) {
    initialToken = tokenData.token;
  }

  const userObjInitial = {
    uId: "",
    displayName: "",
    gender: "Još niste odabrali",
    avatarColor: "c1c1c1",
    banned: "Ne",
    registered: "",
  };
  const [userObj, setUserObj] = useState(
    JSON.parse(localStorage.getItem("userObj")) || userObjInitial
  );
  const [token, setToken] = useState(initialToken);
  const curUser = auth.currentUser;
  const userIsLoggedIn =
    (!!token && userObj.displayName) ||
    (localStorage.getItem("rememberMe") && userObj.displayName);

  const [overlay, setOverlay] = useState(false);
  const logoutTimer = useRef(null);

  const handleOverlay = () => {
    if (overlay) {
      setOverlay(false);
    } else {
      setOverlay(true);
    }
  };

  // useEffect(() => {
  //   console.log('rerender');
  //   console.log(userObj);
  //   console.log(userIsLoggedIn);
  // });

  useEffect(() => {
    if (!logoutTimer.current && tokenData) {
      const timer = retrieveStoredToken();
      logoutTimer.current = setTimeout(logoutHandler, timer.duration);
    }
    // auth.onAuthStateChanged((user) => {
    //   if (user) {
    //     const dbRef = db.ref();
    //     dbRef
    //       .child("users")
    //       .get()
    //       .then((snapshot) => {
    //         if (snapshot.exists) {
    //           console.log(snapshot.val());
    //           const data = snapshot.val();
    //           for (let key in data) {
    //             if (data[key].uId === user.uid) {
    //               setUserObj({ ...data[key] });
    //             }
    //           }
    //         }
    //       });
    //   }
    // });

    // window.addEventListener("beforeunload", () => {
    //   setToken(null);
    //   localStorage.removeItem("token");
    //   localStorage.removeItem("expirationTime");
    //   localStorage.removeItem("userObj");
    //   setUserObj(userObjInitial);
    //   if (logoutTimer) {
    //     clearTimeout(logoutTimer);
    //   }
    // });
    return () => {
      // logoutHandler();
    };
  }, []);

  useEffect(() => {
    if (curUser) {
      // localStorage.setItem('userObj', JSON.stringify(userObj));
      console.log("userhere");
    }
  }, [curUser]);

  useEffect(() => {
    if (userObj && curUser) {
      console.log(userObj);
      localStorage.setItem("userObj", JSON.stringify(userObj));
    }
  }, [userObj]);

  const signUp = (uid, displayName, date) => {
    console.log("signupstart");
    const userObjCopy = { ...userObj, displayName, uId: uid };
    const dbRef = db.ref(`/users/${uid}/userData`);
    dbRef
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          console.log("signupsuccess");
          console.log(snapshot.val());
          const data = snapshot.val();
          if (data) {
            setUserObj({ ...data }); //for email password always, cuz u can only sign up with fb or google first and then u always go into else. and then when u add a password then user will exist and u just take the data from the db and set it to userobj
          } else {
            setUserObj({ ...userObjCopy, registered: date });
            auth.onAuthStateChanged((user) => {
              if (user) {
                user.getIdToken(true).then((idToken) => {
                  fetch(
                    `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/users/${uid}/userData.json?auth=${idToken}`,
                    {
                      method: "PUT",
                      body: JSON.stringify({
                        ...userObjCopy,
                        registered: date,
                      }),
                      headers: {
                        "Content-Type": "application/json",
                      },
                    }
                  )
                    .then((response) => response.json())
                    .then((data) => console.log(data));
                });
              }
            });
          }
        }
      })
      .catch((err) => console.log(err));
  };

  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    localStorage.removeItem("userObj");
    localStorage.removeItem("rememberMe");
    setUserObj(userObjInitial);
    if (logoutTimer.current) {
      clearTimeout(logoutTimer.current);
    }
    auth.signOut();
  }, []);

  const loginHandler = (token, expirationTime) => {
    console.log("signin");
    setToken(token);
    console.log(token);
    localStorage.setItem("token", token);
    localStorage.setItem("expirationTime", expirationTime);
    // sessionStorage.setItem("randomkey", "randomtxt");
    // document.cookie = "cookiename=cookieval";

    const remainingTime = calculateRemainingTime(expirationTime);

    logoutTimer.current = setTimeout(logoutHandler, remainingTime);
  };

  useEffect(() => {
    if (tokenData) {
      console.log(tokenData.duration);
      logoutTimer.current = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]);

  const LoginContextValue = {
    token,
    isLoggedIn: userIsLoggedIn,
    user: userObj,
    overlay: overlay,
    signUp: signUp,
    setUserObj,
    login: loginHandler,
    logout: logoutHandler,
    handleOverlay,
  };

  return (
    <LoginContext.Provider value={LoginContextValue}>
      {props.children}
    </LoginContext.Provider>
  );
};

export default LoginContext;
