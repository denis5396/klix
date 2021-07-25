import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoginContext from '../../context';
import { auth, db } from '../../firebase';
import UserComment from '../UserComment/UserComment';
import s from './UserInfo.module.css';

const UserConfig = () => {
  const [uData, setUData] = useState({});
  const ctx = useContext(LoginContext);
  const { user } = ctx;
  const logoutHandler = () => {
    ctx.logout();
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
              const data = snapshot.val();
              for (let key in data) {
                if (data[key].uId === user.uid) {
                  setUData({ ...data[key] });
                }
              }
            }
          });
      }
    });
  }, []);

  useEffect(() => {
    setUData({ ...ctx.user });
  }, [user]);

  // useEffect(() => {
  //   console.log(uData);
  // }, [uData]);

  return (
    <>
      <div id={s.userInfoContainer}>
        <div id={s.userInfo}>
          <div
            id={s.userInfoF}
            style={{ backgroundColor: `#${ctx.user.avatarColor}` }}
          >
            <i
              class="fas fa-user"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: '#fff',
                padding: '1rem',
                borderRadius: '.5rem',
                fontSize: '1.3rem',
              }}
            ></i>
            <h1>{uData.displayName}</h1> (
            <Link to="/mojprofil">uredi profil</Link> |
            <Link onClick={logoutHandler} to="/">
              odjavi se
            </Link>
            )
          </div>
          <div id={s.userData}>
            <div className={s.userDataItem}>
              <h3>Spol</h3>
              <p>{uData.gender}</p>
            </div>
            <div className={s.userDataItem}>
              <h3>Boja avatara</h3>
              <p>{uData.avatarColor}</p>
            </div>
            <div className={s.userDataItem}>
              <h3>Banovan</h3>
              <p>{uData.banned}</p>
            </div>
            <div className={s.userDataItem}>
              <h3>Registrovan</h3>
              <p>{uData.registered}</p>
            </div>
            <div className={s.userDataItem}>
              <h3>Komentari</h3>
              <p>1</p>
            </div>
          </div>
        </div>
        <div id={s.commentContainer}>
          <div id={s.comments}>
            <h3>Komentari korisnika</h3>
            <div>
              <UserComment />
              <UserComment />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserConfig;
