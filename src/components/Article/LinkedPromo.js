import React from "react";
import s from "./LinkedPromo.module.css";
import { timeDifference } from "../AdminPanel/EditArticle/EditArticle";
import { articleColors } from "../AdminPanel/EditArticle/EditArticle";
const LinkedPromo = ({ data }) => {
  return (
    <div className={s.promoItem}>
      <div className={s.promoImageCnt}>
        <img src={data.imageText[0][0]} />
      </div>
      <div className={s.promoBody}>
        <div className={s.promoTitles}>
          <h3
            style={{
              color: articleColors[data.category.toLowerCase()],
            }}
          >
            {data.subTitle}
          </h3>
          <h3>{data.title}</h3>
        </div>
        <div className={s.promoFooter}>
          <span>{data.date ? timeDifference(data.date) : ""}</span>
          <span>
            <i class="fas fa-comments"></i> 0<i class="fas fa-share-alt"></i> 0
          </span>
        </div>
      </div>
    </div>
  );
};

export default LinkedPromo;
