import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoginContext from "../../context";
import { auth, db } from "../../firebase";
import { v1 as uuid } from "uuid";
import CommentShow from "../comment/CommentShow";
import UserComment from "../UserComment/UserComment";
import s from "./UserInfo.module.css";
import Overlay from "../Overlay/Overlay";
import ReportComment from "../comment/reportComment/ReportComment";

const UserConfig = () => {
  const [uData, setUData] = useState({});
  const ctx = useContext(LoginContext);
  const [showMore, setShowMore] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [reportComment, setReportComment] = useState(false);
  const { user } = ctx;
  const logoutHandler = () => {
    ctx.logout();
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (fetching) {
      getData();
    }
  }, [fetching]);

  useEffect(() => {
    console.log(Object.assign({}, uData.comments));
    if (uData.comments && fetching) {
      console.log(uData.comments);
      const promises = [];
      const spliceArray = [];
      const contentArray = {};
      const currentLength =
        Object.keys(Object.assign({}, uData.comments)).length - 1;
      console.log(currentLength);
      for (let key in uData.comments) {
        const { articlePath } = Object.values(uData.comments[key])[0];
        const { commentId } = Object.values(uData.comments[key])[0];
        const { parentCommentId } = Object.values(uData.comments[key])[0];
        if (articlePath && commentId) {
          spliceArray.push(key);
          contentArray[key] = Object.values(uData.comments[key])[0];
          promises.push(
            fetch(
              `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/articles/${articlePath}/comments/${
                parentCommentId ? "/" + parentCommentId : commentId
              }${parentCommentId ? "/replies/" + commentId : ""}.json`
            ).then((res) => res.json())
          );
        }
      }
      const promisedData = Promise.all(promises);
      promisedData.then((data) => {
        console.log(data);
        console.log(spliceArray);
        console.log(contentArray);
        setFetching(false); //it must be above setData because if we put it below that then once setdata finishes the useeffect won't wait for setfetching to turn to false so it will count as true when the useeffect reruns
        setUData((old) => {
          let oldCpy = { ...old };
          const range = [spliceArray[0], spliceArray[spliceArray.length - 1]];
          console.log(range);
          console.log(uData.comLength - 1 - currentLength - 2);
          console.log(uData.comLength - 1 - currentLength);
          let incr = 0;
          for (let i = +range[0]; i <= +range[1]; i++) {
            oldCpy.comments[i] = { ...data[incr] };
            oldCpy.comments[i] = { ...oldCpy.comments[i], ...contentArray[i] };
            incr++;
          }
          console.log(oldCpy.comments);
          console.log(oldCpy);
          return oldCpy;
        });
        if (uData.comLength - 1 - currentLength - 3 > 0) {
          setShowMore(true);
        } else {
          if (uData.comLength - 1 - currentLength > 0) {
            setShowMore(true);
          } else {
            setShowMore(false);
          }
        }
      });
    }
  }, [uData]);

  const getData = () => {
    const userObj = JSON.parse(localStorage.getItem("userObj"));
    if (userObj && !Object.keys(uData).length) {
      setUData({ ...userObj });
    }
    const dbRef = db.ref("users").child(`${userObj.uId}`).child("comments");
    dbRef.child("comLength").once("value", (snap) => {
      const dataLength = snap.val();
      const currentLength = uData.comments ? uData.comments.length - 1 : 0;
      let lessThanZero = false;
      if (dataLength - 1 - currentLength - 3 < 0) {
        lessThanZero = true;
      }
      dbRef
        .orderByKey()
        .startAt(
          `${
            lessThanZero
              ? 0
              : currentLength
              ? dataLength - 1 - currentLength - 3 // -10 so when we add + 9 we dont get the latest fetched item in the ui as the last item here, so we would only fetch 9 new ones and the last one would be a comment that is already showing
              : dataLength - 1 - 2
          }`
        )
        .endAt(
          `${
            currentLength ? dataLength - 1 - currentLength - 1 : dataLength - 1
          }`
        )
        .once("value", (snap) => {
          console.log(snap.val());
          const data = snap.val();
          if (data) {
            const newArr =
              data.constructor === Array
                ? data.filter((n) => n !== undefined && n !== null).reverse()
                : Object.values(data).reverse(); // remove empty fields
            console.log(newArr);
            setUData((old) => {
              let oldCpy = { ...JSON.parse(JSON.stringify(old)) };
              if (oldCpy.comments) {
                let cpy = [...oldCpy.comments];
                oldCpy.comments = [...cpy, ...newArr];
              } else {
                oldCpy.comments = [...newArr];
              }
              if (!oldCpy.comLength) {
                oldCpy.comLength = dataLength;
              }
              console.log(oldCpy);
              return oldCpy;
            });
            // if (dataLength - 1 - currentLength - 3 > 0) {
            //   setShowMore(true);
            // } else {
            //   setShowMore(false);
            // }
            // setFetching(false);
          }
        });
    });
  };

  const showMoreFn = () => {
    setFetching(true);
    // setShowMore(false); //to hide it for a moment so the data gets pushed down, and it shouldn't be there until we know if we need it again or not
    //fixed with double conditionals in jsx
  };

  const handleReport = (reportData) => {
    console.log(reportData);
    setReportComment(reportData);
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
      <div id={s.userInfoContainer}>
        <div id={s.userInfo}>
          <div
            id={s.userInfoF}
            style={{ backgroundColor: `#${ctx.user.avatarColor}` }}
          >
            <i
              class="fas fa-user"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                color: "#fff",
                padding: "1rem",
                borderRadius: ".5rem",
                fontSize: "1.3rem",
              }}
            ></i>
            <h1>{uData.displayName}</h1> (
            <Link to="/mojprofil">uredi profil</Link> |
            <Link onClick={logoutHandler} to="/">
              odjavi se
            </Link>
            )
          </div>
          <div id={s.userData}>
            <div className={s.userDataItem}>
              <h3>Spol</h3>
              <p>{uData.gender}</p>
            </div>
            <div className={s.userDataItem}>
              <h3>Boja avatara</h3>
              <p>{uData.avatarColor}</p>
            </div>
            <div className={s.userDataItem}>
              <h3>Banovan</h3>
              <p>{uData.banned}</p>
            </div>
            <div className={s.userDataItem}>
              <h3>Registrovan</h3>
              <p>{uData.registered}</p>
            </div>
            <div className={s.userDataItem}>
              <h3>Komentari</h3>
              <p>{uData.comLength}</p>
            </div>
          </div>
        </div>
        <div id={s.commentContainer}>
          <div id={s.comments}>
            <h3>Komentari korisnika</h3>
            <div>
              {uData.comments &&
                !fetching &&
                uData.comments.map((comment, i) => (
                  <UserComment
                    key={uuid()}
                    commentData={comment}
                    index={i}
                    handleReport={handleReport}
                  />
                ))}
              {uData.comments &&
                fetching &&
                uData.comments.map((comment, i) =>
                  comment.avatarColor ? (
                    <UserComment
                      key={uuid()}
                      commentData={comment}
                      index={i}
                      handleReport={handleReport}
                    />
                  ) : null
                )}
              {showMore && fetching ? (
                <CommentShow loading={fetching} onClick={showMoreFn} />
              ) : null}
              {showMore && !fetching ? (
                <CommentShow loading={fetching} onClick={showMoreFn} />
              ) : null}
              {/* for clean rendering, there is flickering otherwise and content jumps */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserConfig;
