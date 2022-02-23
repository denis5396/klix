import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { timeDifference } from "../AdminPanel/EditArticle/EditArticle";
import s from "./UserComment.module.css";

export const reload = () => {
  window.location.reload();
};

const UserComment = (props) => {
  useEffect(() => {
    // console.log(props.commentData[Object.keys(props.commentData)].commentId);
    console.log(props);
  }, []);

  return (
    <div className={s.commentContainer}>
      <div className={s.commentHeader}>
        <div className={s.commentHeaderFirst}>
          <i
            class="fas fa-user"
            style={{
              backgroundColor: `#${props.commentData.avatarColor}`,
              color: "#fff",
              padding: "1.5rem",
              borderRadius: ".3rem",
            }}
          ></i>
        </div>
        <div className={s.commentHeaderSecond}>
          {/* <h4>gooUser1621584554</h4> */}
          {/* <h4>{props.commentData[Object.keys(props.commentData)].commentId}</h4> */}
          <h4 onClick={reload}>{props.commentData.userName}</h4>
          <p>
            <Link
              to={{
                pathname: `/komentar/${props.commentData.commentId}`,
                state: {
                  articleLink: props.commentData.articlePath,
                  commentId: props.commentData.commentId,
                  parentCommentId: props.commentData.parentCommentId,
                },
                search: `?${JSON.stringify({
                  articleLink: props.commentData.articlePath,
                  commentId: props.commentData.commentId,
                  parentCommentId: props.commentData.parentCommentId,
                })}`,
              }}
            >{`prije ${timeDifference(props.commentData.date)}`}</Link>
          </p>
          {/* <p>{`prije ${timeDifference(props.commentData.date)}`}</p> */}
        </div>
      </div>
      <div className={s.commentBody}>
        <p>{props.commentData.comment}</p>
      </div>
      <div className={s.commentFooter}>
        <div className={s.commentFooterF}>
          <span className={s.like}>
            <i class="fas fa-long-arrow-alt-up"></i>{" "}
            {props.commentData.commentLikes
              ? Object.keys(props.commentData.commentLikes).length
              : 0}
          </span>
          <span className={s.dislike}>
            <i class="fas fa-long-arrow-alt-down"></i>{" "}
            {props.commentData.commentDislikes
              ? Object.keys(props.commentData.commentDislikes).length
              : 0}
          </span>
        </div>
        <div>
          <span
            className={s.report}
            onClick={() =>
              props.handleReport({
                commentId: props.commentData.commentId,
                user: props.commentData.userName,
                comment: props.commentData.comment,
                search: `?${JSON.stringify({
                  comLink: `${props.commentData.articlePath}/comments/${
                    props.commentData.parentCommentId
                      ? props.commentData.parentCommentId
                      : props.commentData.commentId
                  }${
                    props.commentData.parentCommentId
                      ? "/replies/" + props.commentData.commentId
                      : ""
                  }`,
                  commentId: props.commentData.commentId,
                  parentCommentId: props.commentData.parentCommentId
                    ? props.commentData.parentCommentId
                    : undefined,
                })}`,
              })
            }
          >
            <i class="far fa-flag"></i> <p>Prijavi</p>
          </span>
          <span className={s.reply}>
            <i class="fas fa-pen"></i>
            <p>Odgovori</p>
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserComment;
