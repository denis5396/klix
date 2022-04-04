import React, { useEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { timeDifference } from "../AdminPanel/EditArticle/EditArticle";
import { clrs } from "../ArticleLink/ArticleLink";
import { splitTitle } from "../HomeMain/HomeMain";
import { getComLengthIfObject, handleReplyHide } from "./Comment";
import { v1 as uuid } from "uuid";
import CommentItem from "./CommentItem";
import s from "./LinkToComment.module.css";
import CommentReply from "./CommentReply";
import CommentShow from "./CommentShow";
import Overlay from "../Overlay/Overlay";
import ReportComment from "./reportComment/ReportComment";
import { auth } from "../../firebase";

const LinkToComment = (props) => {
  const location = useLocation();
  const history = useHistory();
  const [commentData, setCommentData] = useState([]);
  const [articleData, setArticleData] = useState({});
  const [replyIndex, setReplyIndex] = useState(null);
  const [repliesToHide, setRepliesToHide] = useState([]);
  const [reportComment, setReportComment] = useState(false);
  const fullComLength = useRef(0);
  useEffect(() => {
    if (location) {
      console.log(location);
      console.log(location.state);
      if (location.state) {
        if (location.search) {
          history.replace({
            pathname: location.pathname,
            state: {
              ...location.state,
            },
          });
        } else {
          fetch(
            `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/articles/${
              location.state.articleLink || location.state.articlePath
            }.json`
          )
            .then((res) => res.json())
            .then((data) => {
              console.log(data);
              setArticleData({
                author: data.author,
                title: data.title,
                subTitle: data.subTitle,
                category: data.category.toLowerCase(),
                shares: data.shares ? data.shares : 0,
                date: data.date,
                commentsLength: getComLengthIfObject(data.comments),
                linkPath: `/${data.category}/${data.subCategory}/${splitTitle(
                  data.title
                )}/${data.id}`,
              });
              fullComLength.current = getComLengthIfObject(data.comments);
              let arr = undefined;
              const path = `${data.category}/${data.subCategory}/-${data.id}`;
              for (let key in data.comments) {
                if (location.state.parentCommentId) {
                  if (key === location.state.parentCommentId) {
                    let replies = [];
                    console.log(data.comments[key]);
                    arr = [{ ...data.comments[key] }];
                    arr[0].path = `${path}/comments/${key}`;
                    arr[0].id = key;
                    let incr = 0;
                    for (let ind of Object.values(data.comments[key].replies)) {
                      replies.push(ind);
                      const repId = Object.keys(data.comments[key].replies)[
                        incr
                      ];
                      replies[
                        replies.length - 1
                      ].path = `${path}/comments/${key}/replies/${repId}`;
                      replies[replies.length - 1].id = repId;
                      incr++;
                    }
                    arr[0].replies = [...replies];
                    console.log(arr[0]);
                    console.log(arr);
                    setCommentData(arr);
                    const replyHideArray = handleReplyHide(arr);
                    console.log(replyHideArray);
                    if (replyHideArray) {
                      setRepliesToHide(replyHideArray);
                    }
                  }
                } else {
                  if (key === location.state.commentId) {
                    console.log(data.comments[key]);
                    arr = [{ ...data.comments[key] }];
                    arr[0].path = `${path}/comments/${key}`;
                    arr[0].id = key;
                    if (arr[0].replies) {
                      let replies = [];
                      let incr = 0;
                      for (let ind of Object.values(
                        data.comments[key].replies
                      )) {
                        replies.push(ind);
                        const repId = Object.keys(data.comments[key].replies)[
                          incr
                        ];
                        replies[
                          replies.length - 1
                        ].path = `${path}/comments/${key}/replies/${repId}`;
                        replies[replies.length - 1].id = repId;
                        incr++;
                      }
                      arr[0].replies = [...replies];
                    }
                    console.log(arr[0]);
                    setCommentData(arr);
                    const replyHideArray = handleReplyHide(arr);
                    console.log(replyHideArray);
                    if (replyHideArray) {
                      setRepliesToHide(replyHideArray);
                    }
                  }
                }
              }
            });
        }
      } else {
        if (location.search) {
          const urlParam = JSON.parse(
            location.search.slice(1).split("%22").join('"')
          );
          console.log(urlParam);
          history.replace({
            pathname: location.pathname,
            state: {
              ...urlParam,
            },
          });
        } else {
          const userId =
            JSON.parse(localStorage.getItem("userObj")).uId ||
            auth.currentUser.uid;
          let idFromPath = location.pathname.split("/");
          idFromPath = idFromPath[idFromPath.length - 1];
          console.log(idFromPath);
          fetch(
            `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/comments.json`
          )
            .then((res) => res.json())
            .then((data) => {
              for (let key in data) {
                if (Object.keys(data[key])[0] === idFromPath) {
                  console.log(Object.values(data[key])[0]);
                  const obj = Object.values(data[key])[0];
                  const path = `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/articles/${
                    obj.articlePath
                  }/comments/${
                    obj.parentCommentId ? obj.parentCommentId : obj.commentId
                  }.json`;

                  console.log(path);
                  console.log(obj);
                  history.replace({
                    pathname: location.pathname,
                    state: {
                      ...obj,
                    },
                  });
                }
              }
            });
        }
      }
    }
  }, [location]);

  const handleReply = (ind) => {
    setReplyIndex(ind);
  };

  const removeShowMore = () => {
    setRepliesToHide([]);
  };

  useEffect(() => {
    console.log(props);
  }, []);

  const handleReport = (reportData) => {
    console.log(reportData);
    setReportComment(reportData);
  };

  useEffect(() => {
    if (commentData) {
      console.log(commentData);
    }
  }, [commentData]);

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
      <div id={s.commentLinkContainer}>
        <div id={s.commentPageContainerHeader}>
          <div id={s.headerBundle}>
            <h3
              style={{
                color: `${clrs[articleData.category]}`,
              }}
            >
              {articleData.subTitle}
            </h3>
            <h1>
              <Link to={articleData.linkPath}>{articleData.title}</Link>
            </h1>
          </div>
          <div id={s.headerShares}>
            <i class="fas fa-share-alt"></i>{" "}
            {articleData &&
            articleData.shares &&
            articleData.shares.constructor === Object
              ? Object.keys(articleData.shares).length
              : 0}
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
                  <h3>{articleData.author}</h3>
                  <p>{timeDifference(articleData.date)}</p>
                </div>
              </div>
              <div id={s.commentsShare}>
                <div>
                  <h2>{fullComLength.current}</h2>
                  <p>komentara</p>
                </div>
                <div>
                  <h2>
                    {articleData &&
                    articleData.shares &&
                    articleData.shares.constructor === Object
                      ? Object.keys(articleData.shares).length
                      : 0}
                  </h2>
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
            <div id={s.commentBodyContentHeader}>
              <h3>Komentar</h3>
              <div id={s.povratakNaClanak}>
                <Link to={articleData.linkPath}>
                  <i class="far fa-arrow-alt-circle-left"></i>&nbsp;Povratak na
                  članak
                </Link>
              </div>
            </div>
            {commentData &&
              commentData.map((com, i) => {
                if (i === replyIndex) {
                  if (!com.replies) {
                    return (
                      <React.Fragment key={uuid()}>
                        <CommentItem
                          commentIndex={i}
                          commentIndexDB={com.id}
                          comment={com.comment}
                          displayName={com.userName}
                          commentLikes={com.commentLikes}
                          commentDislikes={com.commentDislikes}
                          avatarColor={com.avatarColor}
                          date={timeDifference(com.date)}
                          path={com.path}
                          setCommentData={setCommentData}
                          commentData={commentData}
                          handleReply={handleReply}
                          handleReport={handleReport}
                        />
                        <CommentReply
                          commentIndex={i}
                          commentIndexDB={com.id}
                          setCommentData={setCommentData}
                          setReplyIndex={setReplyIndex}
                          path={com.path}
                          ref={fullComLength}
                        />
                      </React.Fragment>
                    );
                  } else if (com.replies) {
                    return (
                      <React.Fragment key={uuid()}>
                        <CommentItem
                          commentIndex={i}
                          commentIndexDB={com.id}
                          comment={com.comment}
                          displayName={com.userName}
                          commentLikes={com.commentLikes}
                          commentDislikes={com.commentDislikes}
                          avatarColor={com.avatarColor}
                          date={timeDifference(com.date)}
                          path={com.path}
                          setCommentData={setCommentData}
                          commentData={commentData}
                          handleReply={handleReply}
                          handleReport={handleReport}
                        />
                        <CommentReply
                          commentIndex={i}
                          commentIndexDB={com.id}
                          setCommentData={setCommentData}
                          setReplyIndex={setReplyIndex}
                          path={com.path}
                          ref={fullComLength}
                        />
                        {com.replies
                          ? com.replies.map((comRep, ind) => {
                              return (
                                <React.Fragment>
                                  {repliesToHide.length && ind < 2 ? (
                                    <CommentItem
                                      key={uuid()}
                                      commentIndex={[i, ind]}
                                      commentIndexDB={comRep.id}
                                      comment={comRep.comment}
                                      displayName={comRep.userName}
                                      commentLikes={comRep.commentLikes}
                                      commentDislikes={comRep.commentDislikes}
                                      avatarColor={comRep.avatarColor}
                                      date={timeDifference(comRep.date)}
                                      path={comRep.path}
                                      setCommentData={setCommentData}
                                      commentData={commentData}
                                      handleReply={handleReply}
                                      handleReport={handleReport}
                                    />
                                  ) : null}
                                  {!repliesToHide.length ? (
                                    <CommentItem
                                      key={uuid()}
                                      commentIndex={[i, ind]}
                                      commentIndexDB={comRep.id}
                                      comment={comRep.comment}
                                      displayName={comRep.userName}
                                      commentLikes={comRep.commentLikes}
                                      commentDislikes={comRep.commentDislikes}
                                      avatarColor={comRep.avatarColor}
                                      date={timeDifference(comRep.date)}
                                      path={comRep.path}
                                      setCommentData={setCommentData}
                                      commentData={commentData}
                                      handleReply={handleReply}
                                      handleReport={handleReport}
                                    />
                                  ) : null}
                                  {repliesToHide.length && ind === 1 ? (
                                    <CommentShow
                                      onClick={() => removeShowMore()}
                                      showReply={com.replies.length - 2}
                                    />
                                  ) : null}
                                </React.Fragment>
                              );
                            })
                          : null}
                      </React.Fragment>
                    );
                  }
                } else if (Array.isArray(replyIndex)) {
                  return (
                    <React.Fragment key={uuid()}>
                      <CommentItem
                        commentIndex={i}
                        commentIndexDB={com.id}
                        comment={com.comment}
                        displayName={com.userName}
                        commentLikes={com.commentLikes}
                        commentDislikes={com.commentDislikes}
                        avatarColor={com.avatarColor}
                        date={timeDifference(com.date)}
                        path={com.path}
                        setCommentData={setCommentData}
                        commentData={commentData}
                        handleReply={handleReply}
                        handleReport={handleReport}
                      />
                      {com.replies &&
                        com.replies.map((comRep, ind) => {
                          return (
                            <React.Fragment key={uuid()}>
                              {repliesToHide.length && ind < 2 ? (
                                <>
                                  <CommentItem
                                    commentIndex={[i, ind]}
                                    commentIndexDB={comRep.id}
                                    comment={comRep.comment}
                                    displayName={comRep.userName}
                                    commentLikes={comRep.commentLikes}
                                    commentDislikes={comRep.commentDislikes}
                                    avatarColor={comRep.avatarColor}
                                    date={timeDifference(comRep.date)}
                                    path={comRep.path}
                                    setCommentData={setCommentData}
                                    commentData={commentData}
                                    handleReply={handleReply}
                                    handleReport={handleReport}
                                  />
                                  {replyIndex[1] === ind &&
                                  replyIndex[0] === i ? (
                                    <CommentReply
                                      commentIndex={[i, ind]}
                                      commentIndexDB={[com.id, comRep.id]}
                                      setCommentData={setCommentData}
                                      setReplyIndex={setReplyIndex}
                                      path={com.path}
                                      ref={fullComLength}
                                    />
                                  ) : null}
                                </>
                              ) : null}
                              {!repliesToHide.length ? (
                                <>
                                  <CommentItem
                                    commentIndex={[i, ind]}
                                    commentIndexDB={comRep.id}
                                    comment={comRep.comment}
                                    displayName={comRep.userName}
                                    commentLikes={comRep.commentLikes}
                                    commentDislikes={comRep.commentDislikes}
                                    avatarColor={comRep.avatarColor}
                                    date={timeDifference(comRep.date)}
                                    path={comRep.path}
                                    setCommentData={setCommentData}
                                    commentData={commentData}
                                    handleReply={handleReply}
                                    handleReport={handleReport}
                                  />
                                  {replyIndex[1] === ind &&
                                  replyIndex[0] === i ? (
                                    <CommentReply
                                      commentIndex={[i, ind]}
                                      commentIndexDB={[com.id, comRep.id]}
                                      setCommentData={setCommentData}
                                      setReplyIndex={setReplyIndex}
                                      path={com.path}
                                      ref={fullComLength}
                                    />
                                  ) : null}
                                </>
                              ) : null}
                              {repliesToHide.length && ind === 1 ? (
                                <CommentShow
                                  onClick={() => removeShowMore()}
                                  showReply={com.replies.length - 2}
                                />
                              ) : null}
                            </React.Fragment>
                          );
                        })}
                    </React.Fragment>
                  );
                } else {
                  if (!com.replies) {
                    return (
                      <React.Fragment key={uuid()}>
                        <CommentItem
                          commentIndex={i}
                          commentIndexDB={com.id}
                          comment={com.comment}
                          displayName={com.userName}
                          commentLikes={com.commentLikes}
                          commentDislikes={com.commentDislikes}
                          avatarColor={com.avatarColor}
                          date={timeDifference(com.date)}
                          path={com.path}
                          setCommentData={setCommentData}
                          commentData={commentData}
                          handleReply={handleReply}
                          handleReport={handleReport}
                        />
                      </React.Fragment>
                    );
                  } else if (com.replies) {
                    return (
                      <React.Fragment key={uuid()}>
                        <CommentItem
                          commentIndex={i}
                          commentIndexDB={com.id}
                          comment={com.comment}
                          displayName={com.userName}
                          commentLikes={com.commentLikes}
                          commentDislikes={com.commentDislikes}
                          avatarColor={com.avatarColor}
                          date={timeDifference(com.date)}
                          path={com.path}
                          setCommentData={setCommentData}
                          commentData={commentData}
                          handleReply={handleReply}
                          handleReport={handleReport}
                        />
                        {com.replies
                          ? com.replies.map((comRep, ind) => {
                              return (
                                <React.Fragment key={uuid()}>
                                  {repliesToHide.length && ind < 2 ? (
                                    <CommentItem
                                      commentIndex={[i, ind]}
                                      commentIndexDB={comRep.id}
                                      comment={comRep.comment}
                                      displayName={comRep.userName}
                                      commentLikes={comRep.commentLikes}
                                      commentDislikes={comRep.commentDislikes}
                                      avatarColor={comRep.avatarColor}
                                      date={timeDifference(comRep.date)}
                                      path={comRep.path}
                                      setCommentData={setCommentData}
                                      commentData={commentData}
                                      handleReply={handleReply}
                                      handleReport={handleReport}
                                    />
                                  ) : null}
                                  {!repliesToHide.length ? (
                                    <CommentItem
                                      commentIndex={[i, ind]}
                                      commentIndexDB={comRep.id}
                                      comment={comRep.comment}
                                      displayName={comRep.userName}
                                      commentLikes={comRep.commentLikes}
                                      commentDislikes={comRep.commentDislikes}
                                      avatarColor={comRep.avatarColor}
                                      date={timeDifference(comRep.date)}
                                      path={comRep.path}
                                      setCommentData={setCommentData}
                                      commentData={commentData}
                                      handleReply={handleReply}
                                      handleReport={handleReport}
                                    />
                                  ) : null}
                                  {repliesToHide.length && ind === 1 ? (
                                    <CommentShow
                                      onClick={() => removeShowMore()}
                                      showReply={com.replies.length - 2}
                                    />
                                  ) : null}
                                </React.Fragment>
                              );
                            })
                          : null}
                      </React.Fragment>
                    );
                  }
                }
              })}
            <Link
              to={`${articleData.linkPath}/komentari`}
              style={{ textDecoration: "none" }}
            >
              <CommentShow showAll={fullComLength.current} />
            </Link>
          </div>
          <div></div>
        </div>
      </div>
    </>
  );
};

export default LinkToComment;
