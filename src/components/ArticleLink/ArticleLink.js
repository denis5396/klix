import React from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { splitTitle } from "../HomeMain/HomeMain";
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
  useEffect(() => {
    console.log(props);
  }, []);
  return (
    <div id={s.articleLink}>
      <Link
        to={{
          pathname: encodeURI(
            `/${props.category}/${props.subCategory}/${splitTitle(
              props.title
            )}/${props.id}`
          ),
          state: undefined,
        }}
      >
        <div id={s.articleLinkImage}>
          <img src={props.imageUrl} />
        </div>
        <div id={s.articleLinkText}>
          <h3 style={{ color: clrs[props.category.toLowerCase()] }}>
            {props.subTitle}
          </h3>
          <h3>{props.title}</h3>
        </div>
      </Link>
    </div>
  );
};

export default ArticleLink;
