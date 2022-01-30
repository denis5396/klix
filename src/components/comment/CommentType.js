import React from "react";
import { useEffect, useRef } from "react/cjs/react.development";
import s from "./CommentType.module.css";

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
      const arraycom = {};
      arraycom[0] = {
        userName: userName,
        avatarColor: avatarColor,
        date: time,
        comment: textareaRef.current.value,
        commentLikes: 0,
        commentDislikes: 0,
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

      console.log(arraycom);
      fetch(
        `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/articles/${props.path.category}/${props.path.subCategory}/-${props.path.id}/comments.json`
      )
        .then((response) => response.json())
        .then((data) => {
          let previousComments = {};
          console.log(data);
          let incr = 1;
          if (data[0] !== "") {
            for (let i = 0; i < data.length; i++) {
              previousComments[incr] = { ...data[i] };
              incr++;
              if (i === data.length - 1) {
                previousComments[0] = { ...arraycom[0] };
              }
            }
          } else {
            previousComments = { ...arraycom[0] };
          }
          console.log(previousComments);
          fetch(
            `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/articles/${
              props.path.category
            }/${props.path.subCategory}/-${props.path.id}/comments${
              data[0] !== "" ? ".json" : "/0.json"
            }`,
            {
              method: "PATCH",
              body: JSON.stringify(previousComments),
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
            .then((response) => response.json())
            .then((data) => {
              textareaRef.current.value = "";
              if (props.getComments) {
                //to fix if we write a comment on the article page instead of its comment page
                props.getComments(true);
              }
              console.log(data);
            });
        });
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
