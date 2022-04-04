import React, { useEffect } from "react";
import { getComLengthIfObject } from "../comment/Comment";
import s from "./TagArticle.module.css";

const TagArticle = ({ art }) => {
  useEffect(() => {
    console.log(art);
  }, []);
  return (
    <div className={s.tagArticle}>
      <div className={s.imageCnt}>
        <img src={art.imageText[0][0]} />
      </div>
      <div className={s.articleBodyCnt}>
        <div className={s.subTitle}>
          <h3>{art.subTitle}</h3>
        </div>
        <div className={s.title}>
          <h3>{art.title}</h3>
        </div>
        <div className={s.txt}>
          <p>{art.articleText.slice(3)}</p>
        </div>
        <div className={s.footer}>
          <span className={s.date}>{`${art.date
            .split(" ")[0]
            .split("-")
            .reverse()
            .join(".")
            .concat(".")} u ${art.date
            .split(" ")[1]
            .split(":")
            .slice(0, 2)
            .join(":")}`}</span>
          <div className={s.bundle}>
            <span>
              <svg
                class="inline h-3 w-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"></path>
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"></path>
              </svg>
              <span>
                &nbsp;{art.comments ? getComLengthIfObject(art.comments) : 0}
              </span>
            </span>
            <span>
              <svg
                class="ml-1 inline h-3 w-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"></path>
              </svg>
              <span>
                &nbsp;
                {art.shares.constructor === Object
                  ? Object.keys(art.shares).length
                  : 0}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagArticle;
