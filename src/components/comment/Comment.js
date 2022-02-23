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
import ReportComment from "./reportComment/ReportComment";
import Overlay from "../Overlay/Overlay";
import { scrollFnSticky } from "../Article/Article";

export const getComLength = (data) => {
  let fullCommentsLength = 0;
  console.log(data);
  for (let i = 0; i < data.length; i++) {
    if (data[i].replies) {
      fullCommentsLength += data[i].replies.length;
    }
    if (i === data.length - 1) {
      fullCommentsLength += data.length;
      console.log(fullCommentsLength);
      return fullCommentsLength;
    }
  }
};

export const getComLengthIfObject = (data) => {
  let fullComLength = 0;
  let replyLength = 0;
  for (let key in data) {
    if (data[key].replies) {
      replyLength += Object.keys(data[key].replies).length;
    }
  }
  fullComLength = Object.keys(data).length + replyLength;
  return fullComLength;
};

export const handleReplyHide = (data) => {
  const replyHideArray = [];
  console.log(data);
  for (let i = 0; i < data.length; i++) {
    if (data[i].replies && data[i].replies.length > 2) {
      replyHideArray.push(i);
    }
  }

  if (replyHideArray.length) {
    return [...replyHideArray];
    // setRepliesToHide([...replyHideArray]);
  }
  console.log(replyHideArray);
};

const Comment = () => {
  const ctx = useContext(LoginContext);
  const location = useLocation();
  const history = useHistory();
  const [comments, setComments] = useState([]);
  const [replyIndex, setReplyIndex] = useState(null);
  const [getComments, setGetComments] = useState(true);
  const [safeToProceed, setSafeToProceed] = useState(false);
  const [repliesToHide, setRepliesToHide] = useState([]);
  const [showMore, setShowMore] = useState([]);
  const [reportComment, setReportComment] = useState(null);
  const initRef = useRef(null);
  const pushFinal = useRef(undefined);
  const pushFinal2 = useRef(undefined);
  const fullCommentsLengthRef = useRef(0);
  const stickLeftSidebar = useRef();
  // useEffect(() => {
  //   window.onbeforeunload = function () {
  //     return true;
  //   };

  //   return () => {
  //     window.onbeforeunload = null;
  //   };
  // }, []);
  // useEffect(() => {
  //   if (getComments) {
  //     alert("its true");
  //   }
  // }, [getComments]);
  useEffect(() => {
    console.log("");
    function handlerFn() {
      scrollFnSticky(stickLeftSidebar);
    }
    window.addEventListener("scroll", handlerFn);
    return () => {
      window.removeEventListener("scroll", handlerFn);
    };
  }, []);

  useEffect(() => {
    // if (getComments) {
    //   alert("its true");
    // }
    if (!location.state) {
      console.log(location);
    }
    if (location.state && getComments) {
      console.log(location.state);
      // alert(initRef.current);
      if (!initRef.current) {
        console.log(location.state.articleData.comments);
        if (location.state.articleData.comments) {
          const reverseArr = [...location.state.articleData.comments];
          reverseArr.reverse();
          setComments([...reverseArr]);
        }
        initRef.current = "initialized";
      }
      if (location.state.articleData.comments) {
        // setFullCommentsLength(
        //   getComLength(location.state.articleData.comments)
        // );
        fullCommentsLengthRef.current = getComLength(
          location.state.articleData.comments
        );
      } else {
        setGetComments(false);
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
          let modifyData = [];
          if (data) {
            let replies = [];
            for (let key in data) {
              console.log(key);
              modifyData.push(data[key]);
              modifyData[modifyData.length - 1].id = key;
              if (data[key].replies) {
                for (let keyRep in data[key].replies) {
                  replies.push(data[key].replies[keyRep]);
                  replies[replies.length - 1].id = [key, keyRep];
                }
                modifyData[modifyData.length - 1].replies = [...replies];
                replies = [];
              }
            }
            console.log(modifyData);
            modifyData.reverse();
            const check = checkForTopComments([...modifyData]);
            const replyHideArray = handleReplyHide(check);
            if (replyHideArray) {
              setRepliesToHide(replyHideArray);
            }
            console.log(check);
            setComments([...check]);
            showMoreFn(check.length);
            // alert("test");
            // location.state.articleData.comments = [...data];
            setGetComments(false);
            // setFullCommentsLength(getComLength(check));
            fullCommentsLengthRef.current = getComLength(check);
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
    } else if (!location.state) {
      console.log(history.location.pathname);
      let deconstructPathName = history.location.pathname.split("/");
      console.log(deconstructPathName);
      const path = {
        category: deconstructPathName[1],
        subCategory: deconstructPathName[2],
        id: deconstructPathName[4],
      };
      console.log(path);
      fetch(
        `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/articles/${path.category}/${path.subCategory}/-${path.id}.json`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          let commentData = [];
          let replies = [];
          let linkPath = "";
          if (data.comments) {
            for (let key in data.comments) {
              if (data.comments[key].replies) {
                for (let keyRep in data.comments[key].replies) {
                  replies.push(data.comments[key].replies[keyRep]);
                }
                commentData.push(data.comments[key]);
                commentData[commentData.length - 1].replies = [...replies];
                replies = [];
              } else {
                commentData.push(data.comments[key]);
              }
            }
            data.comments = [...commentData];
          }
          const titleSplit = data.title.split(" ");
          let titleSplit2 = [];
          let titleSplit3;
          titleSplit.forEach((split) => {
            titleSplit2.push(split.toLowerCase());
          });
          titleSplit3 = titleSplit2.join("-");
          titleSplit3 = titleSplit3.split(",").join("").split(" ").join("-");
          data.timeDiff = timeDifference(data.date);
          data.linkPath = `/${data.category}/${data.subCategory}/${titleSplit3}/${data.id}`;
          history.replace({
            state: {
              articleData: {
                ...JSON.parse(JSON.stringify(data)),
              },
            },
          });
        });
    }
  }, [location, getComments]);

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
      for (let i = 0; i < numberOfShows; i++) {
        val += 3;
        arr.push(val);
      }
      setShowMore([...arr]);
      console.log(arr);
    }
    // alert(numberOfShows);
  };

  // const sortCommentsByOrder = (comments) => {
  //   let sortComments = [];
  //   for (let i = 0; i < comments.length; i++) {
  //     sortComments[i] = [];
  //     sortComments[i][0] = comments[i].commentId.split("_");
  //     sortComments[i][1] = i;
  //   }
  //   let sortArr = [];
  //   for (let i = 0; i < sortComments.length; i++) {
  //     for (let j = 0; j < sortComments.length; j++) {
  //       if (+sortComments[j][0][0] === i) {
  //         sortArr[i] = sortComments[j];
  //       }
  //     }
  //   }
  //   let finalComments = [];
  //   let incr = 0;
  //   for (let i = sortArr.length - 1; i >= 0; i--) {
  //     finalComments[incr] = { ...comments[sortArr[i][1]] };
  //     incr++;
  //   }
  //   console.log(comments);
  //   console.log(sortArr);
  //   console.log(sortComments);
  //   console.log(finalComments);
  //   return finalComments;
  // };

  const handleReply = (ind) => {
    setReplyIndex(ind);
  };
  const handleNavigateTitle = () => {
    console.log(location.state.articleData);
    // alert(location.state.articleData.linkPath);
    // history.push(location.state.articleData.linkPath);
  };

  const checkForTopComments = (comments) => {
    let storeTopCommentsIndx = [];
    for (let i = 0; i < comments.length; i++) {
      if (
        comments[i].commentLikes &&
        Object.keys(comments[i].commentLikes).length >= 5
      ) {
        if (
          comments[i].commentDislikes &&
          Object.keys(comments[i].commentLikes).length >=
            Object.keys(comments[i].commentDislikes).length + 5
        ) {
          storeTopCommentsIndx.push([
            i,
            Object.keys(comments[i].commentLikes).length,
          ]);
        } else if (
          !comments[i].commentDislikes &&
          Object.keys(comments[i].commentLikes).length >= 5
        ) {
          storeTopCommentsIndx.push([
            i,
            Object.keys(comments[i].commentLikes).length,
          ]);
        }
      }
    }
    console.log(storeTopCommentsIndx);
    if (storeTopCommentsIndx.length > 0) {
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
    } else {
      return comments;
    }
  };

  const handleReport = (commentData) => {
    setReportComment(commentData);
  };

  return (
    <>
      {reportComment && (
        <Overlay navZ={true}>
          <ReportComment
            closeModal={setReportComment}
            reportData={reportComment}
          />
        </Overlay>
      )}
      <div id={s.commentPageContainer}>
        <div id={s.commentPageContainerHeader}>
          <div id={s.headerBundle}>
            <h3
              style={{
                color:
                  location.state &&
                  location.state.articleData &&
                  `${clrs[location.state.articleData.category.toLowerCase()]}`,
              }}
            >
              {location.state && location.state.articleData.subTitle}
            </h3>
            <h1 onClick={handleNavigateTitle}>
              <Link
                to={
                  location.state && {
                    pathname: location.state.articleData.linkPath,
                    state: {
                      articleData: location.state.articleData,
                    },
                  }
                }
              >
                {location.state && location.state.articleData.title}
              </Link>
            </h1>
          </div>
          <div id={s.headerShares}>
            <i class={"fas fa-share-alt"}></i> 63
          </div>
        </div>
        <div id={s.commentPageContainerBody}>
          <div id={s.commentSidebarLeft} ref={stickLeftSidebar}>
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
                  <h3>
                    {(location.state && location.state.articleData.author) ||
                      "R. D."}
                  </h3>
                  <p>
                    {timeDifference(
                      location.state && location.state.articleData.date
                    )}
                  </p>
                </div>
              </div>
              <div id={s.commentsShare}>
                <div id={s.comments}>
                  <h2>{fullCommentsLengthRef.current}</h2>
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
                <h3>Komentari ({fullCommentsLengthRef.current})</h3>
                <div id={s.povratakNaClanak}>
                  <Link
                    to={
                      location.state && {
                        pathname: location.state.articleData.linkPath,
                        state: {
                          articleData: location.state.articleData,
                        },
                      }
                    }
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
                    path={
                      location.state && {
                        category: location.state.articleData.category,
                        subCategory: location.state.articleData.subCategory,
                        id: location.state.articleData.id,
                      }
                    }
                    getComments={setGetComments}
                  />
                )}
              </div>
              <div id={s.commentBodyHeaderAlert}>
                <span>NAPOMENA:</span> &nbsp;
                <span>
                  Komentarisanje članaka na portalu Klix.ba dozvoljeno je samo
                  registrovanim korisnicima. Molimo korisnike da se suzdrže od
                  vrijeđanja, psovanja i vulgarnog izražavanja. Komentari
                  odražavaju stavove isključivo njihovih autora, koji zbog
                  govora mržnje mogu biti i krivično gonjeni. Kao čitatelj
                  prihvatate mogućnost da među komentarima mogu biti pronađeni
                  sadržaji koji mogu biti u suprotnosti sa vašim vjerskim,
                  moralnim i drugim načelima i uvjerenjima. Svaki korisnik prije
                  pisanja komentara mora se upoznati sa
                </span>
                &nbsp;
                <Link
                  to={{ pathname: "/komentari" }}
                  target="_blank"
                  style={
                    location.state && {
                      color:
                        location.state.articleData &&
                        `${
                          clrs[
                            location.state.articleData.category.toLowerCase()
                          ]
                        }`,
                    }
                  }
                >
                  Pravilima i uslovima korištenja komentara.
                </Link>
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
                            commentIndexDB={comment.id}
                            comment={comment.comment}
                            displayName={comment.userName}
                            commentLikes={comment.commentLikes}
                            commentDislikes={comment.commentDislikes}
                            avatarColor={comment.avatarColor}
                            topComment={
                              (pushFinal.current &&
                                pushFinal.current.length &&
                                i === 0 &&
                                "topComment") ||
                              (pushFinal2.current &&
                                pushFinal2.current.length &&
                                i === 1 &&
                                "topComment")
                            }
                            negativeComment={
                              comment.commentDislikes &&
                              Object.keys(comment.commentDislikes).length >=
                                (comment.commentLikes
                                  ? Object.keys(comment.commentLikes).length + 5
                                  : 5)
                            }
                            date={timeDifference(comment.date)}
                            handleReply={handleReply}
                            handleReport={handleReport}
                          />
                          <CommentReply
                            commentIndex={i}
                            commentIndexDB={comment.id}
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
                            commentIndexDB={comment.id}
                            comment={comment.comment}
                            displayName={comment.userName}
                            commentLikes={comment.commentLikes}
                            commentDislikes={comment.commentDislikes}
                            avatarColor={comment.avatarColor}
                            topComment={
                              (pushFinal.current &&
                                pushFinal.current.length &&
                                i === 0 &&
                                "topComment") ||
                              (pushFinal2.current &&
                                pushFinal2.current.length &&
                                i === 1 &&
                                "topComment")
                            }
                            negativeComment={
                              comment.commentDislikes &&
                              Object.keys(comment.commentDislikes).length >=
                                (comment.commentLikes
                                  ? Object.keys(comment.commentLikes).length + 5
                                  : 5)
                            }
                            date={timeDifference(comment.date)}
                            handleReply={handleReply}
                            handleReport={handleReport}
                          />
                          <CommentReply
                            commentIndex={i}
                            commentIndexDB={comment.id}
                            getComments={setGetComments}
                          />
                          {comment.replies.map((comRep, ind) => {
                            return (
                              <>
                                {repliesToHide.length > 0 &&
                                repliesToHide.find((el) => el === i) !==
                                  undefined &&
                                ind < 2 ? (
                                  <CommentItem
                                    key={uuid()}
                                    commentIndex={[i, ind]}
                                    commentIndexDB={comRep.id}
                                    comment={comRep.comment}
                                    displayName={comRep.userName}
                                    commentLikes={comRep.commentLikes}
                                    commentDislikes={comRep.commentDislikes}
                                    avatarColor={comRep.avatarColor}
                                    negativeComment={
                                      comRep.commentDislikes &&
                                      Object.keys(comRep.commentDislikes)
                                        .length >=
                                        (comRep.commentLikes
                                          ? Object.keys(comRep.commentLikes)
                                              .length + 5
                                          : 5)
                                    }
                                    date={timeDifference(comRep.date)}
                                    handleReply={handleReply}
                                    handleReport={handleReport}
                                  />
                                ) : null}
                                {((repliesToHide.length &&
                                  repliesToHide.find((el) => el === i)) ===
                                  undefined ||
                                  !repliesToHide.length) && (
                                  <CommentItem
                                    key={uuid()}
                                    commentIndex={[i, ind]}
                                    commentIndexDB={comRep.id}
                                    comment={comRep.comment}
                                    displayName={comRep.userName}
                                    commentLikes={comRep.commentLikes}
                                    commentDislikes={comRep.commentDislikes}
                                    avatarColor={comRep.avatarColor}
                                    negativeComment={
                                      comRep.commentDislikes &&
                                      Object.keys(comRep.commentDislikes)
                                        .length >=
                                        (comRep.commentLikes
                                          ? Object.keys(comRep.commentLikes)
                                              .length + 5
                                          : 5)
                                    }
                                    date={timeDifference(comRep.date)}
                                    handleReply={handleReply}
                                    handleReport={handleReport}
                                  />
                                )}
                                {repliesToHide.length > 0 ? (
                                  repliesToHide.length &&
                                  repliesToHide.find((el) => el === i) !==
                                    undefined &&
                                  ind === 1 ? (
                                    <CommentShow
                                      onClick={() =>
                                        spliceRepliesHide(i, "replies")
                                      }
                                      showReply={comment.replies.length - 2}
                                    />
                                  ) : null
                                ) : null}
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
                            commentIndexDB={comment.id}
                            comment={comment.comment}
                            displayName={comment.userName}
                            commentLikes={comment.commentLikes}
                            commentDislikes={comment.commentDislikes}
                            avatarColor={comment.avatarColor}
                            topComment={
                              (pushFinal.current &&
                                pushFinal.current.length &&
                                i === 0 &&
                                "topComment") ||
                              (pushFinal2.current &&
                                pushFinal2.current.length &&
                                i === 1 &&
                                "topComment")
                            }
                            negativeComment={
                              comment.commentDislikes &&
                              Object.keys(comment.commentDislikes).length >=
                                (comment.commentLikes
                                  ? Object.keys(comment.commentLikes).length + 5
                                  : 5)
                            }
                            date={timeDifference(comment.date)}
                            handleReply={handleReply}
                            handleReport={handleReport}
                          />
                          {comment.replies &&
                            comment.replies.map((comRep, ind) => {
                              return (
                                <React.Fragment key={uuid()}>
                                  {repliesToHide.length > 0 &&
                                    repliesToHide.find((el) => el === i) !==
                                      undefined &&
                                    ind < 2 && (
                                      <>
                                        <CommentItem
                                          commentIndex={[i, ind]}
                                          commentIndexDB={comRep.id}
                                          comment={comRep.comment}
                                          displayName={comRep.userName}
                                          commentLikes={comRep.commentLikes}
                                          commentDislikes={
                                            comRep.commentDislikes
                                          }
                                          avatarColor={comRep.avatarColor}
                                          negativeComment={
                                            comRep.commentDislikes &&
                                            Object.keys(comRep.commentDislikes)
                                              .length >=
                                              (comRep.commentLikes
                                                ? Object.keys(
                                                    comRep.commentLikes
                                                  ).length + 5
                                                : 5)
                                          }
                                          date={timeDifference(comRep.date)}
                                          handleReply={handleReply}
                                          handleReport={handleReport}
                                        />
                                        {replyIndex[1] === ind &&
                                        replyIndex[0] === i ? (
                                          <CommentReply
                                            commentIndex={[i, ind]}
                                            commentIndexDB={comRep.id}
                                            getComments={setGetComments}
                                          />
                                        ) : null}
                                      </>
                                    )}
                                  {((repliesToHide.length &&
                                    repliesToHide.find((el) => el === i) ===
                                      undefined) ||
                                    !repliesToHide.length) && (
                                    <>
                                      <CommentItem
                                        commentIndex={[i, ind]}
                                        commentIndexDB={comRep.id}
                                        comment={comRep.comment}
                                        displayName={comRep.userName}
                                        commentLikes={comRep.commentLikes}
                                        commentDislikes={comRep.commentDislikes}
                                        avatarColor={comRep.avatarColor}
                                        negativeComment={
                                          comRep.commentDislikes &&
                                          Object.keys(comRep.commentDislikes)
                                            .length >=
                                            (comRep.commentLikes
                                              ? Object.keys(comRep.commentLikes)
                                                  .length + 5
                                              : 5)
                                        }
                                        date={timeDifference(comRep.date)}
                                        handleReply={handleReply}
                                        handleReport={handleReport}
                                      />
                                      {replyIndex[1] === ind &&
                                      replyIndex[0] === i ? (
                                        <CommentReply
                                          commentIndex={[i, ind]}
                                          commentIndexDB={comRep.id}
                                          getComments={setGetComments}
                                        />
                                      ) : null}
                                    </>
                                  )}
                                  {repliesToHide.length > 0 ? (
                                    repliesToHide.length &&
                                    repliesToHide.find((el) => el === i) !==
                                      undefined &&
                                    ind === 1 ? (
                                      <CommentShow
                                        onClick={() =>
                                          spliceRepliesHide(i, "replies")
                                        }
                                        showReply={comment.replies.length - 2}
                                      />
                                    ) : null
                                  ) : null}
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
                            commentIndexDB={comment.id}
                            key={uuid()}
                            comment={comment.comment}
                            displayName={comment.userName}
                            commentLikes={comment.commentLikes}
                            commentDislikes={comment.commentDislikes}
                            avatarColor={comment.avatarColor}
                            topComment={
                              (pushFinal.current &&
                                pushFinal.current.length &&
                                i === 0 &&
                                "topComment") ||
                              (pushFinal2.current &&
                                pushFinal2.current.length &&
                                i === 1 &&
                                "topComment")
                            }
                            negativeComment={
                              comment.commentDislikes &&
                              Object.keys(comment.commentDislikes).length >=
                                (comment.commentLikes
                                  ? Object.keys(comment.commentLikes).length + 5
                                  : 5)
                            }
                            date={timeDifference(comment.date)}
                            handleReply={handleReply}
                            handleReport={handleReport}
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
                            commentIndexDB={comment.id}
                            comment={comment.comment}
                            displayName={comment.userName}
                            commentLikes={comment.commentLikes}
                            commentDislikes={comment.commentDislikes}
                            avatarColor={comment.avatarColor}
                            topComment={
                              (pushFinal.current &&
                                pushFinal.current.length &&
                                i === 0 &&
                                "topComment") ||
                              (pushFinal2.current &&
                                pushFinal2.current.length &&
                                i === 1 &&
                                "topComment")
                            }
                            negativeComment={
                              comment.commentDislikes &&
                              Object.keys(comment.commentDislikes).length >=
                                (comment.commentLikes
                                  ? Object.keys(comment.commentLikes).length + 5
                                  : 5)
                            }
                            date={timeDifference(comment.date)}
                            handleReply={handleReply}
                            handleReport={handleReport}
                          />
                          {comment.replies.map((comRep, ind) => {
                            return (
                              <React.Fragment key={uuid()}>
                                {repliesToHide.length > 0 &&
                                repliesToHide.find((el) => el === i) !==
                                  undefined &&
                                ind < 2 ? (
                                  <CommentItem
                                    key={uuid()}
                                    commentIndex={[i, ind]}
                                    commentIndexDB={comRep.id}
                                    comment={comRep.comment}
                                    displayName={comRep.userName}
                                    commentLikes={comRep.commentLikes}
                                    commentDislikes={comRep.commentDislikes}
                                    avatarColor={comRep.avatarColor}
                                    negativeComment={
                                      comRep.commentDislikes &&
                                      Object.keys(comRep.commentDislikes)
                                        .length >=
                                        (comRep.commentLikes
                                          ? Object.keys(comRep.commentLikes)
                                              .length + 5
                                          : 5)
                                    }
                                    date={timeDifference(comRep.date)}
                                    handleReply={handleReply}
                                    handleReport={handleReport}
                                  />
                                ) : null}
                                {(repliesToHide.length &&
                                  repliesToHide.find((el) => el === i)) ===
                                  undefined || !repliesToHide.length ? (
                                  <CommentItem
                                    key={uuid()}
                                    commentIndex={[i, ind]}
                                    commentIndexDB={comRep.id}
                                    comment={comRep.comment}
                                    displayName={comRep.userName}
                                    commentLikes={comRep.commentLikes}
                                    commentDislikes={comRep.commentDislikes}
                                    avatarColor={comRep.avatarColor}
                                    negativeComment={
                                      comRep.commentDislikes &&
                                      Object.keys(comRep.commentDislikes)
                                        .length >=
                                        (comRep.commentLikes
                                          ? Object.keys(comRep.commentLikes)
                                              .length + 5
                                          : 5)
                                    }
                                    date={timeDifference(comRep.date)}
                                    handleReply={handleReply}
                                    handleReport={handleReport}
                                  />
                                ) : null}
                                {repliesToHide.length > 0 ? (
                                  repliesToHide.length &&
                                  repliesToHide.find((el) => el === i) !==
                                    undefined &&
                                  ind === 1 ? (
                                    <CommentShow
                                      onClick={() =>
                                        spliceRepliesHide(i, "replies")
                                      }
                                      showReply={comment.replies.length - 2}
                                    />
                                  ) : null
                                ) : null}
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
    </>
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
