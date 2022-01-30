import React from "react";
import s from "./CommentShow.module.css";

const CommentShow = (props) => {
  return (
    <div
      className={`${s.showCommentReplies}${
        !props.showReply ? " " + s.showCommentMore : ""
      }`}
      onClick={props.onClick}
    >
      {props.showReply
        ? `PRIKAŽI ODGOVORE (${props.showReply})`
        : "PRIKAŽI JOŠ KOMENTARA"}
    </div>
  );
};

export default CommentShow;
