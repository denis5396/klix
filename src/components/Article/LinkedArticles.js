import React, { useState } from "react";
import { clrs } from "../ArticleLink/ArticleLink";
import s from "./LinkedArticles.module.css";

const LinkedArticles = ({ data, indL }) => {
  useState(() => {
    console.log(indL);
    console.log(indL[1] === 3 && indL[0] === 1);
  }, []);
  return (
    <div
      className={`${s.linkedArticle}${
        indL[1] === 1 ? ` ${s.linkedArticleSolo}` : ""
      }`}
      style={indL[1] === 2 && indL[0] === 1 ? { position: "static" } : null} //hide right border of second item when we have length of 2, aesthetic purpose
    >
      <div className={s.imageContainer}>
        <img
          src={data.thumbnail.replace(
            "https://firebasestorage.googleapis.com",
            "https://ik.imagekit.io/1cryg5xvxsq/tr:w-300"
          )}
        />
      </div>
      <div className={s.titles}>
        <h3
          style={{
            color: `${clrs[data.articlePath.split("/")[0].toLowerCase()]}`,
          }}
        >
          {data.subTitle}
        </h3>
        <h3>{data.title}</h3>
      </div>
    </div>
  );
};

export default LinkedArticles;
