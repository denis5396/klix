import React from "react";
import s from "./CommentShow.module.css";

const CommentShow = (props) => {
  return (
    <div
      className={`${s.showCommentReplies}${
        props.showAll
          ? " " + s.showAll
          : !props.showReply
          ? " " + s.showCommentMore
          : ""
      }`}
      onClick={props.onClick}
    >
      {props.showAll
        ? `PRIKAŽI SVE KOMENTARE (${props.showAll})`
        : props.showReply
        ? `PRIKAŽI ODGOVORE (${props.showReply})`
        : props.loading
        ? "Učitavam..."
        : !props.loading && "PRIKAŽI JOŠ KOMENTARA"}
    </div>
  );
};

export default CommentShow;
