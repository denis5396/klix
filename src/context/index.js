import { createContext, useCallback, useState, useEffect } from 'react';
import { auth, db } from '../firebase';

let logoutTimer;
const LoginContext = createContext({
  token: '',
  isLoggedIn: false,
  user: {
    uId: '',
    displayName: '',
    gender: '',
    avatarColor: '',
    banned: false,
    registered: '',
    comments: [],
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
  return remainingDuration;
};

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem('token');
  const storedExpirationDate = localStorage.getItem('expirationTime');

  const remainingTime = calculateRemainingTime(storedExpirationDate);

  if (remainingTime <= 60000) {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    return null;
  }

  return {
    token: storedToken,
    duration: remainingTime,
  };
};

export const LoginContextProvider = (props) => {
  const tokenData = retrieveStoredToken();
  let initialToken;
  if (tokenData) {
    initialToken = tokenData.token;
  }
  const userObjInitial = {
    uId: '',
    displayName: '',
    gender: 'Još niste odabrali',
    avatarColor: 'c1c1c1',
    banned: 'Ne',
    registered: '',
    comments: [],
  };
  const [userObj, setUserObj] = useState(
    JSON.parse(localStorage.getItem('userObj')) || userObjInitial
  );
  const [token, setToken] = useState(initialToken);

  const userIsLoggedIn = !!token;

  const [overlay, setOverlay] = useState(false);

  const handleOverlay = () => {
    if (overlay) {
      setOverlay(false);
    } else {
      setOverlay(true);
    }
  };

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const dbRef = db.ref();
        dbRef
          .child('users')
          .get()
          .then((snapshot) => {
            if (snapshot.exists) {
              console.log(snapshot.val());
              const data = snapshot.val();
              for (let key in data) {
                if (data[key].uId === user.uid) {
                  setUserObj({ ...data[key] });
                }
              }
            }
          });
      }
    });

    return () => {
      logoutHandler();
    };
  }, []);

  useEffect(() => {
    if (userObj) {
      localStorage.setItem('userObj', JSON.stringify(userObj));
    }
  }, [userObj]);

  const signUp = (uid, displayName, date) => {
    const userObjCopy = { ...userObj, displayName, uId: uid, registered: date };
    const dbRef = db.ref();
    let check = false;
    dbRef
      .child('users')
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          console.log(snapshot.val());
          const data = snapshot.val();
          for (let key in data) {
            if (data[key].uId === uid) {
              check = true;
              setUserObj({ ...userObjCopy });
            }
          }
          if (!check) {
            setUserObj({ ...userObjCopy });
            auth.onAuthStateChanged((user) => {
              if (user) {
                user.getIdToken(true).then((idToken) => {
                  fetch(
                    `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/users.json?auth=${idToken}`,
                    {
                      method: 'POST',
                      body: JSON.stringify({ ...userObjCopy }),
                      headers: {
                        'Content-Type': 'application/json',
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
      });
  };

  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    localStorage.removeItem('userObj');
    setUserObj(userObjInitial);
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
    auth.signOut();
  }, []);

  const loginHandler = (token, expirationTime) => {
    setToken(token);
    console.log(token);
    localStorage.setItem('token', token);
    localStorage.setItem('expirationTime', expirationTime);

    const remainingTime = calculateRemainingTime(expirationTime);

    logoutTimer = setTimeout(logoutHandler, remainingTime);
  };

  useEffect(() => {
    if (tokenData) {
      console.log(tokenData.duration);
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
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
