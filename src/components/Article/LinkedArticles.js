import React from 'react';
import s from './LinkedArticles.module.css';

const LinkedArticles = () => {
  return (
    <div className={s.linkedArticle}>
      <div className={s.imageContainer}>
        <img src="https://firebasestorage.googleapis.com/v0/b/klix-74c29.appspot.com/o/images%2FPromo%2F-MgFb1HqkOYF1RAojD6v%2FHearthstone%20Screenshot%2003-25-21%2021.19.39.png?alt=media&token=3215a9d9-a7b6-4b2a-a5c6-7219538a0206" />
      </div>
      <div className={s.titles}>
        <h3>BUSIJE DONACIJA</h3>
        <h3>Pola miliona dobro poznajem stize 9. augusta bih </h3>
      </div>
    </div>
  );
};

export default LinkedArticles;
