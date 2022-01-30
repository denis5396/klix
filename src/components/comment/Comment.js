import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react/cjs/react.development";
import { v1 as uuid } from "uuid";
import LoginContext from "../../context";
import s from "./Comment.module.css";
import CommentType from "./CommentType";
import CommentItem from "./CommentItem";
import CommentReply from "./CommentReply";
import { timeDifference } from "../AdminPanel/EditArticle/EditArticle";
import { clrs } from "../ArticleLink/ArticleLink";
import { useHistory } from "react-router-dom";
import CommentShow from "./CommentShow";

export const getComLength = (data) => {
  let fullCommentsLength = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i].replies) {
      fullCommentsLength += data[i].replies.length;
    }
    if (i === data.length - 1) {
      fullCommentsLength += data.length;
      return fullCommentsLength;
    }
  }
};

const Comment = () => {
  const ctx = useContext(LoginContext);
  const location = useLocation();
  const history = useHistory();
  const [comments, setComments] = useState([]);
  const [fullCommentsLength, setFullCommentsLength] = useState(0);
  const [replyIndex, setReplyIndex] = useState(null);
  const [getComments, setGetComments] = useState(true);
  const [safeToProceed, setSafeToProceed] = useState(false);
  const [repliesToHide, setRepliesToHide] = useState([]);
  const [showMore, setShowMore] = useState([]);
  const initRef = useRef(null);
  const pushFinal = useRef(undefined);
  const pushFinal2 = useRef(undefined);

  // useEffect(() => {
  //   window.onbeforeunload = function () {
  //     return true;
  //   };

  //   return () => {
  //     window.onbeforeunload = null;
  //   };
  // }, []);

  useEffect(() => {
    if (location && getComments) {
      // alert(initRef.current);
      if (!initRef.current) {
        console.log(location.state.articleData.comments);
        setComments([...location.state.articleData.comments]);
        initRef.current = "initialized";
      }
      if (location.state.articleData.comments[0] !== "") {
        setFullCommentsLength(
          getComLength(location.state.articleData.comments)
        );
      } else {
        setFullCommentsLength(0);
      }
      fetch("https://api.ipify.org/?format=json")
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem("userIp", data.ip);
          console.log(data);
        });
      // alert("gettingComments");
      if (typeof replyIndex === "number" || Array.isArray(replyIndex)) {
        setReplyIndex(null);
      }
      window.scrollTo(0, 0);
      console.log(location.state);
      fetch(
        `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/articles/${location.state.articleData.category}/${location.state.articleData.subCategory}/-${location.state.articleData.id}/comments.json`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data[0] !== "") {
            for (let i = 0; i < data.length; i++) {
              data[i].dbIdx = i;
              if (data[i].replies) {
                for (let j = 0; j < data[i].replies.length; j++) {
                  data[i].replies[j].dbIdx = [i, j];
                }
              }
            }
            console.log(data);
            const check = checkForTopComments([...data]);
            handleReplyHide(check);
            console.log(check);
            setComments([...check]);
            showMoreFn(check.length);
            // alert("test");
            // location.state.articleData.comments = [...data];
            setGetComments(false);
            setFullCommentsLength(getComLength(check));
            history.replace({
              state: {
                articleData: {
                  ...JSON.parse(JSON.stringify(location.state.articleData)),
                  comments: [...JSON.parse(JSON.stringify(check))],
                },
              },
            });
            setSafeToProceed(true);
          }
        });
    }
  }, [location, getComments]);

  const handleReplyHide = (data) => {
    const replyHideArray = [];
    if (data[0] !== "") {
      for (let i = 0; i < data.length; i++) {
        if (data[i].replies && data[i].replies.length > 2) {
          replyHideArray.push(i);
        }
      }
    }
    if (replyHideArray.length) {
      setRepliesToHide([...replyHideArray]);
    }
    console.log(replyHideArray);
  };

  const spliceRepliesHide = (ind, mode) => {
    if (mode === "replies") {
      const testingFn = (el) => el === ind;
      console.log(repliesToHide.findIndex(testingFn));
      setRepliesToHide((old) => {
        let oldArr = [...old];
        const index = repliesToHide.findIndex(testingFn);
        oldArr.splice(index, 1);
        console.log(oldArr);
        if (oldArr.length) {
          return oldArr;
        }
        return [];
      });
    } else {
      console.log("check");
      setShowMore((old) => {
        const oldArr = [...old];
        oldArr.splice(0, 1);
        console.log(oldArr);
        if (oldArr.length > 0) {
          return oldArr;
        } else {
          return [];
        }
      });
    }
  };

  const showMoreFn = (dataLength) => {
    let numberOfShows = dataLength / 3;
    let arr = [];
    let val = 0;
    if (numberOfShows > 1) {
      if (numberOfShows % 1 === 0) {
        numberOfShows--;
      } else {
        numberOfShows.toFixed();
      }
    }
    for (let i = 0; i < numberOfShows; i++) {
      val += 3;
      arr.push(val);
    }
    setShowMore([...arr]);
    console.log(arr);
    // alert(numberOfShows);
  };

  const handleReply = (ind) => {
    setReplyIndex(ind);
  };
  useEffect(() => {});
  const handleNavigateTitle = () => {
    console.log(location.state.articleData);
    // alert(location.state.articleData.linkPath);
    // history.push(location.state.articleData.linkPath);
  };

  const checkForTopComments = (comments) => {
    let storeTopCommentsIndx = [];
    for (let i = 0; i < comments.length; i++) {
      if (
        Array.isArray(comments[i].commentLikes) &&
        comments[i].commentLikes.length >= 5
      ) {
        if (
          Array.isArray(comments[i].commentDislikes) &&
          comments[i].commentLikes.length >=
            comments[i].commentDislikes.length + 5
        ) {
          storeTopCommentsIndx.push([i, comments[i].commentLikes.length]);
        } else if (
          !Array.isArray(comments[i].commentDislikes) &&
          comments[i].commentLikes.length >= 5
        ) {
          storeTopCommentsIndx.push([i, comments[i].commentLikes.length]);
        }
      }
    }
    console.log(storeTopCommentsIndx);
    if (storeTopCommentsIndx.length) {
      // let pushFinal = [storeTopCommentsIndx[0]];
      // let pushFinal2 = [];
      pushFinal.current = [storeTopCommentsIndx[0]];
      pushFinal2.current = [];
      let spliceInd = 0;
      const secondLoopArray = [...storeTopCommentsIndx];
      for (let i = 0; i < storeTopCommentsIndx.length; i++) {
        if (storeTopCommentsIndx.length >= 2) {
          if (pushFinal.current[0][1] < storeTopCommentsIndx[i][1]) {
            pushFinal.current = [storeTopCommentsIndx[i]];
            spliceInd = i;
          }
          if (i === storeTopCommentsIndx.length - 1) {
            secondLoopArray.splice(spliceInd, 1);
            console.log(secondLoopArray);
            if (secondLoopArray.length) {
              for (let j = 0; j < secondLoopArray.length; j++) {
                if (j === 0) {
                  pushFinal2.current = [secondLoopArray[0]];
                }
                if (pushFinal2.current[0][1] < secondLoopArray[j][1]) {
                  pushFinal2.current = [secondLoopArray[j]];
                }
              }
            }
          }
        }
      }
      console.log(pushFinal.current);
      console.log(pushFinal2.current);
      let cpyCom = [...JSON.parse(JSON.stringify(comments))];
      let firstTopCom = {
        ...cpyCom.slice(pushFinal.current[0][0], pushFinal.current[0][0] + 1),
      };
      let secondTopCom = undefined;
      cpyCom.splice(pushFinal.current[0][0], 1);
      cpyCom.splice(0, 0, firstTopCom[0]);
      if (pushFinal2.current.length) {
        if (pushFinal2.current[0][0] > pushFinal.current[0][0]) {
          secondTopCom = cpyCom.slice(
            pushFinal2.current[0][0],
            pushFinal2.current[0][0] + 1
          );
        } else {
          secondTopCom = cpyCom.slice(
            pushFinal2.current[0][0] + 1,
            pushFinal2.current[0][0] + 2
          );
        }
        console.log(secondTopCom);
        cpyCom.splice(1, 0, secondTopCom[0]);
        if (pushFinal2.current[0][0] > pushFinal.current[0][0]) {
          cpyCom.splice(pushFinal2.current[0][0] + 1, 1);
        } else {
          cpyCom.splice(pushFinal2.current[0][0] + 2, 1);
        }
      }
      console.log(cpyCom);
      return cpyCom;
      // let finalComArray =
    }
  };

  return (
    <div id={s.commentPageContainer}>
      <div id={s.commentPageContainerHeader}>
        <div id={s.headerBundle}>
          <h3
            style={{
              color:
                location.state.articleData &&
                `${clrs[location.state.articleData.category.toLowerCase()]}`,
            }}
          >
            {location.state.articleData.subTitle}
          </h3>
          <h1 onClick={handleNavigateTitle}>
            <Link
              to={{
                pathname: location.state.articleData.linkPath,
                state: { articleData: location.state.articleData },
              }}
            >
              {location.state.articleData.title}
            </Link>
          </h1>
        </div>
        <div id={s.headerShares}>
          <i class={"fas fa-share-alt"}></i> 63
        </div>
      </div>
      <div id={s.commentPageContainerBody}>
        <div id={s.commentSidebarLeft}>
          <div id={s.bundleDiv}>
            <div id={s.postedData}>
              <div>
                <i
                  class="fas fa-user"
                  style={{
                    backgroundColor: `rgb(209,213,219)`,
                    color: "#fff",
                    padding: "1.2rem",
                    borderRadius: ".3rem",
                    fontSize: "1.6rem",
                  }}
                ></i>
              </div>
              <div id={s.postedDataTwo}>
                <h3>R. D.</h3>
                <p>{timeDifference(location.state.articleData.date)}</p>
              </div>
            </div>
            <div id={s.commentsShare}>
              <div id={s.comments}>
                <h2>{fullCommentsLength}</h2>
                <p>komentara</p>
              </div>
              <div>
                <h2>0</h2>
                <p>dijeljenja</p>
              </div>
            </div>
            <div id={s.shareArticle}>
              <ul>
                <li>
                  <i class="fab fa-facebook"></i>
                </li>
                <li>
                  <i class="fab fa-twitter"></i>
                </li>
                <li>
                  <i class="far fa-envelope"></i>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div id={s.commentBodyContent}>
          <div id={s.commentBodyHeader}>
            <div id={s.commentBodyHeaderInfo}>
              <h3>Komentari ({fullCommentsLength})</h3>
              <div id={s.povratakNaClanak}>
                <Link
                  to={{
                    pathname: location.state.articleData.linkPath,
                    state: { articleData: location.state.articleData },
                  }}
                >
                  <i class="far fa-arrow-alt-circle-left"></i> Povratak na
                  članak
                </Link>
              </div>
            </div>
            <div id={s.commentBodyHeaderTypeSignIn}>
              {!ctx.isLoggedIn ? (
                <Link to="/login">
                  <div id={s.prijavaKorisnika}>Prijava korisnika</div>
                </Link>
              ) : (
                <CommentType
                  path={{
                    category: location.state.articleData.category,
                    subCategory: location.state.articleData.subCategory,
                    id: location.state.articleData.id,
                  }}
                  getComments={setGetComments}
                />
              )}
            </div>
            <div id={s.commentBodyHeaderAlert}>
              <span>NAPOMENA:</span> &nbsp;
              <a>Pravila i uslovi korištenja komentara.</a>
            </div>
          </div>
          <div id={s.commentBody}>
            {safeToProceed &&
              getComLength(comments) ===
                getComLength(location.state.articleData.comments) &&
              comments.map((comment, i) => {
                if (i === replyIndex) {
                  if (!comment.replies) {
                    return (
                      <React.Fragment key={uuid()}>
                        <CommentItem
                          commentIndex={i}
                          commentIndexDB={comment.dbIdx}
                          comment={comment.comment}
                          displayName={comment.userName}
                          commentLikes={comment.commentLikes}
                          commentDislikes={comment.commentDislikes}
                          avatarColor={comment.avatarColor}
                          topComment={
                            (pushFinal.current.length &&
                              i === 0 &&
                              "topComment") ||
                            (pushFinal2.current.length &&
                              i === 1 &&
                              "topComment")
                          }
                          negativeComment={
                            Array.isArray(comment.commentDislikes) &&
                            comment.commentDislikes.length >=
                              (Array.isArray(comment.commentLikes)
                                ? comment.commentLikes.length + 5
                                : 5)
                          }
                          date={timeDifference(comment.date)}
                          handleReply={handleReply}
                        />
                        <CommentReply
                          commentIndex={i}
                          commentIndexDB={comment.dbIdx}
                          getComments={setGetComments}
                        />
                        {showMore.length > 0 && i === showMore[0] - 1 && (
                          <CommentShow
                            onClick={() => spliceRepliesHide(i, "showMore")}
                          />
                        )}
                      </React.Fragment>
                    );
                  } else if (comment.replies) {
                    return (
                      <React.Fragment key={uuid()}>
                        <CommentItem
                          commentIndex={i}
                          commentIndexDB={comment.dbIdx}
                          comment={comment.comment}
                          displayName={comment.userName}
                          commentLikes={comment.commentLikes}
                          commentDislikes={comment.commentDislikes}
                          avatarColor={comment.avatarColor}
                          topComment={
                            (pushFinal.current.length &&
                              i === 0 &&
                              "topComment") ||
                            (pushFinal2.current.length &&
                              i === 1 &&
                              "topComment")
                          }
                          negativeComment={
                            Array.isArray(comment.commentDislikes) &&
                            comment.commentDislikes.length >=
                              (Array.isArray(comment.commentLikes)
                                ? comment.commentLikes.length + 5
                                : 5)
                          }
                          date={timeDifference(comment.date)}
                          handleReply={handleReply}
                        />
                        <CommentReply
                          commentIndex={i}
                          commentIndexDB={comment.dbIdx}
                          getComments={setGetComments}
                        />
                        {comment.replies.map((comRep, ind) => {
                          return (
                            <>
                              {repliesToHide.length > 0 &&
                                repliesToHide.find((el) => el === i) &&
                                ind < 2 && (
                                  <CommentItem
                                    key={uuid()}
                                    commentIndex={[i, ind]}
                                    commentIndexDB={comRep.dbIdx}
                                    comment={comRep.comment}
                                    displayName={comRep.userName}
                                    commentLikes={comRep.commentLikes}
                                    commentDislikes={comRep.commentDislikes}
                                    avatarColor={comRep.avatarColor}
                                    negativeComment={
                                      Array.isArray(comRep.commentDislikes) &&
                                      comRep.commentDislikes.length >=
                                        (Array.isArray(comRep.commentLikes)
                                          ? comRep.commentLikes.length + 5
                                          : 5)
                                    }
                                    date={timeDifference(comRep.date)}
                                    handleReply={handleReply}
                                  />
                                )}
                              {((repliesToHide.length &&
                                !repliesToHide.find((el) => el === i)) ||
                                !repliesToHide.length) && (
                                <CommentItem
                                  key={uuid()}
                                  commentIndex={[i, ind]}
                                  commentIndexDB={comRep.dbIdx}
                                  comment={comRep.comment}
                                  displayName={comRep.userName}
                                  commentLikes={comRep.commentLikes}
                                  commentDislikes={comRep.commentDislikes}
                                  avatarColor={comRep.avatarColor}
                                  negativeComment={
                                    Array.isArray(comRep.commentDislikes) &&
                                    comRep.commentDislikes.length >=
                                      (Array.isArray(comRep.commentLikes)
                                        ? comRep.commentLikes.length + 5
                                        : 5)
                                  }
                                  date={timeDifference(comRep.date)}
                                  handleReply={handleReply}
                                />
                              )}
                              {repliesToHide.length > 0
                                ? repliesToHide.length &&
                                  repliesToHide.find((el) => el === i) &&
                                  ind === 1 && (
                                    <CommentShow
                                      onClick={() =>
                                        spliceRepliesHide(i, "replies")
                                      }
                                      showReply={comment.replies.length - 2}
                                    />
                                  )
                                : null}
                            </>
                          );
                        })}
                        {showMore.length > 0 && i === showMore[0] - 1 && (
                          <CommentShow
                            onClick={() => spliceRepliesHide(i, "showMore")}
                          />
                        )}
                      </React.Fragment>
                    );
                  }
                } else if (Array.isArray(replyIndex)) {
                  return (
                    ((showMore.length > 0 && i < showMore[0]) ||
                      showMore.length === 0) && (
                      <React.Fragment key={uuid()}>
                        <CommentItem
                          commentIndex={i}
                          commentIndexDB={comment.dbIdx}
                          comment={comment.comment}
                          displayName={comment.userName}
                          commentLikes={comment.commentLikes}
                          commentDislikes={comment.commentDislikes}
                          avatarColor={comment.avatarColor}
                          topComment={
                            (pushFinal.current.length &&
                              i === 0 &&
                              "topComment") ||
                            (pushFinal2.current.length &&
                              i === 1 &&
                              "topComment")
                          }
                          negativeComment={
                            Array.isArray(comment.commentDislikes) &&
                            comment.commentDislikes.length >=
                              (Array.isArray(comment.commentLikes)
                                ? comment.commentLikes.length + 5
                                : 5)
                          }
                          date={timeDifference(comment.date)}
                          handleReply={handleReply}
                        />
                        {comment.replies &&
                          comment.replies.map((comRep, ind) => {
                            return (
                              <React.Fragment key={uuid()}>
                                {repliesToHide.length > 0 &&
                                  repliesToHide.find((el) => el === i) &&
                                  ind < 2 && (
                                    <>
                                      <CommentItem
                                        commentIndex={[i, ind]}
                                        commentIndexDB={comRep.dbIdx}
                                        comment={comRep.comment}
                                        displayName={comRep.userName}
                                        commentLikes={comRep.commentLikes}
                                        commentDislikes={comRep.commentDislikes}
                                        avatarColor={comRep.avatarColor}
                                        negativeComment={
                                          Array.isArray(
                                            comRep.commentDislikes
                                          ) &&
                                          comRep.commentDislikes.length >=
                                            (Array.isArray(comRep.commentLikes)
                                              ? comRep.commentLikes.length + 5
                                              : 5)
                                        }
                                        date={timeDifference(comRep.date)}
                                        handleReply={handleReply}
                                      />
                                      {replyIndex[1] === ind &&
                                      replyIndex[0] === i ? (
                                        <CommentReply
                                          commentIndex={[i, ind]}
                                          commentIndexDB={comRep.dbIdx}
                                          getComments={setGetComments}
                                        />
                                      ) : null}
                                    </>
                                  )}
                                {((repliesToHide.length &&
                                  !repliesToHide.find((el) => el === i)) ||
                                  !repliesToHide.length) && (
                                  <>
                                    <CommentItem
                                      commentIndex={[i, ind]}
                                      commentIndexDB={comRep.dbIdx}
                                      comment={comRep.comment}
                                      displayName={comRep.userName}
                                      commentLikes={comRep.commentLikes}
                                      commentDislikes={comRep.commentDislikes}
                                      avatarColor={comRep.avatarColor}
                                      negativeComment={
                                        Array.isArray(comRep.commentDislikes) &&
                                        comRep.commentDislikes.length >=
                                          (Array.isArray(comRep.commentLikes)
                                            ? comRep.commentLikes.length + 5
                                            : 5)
                                      }
                                      date={timeDifference(comRep.date)}
                                      handleReply={handleReply}
                                    />
                                    {replyIndex[1] === ind &&
                                    replyIndex[0] === i ? (
                                      <CommentReply
                                        commentIndex={[i, ind]}
                                        commentIndexDB={comRep.dbIdx}
                                        getComments={setGetComments}
                                      />
                                    ) : null}
                                  </>
                                )}
                                {repliesToHide.length > 0
                                  ? repliesToHide.length &&
                                    repliesToHide.find((el) => el === i) &&
                                    ind === 1 && (
                                      <CommentShow
                                        onClick={() =>
                                          spliceRepliesHide(i, "replies")
                                        }
                                        showReply={comment.replies.length - 2}
                                      />
                                    )
                                  : null}
                              </React.Fragment>
                            );
                          })}
                        {showMore.length > 0 && i === showMore[0] - 1 && (
                          <CommentShow
                            onClick={() => spliceRepliesHide(i, "showMore")}
                          />
                        )}
                      </React.Fragment>
                    )
                  );
                } else {
                  return (
                    ((showMore.length > 0 && i < showMore[0]) ||
                      showMore.length === 0) &&
                    (!comment.replies ? (
                      <React.Fragment key={uuid()}>
                        <CommentItem
                          commentIndex={i}
                          commentIndexDB={comment.dbIdx}
                          key={uuid()}
                          comment={comment.comment}
                          displayName={comment.userName}
                          commentLikes={comment.commentLikes}
                          commentDislikes={comment.commentDislikes}
                          avatarColor={comment.avatarColor}
                          topComment={
                            (pushFinal.current.length &&
                              i === 0 &&
                              "topComment") ||
                            (pushFinal2.current.length &&
                              i === 1 &&
                              "topComment")
                          }
                          negativeComment={
                            Array.isArray(comment.commentDislikes) &&
                            comment.commentDislikes.length >=
                              (Array.isArray(comment.commentLikes)
                                ? comment.commentLikes.length + 5
                                : 5)
                          }
                          date={timeDifference(comment.date)}
                          handleReply={handleReply}
                        />
                        {showMore.length > 0 && i === showMore[0] - 1 && (
                          <CommentShow
                            onClick={() => spliceRepliesHide(i, "showMore")}
                          />
                        )}
                      </React.Fragment>
                    ) : (
                      <React.Fragment key={uuid()}>
                        <CommentItem
                          commentIndex={i}
                          commentIndexDB={comment.dbIdx}
                          comment={comment.comment}
                          displayName={comment.userName}
                          commentLikes={comment.commentLikes}
                          commentDislikes={comment.commentDislikes}
                          avatarColor={comment.avatarColor}
                          topComment={
                            (pushFinal.current.length &&
                              i === 0 &&
                              "topComment") ||
                            (pushFinal2.current.length &&
                              i === 1 &&
                              "topComment")
                          }
                          negativeComment={
                            Array.isArray(comment.commentDislikes) &&
                            comment.commentDislikes.length >=
                              (Array.isArray(comment.commentLikes)
                                ? comment.commentLikes.length + 5
                                : 5)
                          }
                          date={timeDifference(comment.date)}
                          handleReply={handleReply}
                        />
                        {comment.replies.map((comRep, ind) => {
                          return (
                            <React.Fragment key={uuid()}>
                              {repliesToHide.length > 0 &&
                                repliesToHide.find((el) => el === i) &&
                                ind < 2 && (
                                  <CommentItem
                                    key={uuid()}
                                    commentIndex={[i, ind]}
                                    commentIndexDB={comRep.dbIdx}
                                    comment={comRep.comment}
                                    displayName={comRep.userName}
                                    commentLikes={comRep.commentLikes}
                                    commentDislikes={comRep.commentDislikes}
                                    avatarColor={comRep.avatarColor}
                                    negativeComment={
                                      Array.isArray(comRep.commentDislikes) &&
                                      comRep.commentDislikes.length >=
                                        (Array.isArray(comRep.commentLikes)
                                          ? comRep.commentLikes.length + 5
                                          : 5)
                                    }
                                    date={timeDifference(comRep.date)}
                                    handleReply={handleReply}
                                  />
                                )}
                              {(repliesToHide.length &&
                                !repliesToHide.find((el) => el === i)) ||
                              !repliesToHide.length ? (
                                <CommentItem
                                  key={uuid()}
                                  commentIndex={[i, ind]}
                                  commentIndexDB={comRep.dbIdx}
                                  comment={comRep.comment}
                                  displayName={comRep.userName}
                                  commentLikes={comRep.commentLikes}
                                  commentDislikes={comRep.commentDislikes}
                                  avatarColor={comRep.avatarColor}
                                  negativeComment={
                                    Array.isArray(comRep.commentDislikes) &&
                                    comRep.commentDislikes.length >=
                                      (Array.isArray(comRep.commentLikes)
                                        ? comRep.commentLikes.length + 5
                                        : 5)
                                  }
                                  date={timeDifference(comRep.date)}
                                  handleReply={handleReply}
                                />
                              ) : null}
                              {repliesToHide.length > 0
                                ? repliesToHide.length &&
                                  repliesToHide.find((el) => el === i) &&
                                  ind === 1 && (
                                    <CommentShow
                                      onClick={() =>
                                        spliceRepliesHide(i, "replies")
                                      }
                                      showReply={comment.replies.length - 2}
                                    />
                                  )
                                : null}
                            </React.Fragment>
                          );
                        })}
                        {showMore.length > 0 && i === showMore[0] - 1 && (
                          <CommentShow
                            onClick={() => spliceRepliesHide(i, "showMore")}
                          />
                        )}
                      </React.Fragment>
                    ))
                  );
                }
              })}
          </div>
        </div>
        <div id={s.commentSidebarRight}></div>
      </div>
    </div>
    // <div className={s.postComment}>
    //   <div className={s.postCommentBundle}>
    //     <textarea
    //       name="komentar"
    //       className={s.postCommentTextarea}
    //       placeholder="upiši komentar"
    //     ></textarea>
    //     <button>
    //       <span>
    //         <i class="fas fa-pen"></i> Objavi komentar
    //       </span>
    //     </button>
    //   </div>
    // </div>
  );
};

export default Comment;
