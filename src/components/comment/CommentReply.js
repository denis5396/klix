import React, { forwardRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useRef } from "react/cjs/react.development";
import { v1 as uuid } from "uuid";
import { auth } from "../../firebase";
import s from "./CommentReply.module.css";

const CommentReply = forwardRef((props, ref) => {
  const location = useLocation();
  const textareaRef = useRef();
  const handleReply = () => {
    console.log(location.state);
    let userObj = JSON.parse(localStorage.getItem("userObj"));
    if (userObj && textareaRef.current.value.length > 2) {
      // const arrStr = `${props.commentIndex[0] / props.commentIndex[1]}`;
      // fetch(
      //   `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/articles/${
      //     location.state.articleData.category
      //   }/${location.state.articleData.subCategory}/-${
      //     location.state.articleData.id
      //   }/comments/${
      //     Array.isArray(props.commentIndexDB)
      //       ? props.commentIndexDB[0]
      //       : props.commentIndexDB
      //   }.json`
      // )
      //   .then((response) => response.json())
      //   .then((data) => {
      //     console.log(data);
      const userName = userObj.displayName;
      const avatarColor = userObj.avatarColor;
      const date = new Date();
      const time = `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      // const replyArray = { ...data };
      // if (data.replies) {
      //   replyArray.replies = [...data.replies];
      // } else {
      //   replyArray.replies = [];
      // }
      let replyObj = {
        userName: userName,
        avatarColor: avatarColor,
        date: time,
        comment: textareaRef.current.value,
      };
      const userId = auth.currentUser.uid;
      // const pathx = !Array.isArray(props.commentIndexDB) ? props.path : "";
      let articlePath =
        props && props.path
          ? props.path.split("/")
          : location.state.articleData.linkPath.split("/");
      articlePath.splice(3);
      articlePath = articlePath.join("/");
      console.log(props.path);
      // console.log(pathx);
      const path = !props.path
        ? `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/articles/${
            location.state.articleData.category
          }/${location.state.articleData.subCategory}/-${
            location.state.articleData.id
          }/comments/${
            Array.isArray(props.commentIndexDB)
              ? props.commentIndexDB[0]
              : props.commentIndexDB
          }/replies.json`
        : `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/articles/${props.path}/replies.json`;
      fetch(`${path}`, {
        method: "POST",
        body: JSON.stringify(replyObj),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          textareaRef.current.value = "";
          if (props.getComments) {
            props.getComments(true);
          } else {
            ref.current = ref.current + 1;
            props.setCommentData((old) => {
              let oldArr = [...JSON.parse(JSON.stringify(old))];
              let ind = Array.isArray(props.commentIndex)
                ? props.commentIndex[0]
                : props.commentIndex;

              replyObj.id = data.name;
              replyObj.path = `${props.path}/replies/${data.name}`;
              oldArr[ind].replies = oldArr[ind].replies
                ? [...oldArr[ind].replies, { ...replyObj }]
                : [{ ...replyObj }];
              console.log(oldArr);
              return oldArr;
            });
            props.setReplyIndex(null);
          }
          const commentInfo = {
            articlePath: !props.path
              ? `${location.state.articleData.category}/${location.state.articleData.subCategory}/-${location.state.articleData.id}`
              : articlePath,
            commentId: data.name,
            parentCommentId: Array.isArray(props.commentIndexDB)
              ? props.commentIndexDB[0]
              : props.commentIndexDB,
          };
          console.log(props.commentIndexDB);
          fetch(
            `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/comments/comLength.json`
          )
            .then((res) => res.json())
            .then((data) => {
              console.log(data);
              const sendData = data + 1;
              console.log(sendData);
              // let num = data + 10;
              // num = `${num}`;
              // num = num.substring(0, num.length - 1);
              // num = +num.concat("0");
              const promises = [
                fetch(
                  `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/comments/${data}/${commentInfo.commentId}.json`,
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(commentInfo),
                  }
                ).then((res) => res.json()),
                fetch(
                  `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/comments/comLength.json`,
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: sendData,
                  }
                ).then((res) => res.json()),
              ];
              const promiseData = Promise.all(promises);
              promiseData.then((data) => {
                console.log(data);
              });
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
});

export default CommentReply;
