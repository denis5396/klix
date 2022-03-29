import React from "react";
import { useEffect, useRef } from "react";
import { auth } from "../../firebase";
import s from "./CommentType.module.css";
import { v1 as uuid } from "uuid";

const CommentType = (props) => {
  const textareaRef = useRef();
  useEffect(() => {
    console.log(props);
  }, [props]);

  const objaviKomentar = () => {
    if (textareaRef.current.value.length > 0) {
      let userObj = JSON.parse(localStorage.getItem("userObj"));
      const userName = userObj.displayName;
      const avatarColor = userObj.avatarColor;
      const date = new Date();
      const time = `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      // const arraycom = {};
      const arraycom = {
        userName: userName,
        avatarColor: avatarColor,
        date: time,
        comment: textareaRef.current.value,
      };
      // replies: [
      //   {
      //     userName: "user13",
      //     date: "newdate",
      //     comment: "hello",
      //     commentLikes: 0,
      //     commentDislikes: 0,
      //   },
      // ],
      const userId = auth.currentUser.uid;
      fetch(
        `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/articles/${props.path.category}/${props.path.subCategory}/-${props.path.id}/comments.json`,
        {
          method: "POST",
          body: JSON.stringify(arraycom),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          textareaRef.current.value = "";
          if (props.getComments) {
            console.log(props);
            console.log(props.getComments);
            //to fix if we write a comment on the article page instead of its comment page
            props.getComments(true);
          }
          console.log(data);
          const commentInfo = {
            articlePath: `${props.path.category}/${props.path.subCategory}/-${props.path.id}`,
            commentId: data.name,
          };
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
                  `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/comments/${
                    data === null ? 0 : data
                  }/${commentInfo.commentId}.json`,
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

      // fetch(
      //   `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/articles/${props.path.category}/${props.path.subCategory}/-${props.path.id}/comments.json`
      // )
      //   .then((response) => response.json())
      //   .then((data) => {
      //     let previousComments = {};
      //     let previousComments1 = {};
      //     console.log(data);
      //     console.log(data[1]);
      //     let incr = 1;
      // if (data[0] !== "") {
      //   for (let i = 0; i < data.length; i++) {
      //     previousComments[incr] = { ...data[i] };
      //     incr++;
      //     if (i === data.length - 1) {
      //       previousComments[0] = { ...arraycom[0] };
      //     }
      //   }
      // } else {
      //   previousComments = { ...arraycom[0] };
      // }
      // if (data[0] === undefined) {
      //   for (let i = 0; i < data.length; i++) {
      //     previousComments[data[i].commentId] = { ...data[i] };
      //     if (i === data.length - 1) {
      //       const keyValue = Object.entries(previousComments);
      //       console.log(keyValue);
      //       keyValue.splice(0, 0, [`${commentId}`, arraycom[commentId]]);
      //       console.log(keyValue);
      //       previousComments1 = Object.fromEntries(keyValue);
      //     }
      //   }
      // } else {
      //   previousComments1 = { ...arraycom };
      // }
      // console.log(previousComments1);
      // fetch(
      //   `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/articles/${props.path.category}/${props.path.subCategory}/-${props.path.id}/comments.json`,
      //   {
      //     method: "PATCH",
      //     body: JSON.stringify(arraycom),
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   }
      // )
      //   .then((response) => response.json())
      //   .then((data) => console.log(data));
    }
  };

  return (
    <div className={s.postComment}>
      <div className={s.postCommentBundle}>
        <textarea
          name="komentar"
          className={s.postCommentTextarea}
          placeholder="upiši komentar"
          ref={textareaRef}
        ></textarea>
        <button>
          <span onClick={objaviKomentar}>
            <i class="fas fa-pen"></i> Objavi komentar
          </span>
        </button>
      </div>
    </div>
  );
};

export default CommentType;
