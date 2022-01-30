import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect, useRef } from "react/cjs/react.development";
import s from "./CommentItem.module.css";

const CommentItem = (props) => {
  const history = useHistory();
  const location = useLocation();
  const commentLike = useRef();
  const commentDislike = useRef();
  // const [commentLikes, setCommentLikes] = useState(
  //   props.commentLikes === 0 ? 0 : props.commentLikes
  // );
  // const [commentDislikes, setCommentDislikes] = useState(
  //   props.commentDislikes === 0 ? 0 : props.commentDislikes
  // );
  const [commentLikes, setCommentLikes] = useState(
    Array.isArray(props.commentIndex)
      ? location.state.articleData.comments[props.commentIndex[0]].replies[
          props.commentIndex[1]
        ].commentLikes === 0
        ? 0
        : location.state.articleData.comments[props.commentIndex[0]].replies[
            props.commentIndex[1]
          ].commentLikes
      : location.state.articleData.comments[props.commentIndex].commentLikes ===
        0
      ? 0
      : location.state.articleData.comments[props.commentIndex].commentLikes
  );
  const [commentDislikes, setCommentDislikes] = useState(
    Array.isArray(props.commentIndex)
      ? location.state.articleData.comments[props.commentIndex[0]].replies[
          props.commentIndex[1]
        ].commentDislikes === 0
        ? 0
        : location.state.articleData.comments[props.commentIndex[0]].replies[
            props.commentIndex[1]
          ].commentDislikes
      : location.state.articleData.comments[props.commentIndex]
          .commentDislikes === 0
      ? 0
      : location.state.articleData.comments[props.commentIndex].commentDislikes
  );
  const [updateLikeDislike, setUpdateLikeDislike] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [updateLocation, setUpdateLocation] = useState(false);
  useEffect(() => {
    console.log(props.commentIndex);
    console.log(props.topComment, props.commentIndex);
    console.log(props.negativeComment, props.commentIndex);
  }, []);

  const checkOppositeFn = (data, userIp) => {
    //mode = comlikes || comdislikes
    console.log(data);
    if (data !== 0 && data) {
      for (let i = 0; i < Object.keys(data).length; i++) {
        if (userIp === data[i]) {
          return i;
        }
      }
    }
  };

  const handleLikeDislike = (opinion) => {
    setFetching(true);
    if (!fetching) {
      //to prevent the user from clicking btn again when fetching is still ongoing
      const userIp = localStorage.getItem("userIp");
      fetch(
        `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/articles/${
          location.state.articleData.category
        }/${location.state.articleData.subCategory}/-${
          location.state.articleData.id
        }/comments/${
          Array.isArray(props.commentIndex)
            ? props.commentIndexDB[0]
            : props.commentIndexDB
          // +
          //   (opinion === "like" ? "/commentLikes" : "/commentDislikes")
        }${
          Array.isArray(props.commentIndexDB)
            ? "/replies"
            : // +
              //   props.commentIndex[1] +
              //   (opinion === "like" ? "/commentLikes" : "/commentDislikes")
              ""
        }.json`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          console.log(props.commentIndex);
          if (Array.isArray(props.commentIndexDB)) {
            data = { ...data[props.commentIndexDB[1]] };
            console.log(data);
            //find out if we are working with the main comment or with one of it's replies
          }
          let check = false;
          let checkOpposite = false; //check for like/dislike, if there -1 +1 other side
          if (opinion === "like") {
            const ind = checkOppositeFn(data.commentDislikes, userIp);
            if (data.commentLikes !== 0) {
              for (let i = 0; i < Object.keys(data.commentLikes).length; i++) {
                if (userIp === data.commentLikes[i]) {
                  check = true;
                }
              }
            }
            if (typeof ind !== "number" && !check) {
              //zero can be falsy, like at first pos returns ind zero
              setCommentLikes((old) => {
                if (old) {
                  const cpyArr = [...old];
                  cpyArr.push(userIp);
                  return cpyArr;
                } else {
                  return [userIp];
                }
              });
            } else if (typeof ind === "number" && !check) {
              setCommentLikes((old) => {
                if (old) {
                  const cpyArr = [...old];
                  cpyArr.push(userIp);
                  return cpyArr;
                } else {
                  return [userIp];
                }
              });
              setCommentDislikes((old) => {
                if (old) {
                  const cpyArr = [...old];
                  cpyArr.splice(ind, 1);
                  if (cpyArr.length === 0) {
                    return 0;
                  }
                  return cpyArr;
                }
              });
            } else {
              setFetching(false);
              return;
            }
          } else {
            const ind = checkOppositeFn(data.commentLikes, userIp);
            if (data.commentDislikes !== 0) {
              for (
                let i = 0;
                i < Object.keys(data.commentDislikes).length;
                i++
              ) {
                if (userIp === data.commentDislikes[i]) {
                  check = true;
                }
              }
            }
            if (typeof ind !== "number" && !check) {
              setCommentDislikes((old) => {
                if (old !== 0) {
                  const cpyArr = [...old];
                  cpyArr.push(userIp);
                  return cpyArr;
                } else {
                  return [userIp];
                }
              });
            } else if (typeof ind === "number" && !check) {
              setCommentDislikes((old) => {
                if (old !== 0) {
                  const cpyArr = [...old];
                  cpyArr.push(userIp);
                  return cpyArr;
                } else {
                  return [userIp];
                }
              });
              setCommentLikes((old) => {
                if (old) {
                  const cpyArr = [...old];
                  cpyArr.splice(ind, 1);
                  console.log(cpyArr);
                  if (cpyArr.length === 0) {
                    return 0;
                  }
                  return cpyArr;
                }
              });
            } else {
              setFetching(false);
              return;
            }
          }
          console.log(checkOpposite);
          console.log(Object.keys(data).length);
          console.log(data);
          setUpdateLikeDislike((old) => {
            if (Array.isArray(data)) {
              console.log(data[props.commentIndexDB[1]]);
              return data[props.commentIndexDB[1]];
            } else {
              return data;
            }
          });
        });
    }
  };

  useEffect(() => {
    if (updateLikeDislike) {
      console.log(commentLikes);
      console.log(commentDislikes);
      updateLikeDislike.commentLikes = commentLikes;
      updateLikeDislike.commentDislikes = commentDislikes;
      console.log(updateLikeDislike);
      fetch(
        `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/articles/${
          location.state.articleData.category
        }/${location.state.articleData.subCategory}/-${
          location.state.articleData.id
        }/comments/${
          Array.isArray(props.commentIndexDB)
            ? props.commentIndexDB[0]
            : props.commentIndexDB
          // +
          //   (opinion === "like" ? "/commentLikes" : "/commentDislikes")
        }${
          Array.isArray(props.commentIndexDB)
            ? "/replies/" + props.commentIndexDB[1]
            : // +
              // (opinion === "like" ? "/commentLikes" : "/commentDislikes")
              ""
        }.json`,
        {
          method: "PATCH",
          body: JSON.stringify(updateLikeDislike),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setCommentDislikes((old) => {
            let cpyArr = [];
            if (typeof data.commentDislikes === "object") {
              for (
                let i = 0;
                i < Object.keys(data.commentDislikes).length;
                i++
              ) {
                cpyArr[i] = data.commentDislikes[i];
              }
            } else {
              setFetching(false);
              return 0;
            }
            setFetching(false);
            return cpyArr;
          });
          setCommentLikes((old) => {
            let cpyArr = [];
            if (typeof data.commentLikes === "object") {
              for (let i = 0; i < Object.keys(data.commentLikes).length; i++) {
                cpyArr[i] = data.commentLikes[i];
              }
            } else {
              setFetching(false);
              return 0;
            }
            setFetching(false);
            return cpyArr;
          });
          let cpyObj = [
            ...JSON.parse(JSON.stringify(location.state.articleData.comments)),
          ];
          console.log(cpyObj);
          console.log(props.commentIndex);
          if (!Array.isArray(props.commentIndex)) {
            cpyObj[props.commentIndex].commentLikes = Array.isArray(
              data.commentLikes
            )
              ? [...data.commentLikes]
              : 0;
            cpyObj[props.commentIndex].commentDislikes = Array.isArray(
              data.commentDislikes
            )
              ? [...data.commentDislikes]
              : 0;
          } else {
            cpyObj[props.commentIndex[0]].replies[
              props.commentIndex[1]
            ].commentLikes = Array.isArray(data.commentLikes)
              ? [...data.commentLikes]
              : 0;
            cpyObj[props.commentIndex[0]].replies[
              props.commentIndex[1]
            ].commentDislikes = Array.isArray(data.commentDislikes)
              ? [...data.commentDislikes]
              : 0;
          }
          console.log(cpyObj);
          console.log(cpyObj[props.commentIndex]);
          console.log(props);
          history.replace({
            state: {
              articleData: {
                ...location.state.articleData,
                comments: [...cpyObj],
              },
            },
          });
        });
      setUpdateLikeDislike(null);
    }
  }, [updateLikeDislike, commentLikes, commentDislikes]);

  useEffect(() => {
    console.log(commentLikes);
    if (Array.isArray(commentLikes)) {
      const userIp = localStorage.getItem("userIp");
      if (commentLikes.find((ip) => ip === userIp)) {
        commentLike.current.style.opacity = "0.5";
      } else {
        commentLike.current.style.opacity = "1";
      }
    } else {
      commentLike.current.style.opacity = "1";
    }
  }, [commentLikes]);
  useEffect(() => {
    console.log(commentDislikes);
    if (Array.isArray(commentDislikes)) {
      const userIp = localStorage.getItem("userIp");
      if (commentDislikes.find((ip) => ip === userIp)) {
        commentDislike.current.style.opacity = "0.5";
      } else {
        commentDislike.current.style.opacity = "1";
      }
    } else {
      commentDislike.current.style.opacity = "1";
    }
  }, [commentDislikes]);

  useEffect(() => {
    if (location) {
      // console.log("locationchanged");
    }
  }, [location]);

  const handleLike = () => {
    handleLikeDislike("like");
  };
  const handeDislike = () => {
    handleLikeDislike("dislike");
  };

  return (
    <div
      className={
        props.commentIndex.constructor.name === "Array"
          ? `${s.commentContainerReply}${
              props.negativeComment ? " " + s.negativeComment : ""
            }`
          : `${s.commentContainer}${
              props.topComment ? " " + s.topComment : ""
            }${props.negativeComment ? " " + s.negativeComment : ""}`
      }
    >
      <div className={s.commentHeader}>
        <div className={s.commentHeaderFirst}>
          <i
            class="fas fa-user"
            style={{
              backgroundColor: `#${props.avatarColor}`,
              color: "rgb(255, 255, 255)",
              padding: "1.5rem",
              borderRadius: "0.3rem",
            }}
          ></i>
        </div>
        <div className={s.commentHeaderSecond}>
          <h4>{props.displayName}</h4>
          <p>{`prije ${props.date ? props.date : "1 sekund"}`}</p>
        </div>
      </div>
      <div className={s.commentBody}>
        <p>{props.comment}</p>
      </div>
      <div className={s.commentFooter}>
        <div>
          <span className={s.like} onClick={handleLike} ref={commentLike}>
            <i class="fas fa-long-arrow-alt-up"></i>{" "}
            {commentLikes && commentLikes.length ? commentLikes.length : 0}
          </span>
          <span
            className={s.dislike}
            onClick={handeDislike}
            ref={commentDislike}
          >
            <i class="fas fa-long-arrow-alt-down"></i>{" "}
            {commentDislikes && commentDislikes.length
              ? commentDislikes.length
              : 0}
          </span>
        </div>
        <div>
          <span className={s.report}>
            <i class="far fa-flag"></i> <p>Prijavi</p>
          </span>
          <span
            className={s.reply}
            onClick={() => props.handleReply(props.commentIndex)}
          >
            <i class="fas fa-pen"></i>
            <p>Odgovori</p>
          </span>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
