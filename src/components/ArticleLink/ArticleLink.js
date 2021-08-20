import React from 'react';
import s from './ArticleLink.module.css';

const ArticleLink = () => {
  return (
    <div id={s.articleLink}>
      <div id={s.articleLinkImage}>
        <img src="https://firebasestorage.googleapis.com/v0/b/klix-74c29.appspot.com/o/images%2FPromo%2F-MgFb1HqkOYF1RAojD6v%2FHearthstone%20Screenshot%2003-25-21%2021.19.39.png?alt=media&token=3215a9d9-a7b6-4b2a-a5c6-7219538a0206" />
      </div>
      <div id={s.articleLinkText}>
        <h3>OPASNE PORUKE IZ MARSA</h3>
        <h3>
          Zadatak: zadaca je bila jucer i danas i nece vise biti ali ima jedan
          dan gdje ima dva tri i pet
        </h3>
      </div>
    </div>
  );
};

export default ArticleLink;
