import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
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
    location.state.articleData
      ? Array.isArray(props.commentIndex)
        ? location.state.articleData.comments[props.commentIndex[0]].replies[
            props.commentIndex[1]
          ].commentLikes === 0
          ? 0
          : location.state.articleData.comments[props.commentIndex[0]].replies[
              props.commentIndex[1]
            ].commentLikes
        : location.state.articleData.comments[props.commentIndex]
            .commentLikes === 0
        ? 0
        : location.state.articleData.comments[props.commentIndex].commentLikes
      : props.commentLikes
      ? props.commentLikes
      : 0
  );
  const [commentDislikes, setCommentDislikes] = useState(
    location.state.articleData //fix when we are commenting from /comment/id and when we are doing it from the article
      ? Array.isArray(props.commentIndex)
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
        : location.state.articleData.comments[props.commentIndex]
            .commentDislikes
      : props.commentDislikes
      ? props.commentDislikes
      : 0
  );
  const [updateLikeDislike, setUpdateLikeDislike] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [updateLocation, setUpdateLocation] = useState(false);
  useEffect(() => {
    console.log(props.commentIndex);
    console.log(props.topComment, props.commentIndex);
    console.log(props.negativeComment, props.commentIndex);
    console.log(props);
  }, []);

  const checkOppositeFn = (data, userIp) => {
    //mode = comlikes || comdislikes
    console.log(data);
    if (data) {
      for (let key in data) {
        if (userIp === data[key]) {
          return key.split("-").join(".");
        }
      }
    }
  };

  const handleLikeDislike = (opinion) => {
    setFetching(true);
    if (!fetching) {
      //to prevent the user from clicking btn again when fetching is still ongoing
      const userIp = localStorage.getItem("userIp");
      const path = location.state.articleData
        ? `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/articles/${
            location.state.articleData.category
          }/${location.state.articleData.subCategory}/-${
            location.state.articleData.id
          }/comments/${
            Array.isArray(props.commentIndex)
              ? props.commentIndexDB[0]
              : props.commentIndexDB
          }${
            Array.isArray(props.commentIndexDB)
              ? "/replies/" + props.commentIndexDB[1]
              : ""
          }.json`
        : `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/articles/${props.path}.json`;
      console.log(path);
      fetch(path)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          console.log(props.commentIndex);
          // if (Array.isArray(props.commentIndexDB)) {
          //   data = { ...data[props.commentIndexDB[1]] };
          //   console.log(data);
          //   //find out if we are working with the main comment or with one of it's replies
          // }
          let check = false;
          let checkOpposite = false; //check for like/dislike, if there -1, +1 other side
          let key = undefined;
          if (opinion === "like") {
            if (data.commentDislikes) {
              key = checkOppositeFn(data.commentDislikes, userIp);
            }
            console.log(key);
            if (data.commentLikes) {
              for (let key in data.commentLikes) {
                if (userIp === data.commentLikes[key]) {
                  check = true;
                }
              }
            }
            if (!key && !check) {
              //zero can be falsy, like at first pos returns ind zero
              setCommentLikes((old) => {
                console.log(data.commentLikes);
                if (data.commentLikes) {
                  let cpyObj = { ...data.commentLikes };
                  cpyObj[userIp.split(".").join("-")] = userIp;
                  return cpyObj;
                } else {
                  return { [userIp.split(".").join("-")]: userIp };
                }
              });
            } else if (key && !check) {
              setCommentLikes((old) => {
                if (data.commentLikes) {
                  let cpyObj = { ...data.commentLikes };
                  cpyObj[userIp.split(".").join("-")] = userIp;
                  return cpyObj;
                } else {
                  return { [userIp.split(".").join("-")]: userIp };
                }
              });
              setCommentDislikes((old) => {
                if (data.commentDislikes) {
                  let cpyObj = { ...data.commentDislikes };
                  const ind = Object.keys(cpyObj).find(
                    (el) => el === key.split(".").join("-")
                  );
                  if (ind !== undefined) {
                    delete cpyObj[key.split(".").join("-")];
                  }
                  if (Object.keys(cpyObj).length === 0) {
                    return 0;
                  }
                  return cpyObj;
                }
              });
            } else {
              setFetching(false);
              return;
            }
          } else {
            if (data.commentLikes) {
              key = checkOppositeFn(data.commentLikes, userIp);
            }
            if (data.commentDislikes) {
              for (let key in data.commentDislikes) {
                if (userIp === data.commentDislikes[key]) {
                  check = true;
                }
              }
            }
            if (!key && !check) {
              setCommentDislikes((old) => {
                if (data.commentDislikes) {
                  const cpyObj = { ...data.commentDislikes };
                  cpyObj[userIp.split(".").join("-")] = userIp;
                  return cpyObj;
                } else {
                  return { [userIp.split(".").join("-")]: userIp };
                }
              });
            } else if (key && !check) {
              setCommentDislikes((old) => {
                if (data.commentDislikes) {
                  const cpyObj = { ...data.commentDislikes };
                  cpyObj[userIp.split(".").join("-")] = userIp;
                  return cpyObj;
                } else {
                  return { [userIp.split(".").join("-")]: userIp };
                }
              });
              setCommentLikes((old) => {
                if (data.commentLikes) {
                  const cpyObj = { ...data.commentLikes };
                  const ind = Object.keys(cpyObj).find(
                    (el) => el === key.split(".").join("-")
                  );
                  if (ind !== undefined) {
                    delete cpyObj[key.split(".").join("-")];
                  }
                  console.log(cpyObj);
                  if (Object.keys(cpyObj).length === 0) {
                    return 0;
                  }
                  return cpyObj;
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
          // setUpdateLikeDislike((old) => {
          //   if (Array.isArray(data)) {
          //     console.log(data[props.commentIndexDB[1]]);
          //     return data[props.commentIndexDB[1]];
          //   } else {
          //     return data;
          //   }
          // });
          setUpdateLikeDislike((old) => {
            if (opinion === "like" && !check) {
              // console.log(data[props.commentIndexDB[1]]);
              if (!key) {
                return ["/commentLikes/", userIp];
              } else {
                return ["/commentLikes/", userIp, "/commentDislikes/"];
              }
            } else if (opinion === "dislike" && !check) {
              if (!key) {
                return ["/commentDislikes/", userIp];
              } else {
                return ["/commentDislikes/", userIp, "/commentLikes/"];
              }
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
      let userIpNoDot = updateLikeDislike[1].split(".").join("-");
      const path = location.state.articleData
        ? `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/articles/${
            location.state.articleData.category
          }/${location.state.articleData.subCategory}/-${
            location.state.articleData.id
          }/comments/${
            Array.isArray(props.commentIndexDB)
              ? props.commentIndexDB[0]
              : props.commentIndexDB + updateLikeDislike[0] + userIpNoDot
          }${
            Array.isArray(props.commentIndexDB)
              ? "/replies/" +
                props.commentIndexDB[1] +
                updateLikeDislike[0] +
                userIpNoDot
              : ""
          }.json`
        : `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/articles/${props.path}${updateLikeDislike[0]}${userIpNoDot}.json`;
      console.log(path);
      if (updateLikeDislike.length === 2) {
        fetch(`${path}`, {
          method: "PUT",
          body: JSON.stringify(updateLikeDislike[1]),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            if (location.state.articleData) {
              let cpyObj = [
                ...JSON.parse(
                  JSON.stringify(location.state.articleData.comments)
                ),
              ];
              console.log(location.state.articleData.comments);
              console.log(cpyObj);
              console.log(props.commentIndex);
              if (!Array.isArray(props.commentIndex)) {
                if (updateLikeDislike[0] === "/commentLikes/") {
                  // cpyObj[props.commentIndex].commentLikes = commentLikes[
                  //   props.commentIndex
                  // ].commentLikes
                  //   ? {
                  //       ...commentLikes[props.commentIndex].commentLikes,
                  //       [data.split(".").join("-")]: data,
                  //     }
                  //   : { [data.split(".").join("-")]: data };
                  cpyObj[props.commentIndex].commentLikes = { ...commentLikes };
                } else if (updateLikeDislike[0] === "/commentDislikes/") {
                  // cpyObj[props.commentIndex].commentDislikes = cpyObj[
                  //   props.commentIndex
                  // ].commentDislikes
                  //   ? {
                  //       ...cpyObj[props.commentIndex].commentDislikes,
                  //       [data.split(".").join("-")]: data,
                  //     }
                  //   : { [data.split(".").join("-")]: data };
                  cpyObj[props.commentIndex].commentDislikes = {
                    ...commentDislikes,
                  };
                }
              } else {
                if (updateLikeDislike[0] === "/commentLikes/") {
                  // cpyObj[props.commentIndex[0]].replies[
                  //   props.commentIndex[1]
                  // ].commentLikes = cpyObj[props.commentIndex[0]].replies[
                  //   props.commentIndex[1]
                  // ].commentLikes
                  //   ? {
                  //       ...cpyObj[props.commentIndex[0]].replies[
                  //         props.commentIndex[1]
                  //       ].commentLikes,
                  //       [data.split(".").join("-")]: data,
                  //     }
                  //   : { [data.split(".").join("-")]: data };
                  cpyObj[props.commentIndex[0]].replies[
                    props.commentIndex[1]
                  ].commentLikes = { ...commentLikes };
                } else if (updateLikeDislike[0] === "/commentDislikes/") {
                  // cpyObj[props.commentIndex[0]].replies[
                  //   props.commentIndex[1]
                  // ].commentDislikes = cpyObj[props.commentIndex[0]].replies[
                  //   props.commentIndex[1]
                  // ].commentDislikes
                  //   ? {
                  //       ...cpyObj[props.commentIndex[0]].replies[
                  //         props.commentIndex[1]
                  //       ].commentDislikes,
                  //       [data.split(".").join("-")]: data,
                  //     }
                  //   : { [data.split(".").join("-")]: data };
                  cpyObj[props.commentIndex[0]].replies[
                    props.commentIndex[1]
                  ].commentDislikes = { ...commentDislikes };
                }
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
              setFetching(false);
            } else {
              let cpyArr = JSON.parse(JSON.stringify(props.commentData));
              if (!Array.isArray(props.commentIndex)) {
                if (updateLikeDislike[0] === "/commentLikes/") {
                  cpyArr[props.commentIndex].commentLikes = { ...commentLikes };
                } else if (updateLikeDislike[0] === "/commentDislikes/") {
                  cpyArr[props.commentIndex].commentDislikes = {
                    ...commentDislikes,
                  };
                }
              } else {
                if (updateLikeDislike[0] === "/commentLikes/") {
                  cpyArr[props.commentIndex[0]].replies[
                    props.commentIndex[1]
                  ].commentLikes = { ...commentLikes };
                } else if (updateLikeDislike[0] === "/commentDislikes/") {
                  cpyArr[props.commentIndex[0]].replies[
                    props.commentIndex[1]
                  ].commentDislikes = { ...commentDislikes };
                }
              }
              props.setCommentData([...cpyArr]);
              setFetching(false);
            }
          });
        setUpdateLikeDislike(null);
      } else {
        // const configOptions = {
        //   method: `${updateLikeDislike.length === 4 ? "PUT" : "DELETE"}`,
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        // };
        // if (updateLikeDislike.length === 4) {
        //   configOptions.body = 0;
        // }
        const deletePath = location.state.articleData
          ? `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/articles/${
              location.state.articleData.category
            }/${location.state.articleData.subCategory}/-${
              location.state.articleData.id
            }/comments/${
              Array.isArray(props.commentIndexDB)
                ? props.commentIndexDB[0]
                : props.commentIndexDB + updateLikeDislike[2] + userIpNoDot
            }${
              Array.isArray(props.commentIndexDB)
                ? "/replies/" +
                  props.commentIndexDB[1] +
                  updateLikeDislike[2] +
                  userIpNoDot
                : ""
            }.json`
          : `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/articles/${props.path}${updateLikeDislike[2]}${userIpNoDot}.json`;
        const promises = [
          fetch(`${path}`, {
            method: "PUT",
            body: JSON.stringify(updateLikeDislike[1]),
            headers: {
              "Content-Type": "application/json",
            },
          }).then((res) => res.json()),
          fetch(`${deletePath}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }).then((res) => res.json()),
        ];
        const promisedData = Promise.all(promises);
        promisedData.then((data) => {
          console.log(data);
          if (location.state.articleData) {
            let cpyObj = [
              ...JSON.parse(
                JSON.stringify(location.state.articleData.comments)
              ),
            ];
            console.log(cpyObj);
            console.log(props.commentIndex);
            if (!Array.isArray(props.commentIndex)) {
              if (updateLikeDislike[0] === "/commentLikes/") {
                // cpyObj[props.commentIndex].commentLikes = Object.keys(
                //   cpyObj[props.commentIndex].commentLikes
                // ).length
                //   ? {
                //       ...cpyObj[props.commentIndex].commentLikes,
                //       [data.split(".").join("-")]: data,
                //     }
                //   : { [data.split(".").join("-")]: data };
                cpyObj[props.commentIndex].commentLikes = { ...commentLikes };
                cpyObj[props.commentIndex].commentDislikes = commentDislikes
                  ? {
                      ...commentDislikes,
                    }
                  : 0;
              } else if (updateLikeDislike[0] === "/commentDislikes/") {
                // cpyObj[props.commentIndex].commentDislikes = Object.keys(
                //   cpyObj[props.commentIndex].commentDislikes
                // ).length
                //   ? {
                //       ...cpyObj[props.commentIndex].commentDislikes,
                //       [data.split(".").join("-")]: data,
                //     }
                //   : { [data.split(".").join("-")]: data };
                cpyObj[props.commentIndex].commentLikes = commentLikes
                  ? { ...commentLikes }
                  : 0;
                cpyObj[props.commentIndex].commentDislikes = {
                  ...commentDislikes,
                };
              }
            } else {
              if (updateLikeDislike[0] === "/commentLikes/") {
                // cpyObj[props.commentIndex[0]].replies[
                //   props.commentIndex[1]
                // ].commentLikes = Object.keys(
                //   cpyObj[props.commentIndex[0]].replies[props.commentIndex[1]]
                //     .commentLikes
                // ).length
                //   ? {
                //       ...cpyObj[props.commentIndex[0]].replies[
                //         props.commentIndex[1]
                //       ].commentLikes,
                //       [data.split(".").join("-")]: data,
                //     }
                //   : { [data.split(".").join("-")]: data };
                cpyObj[props.commentIndex[0]].replies[
                  props.commentIndex[1]
                ].commentLikes = { ...commentLikes };
                cpyObj[props.commentIndex[0]].replies[
                  props.commentIndex[1]
                ].commentDislikes = commentDislikes
                  ? { ...commentDislikes }
                  : 0;
              } else if (updateLikeDislike[0] === "/commentDislikes/") {
                // cpyObj[props.commentIndex[0]].replies[
                //   props.commentIndex[1]
                // ].commentDislikes = Object.keys(
                //   cpyObj[props.commentIndex[0]].replies[props.commentIndex[1]]
                //     .commentDislikes
                // ).length
                //   ? {
                //       ...cpyObj[props.commentIndex[0]].replies[
                //         props.commentIndex[1]
                //       ].commentDislikes,
                //       [data.split(".").join("-")]: data,
                //     }
                //   : { [data.split(".").join("-")]: data };
                cpyObj[props.commentIndex[0]].replies[
                  props.commentIndex[1]
                ].commentLikes = commentLikes ? { ...commentLikes } : 0;
                cpyObj[props.commentIndex[0]].replies[
                  props.commentIndex[1]
                ].commentDislikes = { ...commentDislikes };
              }
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
            setFetching(false);
          } else {
            let cpyArr = JSON.parse(JSON.stringify(props.commentData));
            if (!Array.isArray(props.commentIndex)) {
              if (updateLikeDislike[0] === "/commentLikes/") {
                cpyArr[props.commentIndex].commentLikes = { ...commentLikes };
                cpyArr[props.commentIndex].commentDislikes = commentDislikes
                  ? {
                      ...commentDislikes,
                    }
                  : 0;
              } else if (updateLikeDislike[0] === "/commentDislikes/") {
                cpyArr[props.commentIndex].commentLikes = commentLikes
                  ? { ...commentLikes }
                  : 0;
                cpyArr[props.commentIndex].commentDislikes = {
                  ...commentDislikes,
                };
              }
            } else {
              if (updateLikeDislike[0] === "/commentLikes/") {
                cpyArr[props.commentIndex[0]].replies[
                  props.commentIndex[1]
                ].commentLikes = { ...commentLikes };
                cpyArr[props.commentIndex[0]].replies[
                  props.commentIndex[1]
                ].commentDislikes = commentDislikes
                  ? { ...commentDislikes }
                  : 0;
              } else if (updateLikeDislike[0] === "/commentDislikes/") {
                cpyArr[props.commentIndex[0]].replies[
                  props.commentIndex[1]
                ].commentLikes = commentLikes ? { ...commentLikes } : 0;
                cpyArr[props.commentIndex[0]].replies[
                  props.commentIndex[1]
                ].commentDislikes = { ...commentDislikes };
              }
            }
            props.setCommentData([...cpyArr]);
            setFetching(false);
          }
        });
        setUpdateLikeDislike(null);
      }
    }
  }, [updateLikeDislike, commentLikes, commentDislikes]);

  useEffect(() => {
    console.log(commentLikes);
    const userIp = localStorage.getItem("userIp");
    if (commentLikes && Object.keys(commentLikes).length && userIp) {
      if (
        Object.keys(commentLikes).find(
          (ip) => ip === userIp.split(".").join("-")
        )
      ) {
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
    if (commentDislikes && Object.keys(commentDislikes).length) {
      const userIp = localStorage.getItem("userIp");
      if (
        Object.keys(commentDislikes).find(
          (ip) => ip === userIp.split(".").join("-")
        )
      ) {
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
      console.log(location.state.articleData);
    }
  }, [location]);

  const handleLike = () => {
    handleLikeDislike("like");
  };
  const handeDislike = () => {
    handleLikeDislike("dislike");
  };

  const testsmthng = () => {
    // fetch(
    //   `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/articles/Vijesti/BiH/-MpkjdqpHcSS6cQ0K_gx/comments/-MupKKYniZP1H1JYinS0/commentDislikes/12-55-444-664.json`,
    //   {
    //     method: "PUT",
    //     body: JSON.stringify("12.23.222.222"),
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   }
    // )
    //   .then((res) => res.json())
    //   .then((data) => console.log(data));
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
      onClick={testsmthng}
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
          <h4>
            <Link to={`/profil/${props.displayName}`}>{props.displayName}</Link>
          </h4>
          <p>
            {!props.path ? (
              <Link
                to={
                  location.state.articleData && {
                    pathname: `/komentar/${
                      Array.isArray(props.commentIndexDB)
                        ? props.commentIndexDB[1]
                        : props.commentIndexDB
                    }`,
                    search: `?${JSON.stringify({
                      articleLink: `${location.state.articleData.category}/${location.state.articleData.subCategory}/-${location.state.articleData.id}`,
                      commentId: Array.isArray(props.commentIndexDB)
                        ? props.commentIndexDB[1]
                        : props.commentIndexDB,
                      parentCommentId: Array.isArray(props.commentIndexDB)
                        ? props.commentIndexDB[0]
                        : undefined,
                    })}`,
                  }
                }
              >
                {`prije ${props.date ? props.date : "1 sekund"}`}
              </Link>
            ) : (
              `prije ${props.date ? props.date : "1 sekund"}`
            )}
          </p>
        </div>
      </div>
      <div className={s.commentBody}>
        <p>{props.comment}</p>
      </div>
      <div className={s.commentFooter}>
        <div>
          <span className={s.like} onClick={handleLike} ref={commentLike}>
            <i class="fas fa-long-arrow-alt-up"></i>{" "}
            {commentLikes && Object.keys(commentLikes).length
              ? Object.keys(commentLikes).length
              : 0}
          </span>
          <span
            className={s.dislike}
            onClick={handeDislike}
            ref={commentDislike}
          >
            <i class="fas fa-long-arrow-alt-down"></i>{" "}
            {commentDislikes && Object.keys(commentDislikes).length
              ? Object.keys(commentDislikes).length
              : 0}
          </span>
        </div>
        <div className={s.reportLikeParent}>
          <span
            className={s.report}
            onClick={() =>
              props.handleReport({
                commentId: Array.isArray(props.commentIndexDB)
                  ? props.commentIndexDB[1]
                  : props.commentIndexDB,
                user: props.displayName,
                comment: props.comment,
                search: `?${JSON.stringify({
                  comLink: props.path,
                  commentId: Array.isArray(props.commentIndexDB)
                    ? props.commentIndexDB[1]
                    : props.commentIndexDB,
                  parentCommentId: Array.isArray(props.commentIndexDB)
                    ? props.commentIndexDB[0]
                    : undefined,
                })}`,
              })
            }
          >
            <i class="far fa-flag"></i> <p>Prijavi</p>
          </span>
          <span className={s.divide} />
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
