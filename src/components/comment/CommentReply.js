import React from "react";
import { useLocation } from "react-router-dom";
import { useRef } from "react/cjs/react.development";
import s from "./CommentReply.module.css";

const CommentReply = (props) => {
  const location = useLocation();
  const textareaRef = useRef();
  const handleReply = () => {
    console.log(location.state);
    let userObj = JSON.parse(localStorage.getItem("userObj"));
    if (userObj && textareaRef.current.value.length > 2) {
      const arrStr = `${props.commentIndex[0] / props.commentIndex[1]}`;
      fetch(
        `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/articles/${
          location.state.articleData.category
        }/${location.state.articleData.subCategory}/-${
          location.state.articleData.id
        }/comments/${
          Array.isArray(props.commentIndexDB)
            ? props.commentIndexDB[0]
            : props.commentIndexDB
        }.json`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          const userName = userObj.displayName;
          const avatarColor = userObj.avatarColor;
          const date = new Date();
          const time = `${date.getFullYear()}-${
            date.getMonth() + 1
          }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
          const replyArray = { ...data };
          if (data.replies) {
            replyArray.replies = [...data.replies];
          } else {
            replyArray.replies = [];
          }
          replyArray.replies.push({
            userName: userName,
            avatarColor: avatarColor,
            date: time,
            comment: textareaRef.current.value,
            commentLikes: 0,
            commentDislikes: 0,
          });
          fetch(
            `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/articles/${
              location.state.articleData.category
            }/${location.state.articleData.subCategory}/-${
              location.state.articleData.id
            }/comments/${
              Array.isArray(props.commentIndexDB)
                ? props.commentIndexDB[0]
                : props.commentIndexDB
            }.json`,
            {
              method: "PATCH",
              body: JSON.stringify(replyArray),
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
            .then((response) => response.json())
            .then((data) => {
              textareaRef.current.value = "";
              props.getComments(true);
            });
        });
    }
  };

  return (
    <div
      id={
        Array.isArray(props.commentIndex)
          ? s.commentReplyReplies
          : s.commentReply
      }
    >
      <textarea ref={textareaRef} placeholder="upiši odgovor"></textarea>
      <div id={s.commentReplyFooter}>
        <span onClick={handleReply}>
          <i class="fas fa-pen"></i>&nbsp; Odgovori
        </span>
      </div>
    </div>
  );
};

export default CommentReply;
