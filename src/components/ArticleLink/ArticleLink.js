import React from "react";
import s from "./ArticleLink.module.css";

export const clrs = {
  vijesti: "#d33d3d",
  biznis: "#ef6f3e",
  sport: "#55ac53",
  magazin: "#a45091",
  lifestyle: "#e2a600",
  scitech: "#40afee",
  auto: "#487baf",
};

const ArticleLink = (props) => {
  return (
    <div id={s.articleLink}>
      <div id={s.articleLinkImage}>
        <img src={props.imageUrl} />
      </div>
      <div id={s.articleLinkText}>
        <h3 style={{ color: clrs[props.category] }}>{props.subTitle}</h3>
        <h3>{props.title}</h3>
      </div>
    </div>
  );
};

export default ArticleLink;
