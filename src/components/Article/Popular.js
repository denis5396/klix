import React from "react";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import s from "./Popular.module.css";
import { v1 as uuid } from "uuid";
import { clrs } from "../ArticleLink/ArticleLink";
import { timeDifference } from "../AdminPanel/EditArticle/EditArticle";
import { Link } from "react-router-dom";
import { splitTitle } from "../HomeMain/HomeMain";

export const getLen = (comObj) => {
  console.log(comObj);
  let comRepLen = 0;
  if (comObj.comments) {
    for (let j = 0; j < Object.keys(comObj.comments).length; j++) {
      if (comObj.comments[Object.keys(comObj.comments)[j]].replies) {
        comRepLen += Object.keys(
          comObj.comments[Object.keys(comObj.comments)[j]].replies
        ).length;
      }
    }
    return comRepLen + Object.keys(comObj.comments).length;
  } else {
    return 0;
  }
};

const Popular = () => {
  const [popularArts, setPopularArts] = useState(null);
  useEffect(() => {
    const dbRef = db.ref(`dates/2022/3/8`);
    dbRef.once("value", async (snap) => {
      let currArts = [];
      const firstData = snap.val();
      console.log(firstData);
      if (Object.keys(firstData).length) {
        currArts = getDateData(firstData);
        await currArts.then((data) => (currArts = [...data]));
        currArts.sort((a, b) => {
          if (a.len - b.len > 0) {
            return -1;
          } else if (a.len - b.len < 0) {
            return 1;
          } else {
            return 0;
          }
        });
        currArts.splice(2); //if it's curr morning and we do not have enough arts to work with so we imitate it by splicing what we have and getting arts from the prev day
        if (currArts.length >= 5) {
          currArts.splice(5);
          setPopularArts([...currArts]);
        } else {
          const dbRef2 = db.ref(`dates/2022/3/7`);
          dbRef2.once("value", async (snap) => {
            const data2 = snap.val();
            console.log(data2);
            let currArts2 = getDateData(data2);
            await currArts2.then((data) => (currArts2 = [...data]));
            currArts2.sort((a, b) => {
              if (a.len - b.len > 0) {
                return -1;
              } else if (a.len - b.len < 0) {
                return 1;
              } else {
                return 0;
              }
            });
            currArts2.splice(5 - currArts.length);
            currArts2 = currArts2.concat(currArts);
            currArts2.sort((a, b) => {
              if (a.len - b.len > 0) {
                return -1;
              } else if (a.len - b.len < 0) {
                return 1;
              } else {
                return 0;
              }
            });
            setPopularArts([...currArts2]);
          });
        }
      }
    });
  }, []);

  const getDateData = (initData) => {
    return new Promise((resolve) => {
      const currArts = [];
      const promises = [];
      for (let i = 0; i < Object.keys(initData).length; i++) {
        promises.push(
          fetch(
            `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/articles/${
              Object.values(initData)[i].path
            }/${Object.values(initData)[i].id}.json`
          ).then((res) => res.json())
        );
      }
      const promisedData = Promise.all(promises);
      promisedData.then((data) => {
        console.log(data);
        for (let i = 0; i < data.length; i++) {
          if (data[i].comments) {
            let comRepLen = getLen(data[i]);
            if (comRepLen) {
              if (
                comRepLen +
                  Object.keys(data[i].comments).length +
                  (data[i].shares.constructor === Object
                    ? Object.keys(data[i].shares).length
                    : 0) >=
                10
              ) {
                data[i].len =
                  comRepLen +
                  Object.keys(data[i].comments).length +
                  (data[i].shares.constructor === Object
                    ? Object.keys(data[i].shares).length
                    : 0);
                currArts.push(data[i]);
              }
            } else if (
              Object.keys(data[i].comments).length +
                (data[i].shares.constructor === Object
                  ? Object.keys(data[i].shares).length
                  : 0) >=
              10
            ) {
              data[i].len =
                Object.keys(data[i].comments).length +
                (data[i].shares.constructor === Object
                  ? Object.keys(data[i].shares).length
                  : 0);
              currArts.push(data[i]);
            }
          } else if (
            data[i].shares.constructor === Object &&
            Object.keys(data[i].shares).length >= 10
          ) {
            data[i].len = Object.keys(data[i].shares).length;
            currArts.push(data[i]);
          }
        }
        console.log(currArts);
        return resolve(currArts);
      });
    });
  };

  return (
    <div id={s.popularCnt}>
      <div id={s.popularHeader}>
        <h3>Popularno</h3>
        <span>
          <svg
            class="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            ></path>
          </svg>
        </span>
      </div>
      <div id={s.popularBody}>
        {popularArts &&
          popularArts.map((popArt) => (
            <div className={s.popularItem} key={uuid()}>
              <div className={s.popularItemHeader}>
                <h3
                  style={{
                    color: `${clrs[popArt.category.toLowerCase()]}`,
                  }}
                >
                  {popArt.subTitle}
                </h3>
              </div>
              <div className={s.popularItemBody}>
                <p>
                  <Link
                    to={{
                      pathname: encodeURI(
                        `/${popArt.category}/${popArt.subCategory}/${splitTitle(
                          popArt.title
                        )}/${popArt.id}`
                      ),
                      state: {
                        articleData: {
                          ...popArt,
                          linkPath: `/${popArt.category}/${
                            popArt.subCategory
                          }/${splitTitle(popArt.title)}/${popArt.id}`,
                        },
                      },
                    }}
                  >
                    {popArt.title}
                  </Link>
                </p>
              </div>
              <div className={s.popularItemFooter}>
                <span className={s.itemTime}>
                  {timeDifference(popArt.date)}
                </span>
                <span className={s.spanComShare}>
                  <span className={s.spanComment}>
                    <svg
                      class="inline h-3 w-3"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"></path>
                      <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"></path>
                    </svg>
                    {getLen(popArt)}
                  </span>
                  <span className={s.spanShare}>
                    <svg
                      class="ml-1 inline h-3 w-3"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"></path>
                    </svg>{" "}
                    {popArt.shares.constructor === Object
                      ? Object.keys(popArt.shares).length
                      : 0}
                  </span>
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Popular;
