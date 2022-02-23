import React, { useEffect, useState } from "react";
import s from "./HomeMain.module.css";
import { timeDifference } from "../AdminPanel/EditArticle/EditArticle";
import { articleColors } from "../AdminPanel/EditArticle/EditArticle";
import { v1 as uuid } from "uuid";
import { auth, db } from "../../firebase";
import { Link } from "react-router-dom";
import { getComLength } from "../comment/Comment";

export const splitTitle = (title) => {
  const titleSplit = title.split(" ");
  let titleSplit2 = [];
  let titleSplit3;
  console.log(titleSplit);
  titleSplit.forEach((split) => {
    titleSplit2.push(split.toLowerCase());
  });
  titleSplit3 = titleSplit2.join("-");
  titleSplit3 = titleSplit3.split(",").join("").split(" ").join("-");
  console.log(titleSplit2);
  return titleSplit3;
};

const HomeMain = () => {
  const [articlesMain, setArticlesMain] = useState([]);

  useEffect(() => {
    const dbRef = db.ref("viewContent/Glavni sadržaj/Početna");
    dbRef.get().then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log(data);
        const articlePaths = [];
        for (let key in data) {
          data[key].forEach((item) => {
            articlePaths.push(`${item[1]}/-${item[0]}`);
          });
        }
        console.log(articlePaths);
        const placeHolderArray = [];
        const promises = [];
        for (let i = 0; i < articlePaths.length; i++) {
          promises.push(
            fetch(
              `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/articles/${articlePaths[i]}.json`
            ).then((res) => res.json())
          );
        }
        const promisedData = Promise.all(promises);
        promisedData.then((data) => {
          console.log(data);
          for (let i = 0; i < data.length; i++) {
            placeHolderArray.push(JSON.parse(JSON.stringify(data[i])));
            for (let key in articleColors) {
              if (
                key === data[i].category.toLowerCase() &&
                placeHolderArray[i]
              ) {
                placeHolderArray[i].subTitleClr = articleColors[key];
                const titleSplit = splitTitle(data[i].title);
                placeHolderArray[
                  i
                ].linkPath = `/${data[i].category}/${data[i].subCategory}/${titleSplit}/${data[i].id}`;
              }
            }
            if (placeHolderArray[i]) {
              placeHolderArray[i].timeDiff = timeDifference(data[i].date);
              if (
                placeHolderArray[i].comments &&
                placeHolderArray[i].comments.constructor === Object
              ) {
                const comArr = [];
                let replies = [];
                for (let key in placeHolderArray[i].comments) {
                  if (placeHolderArray[i].comments[key].replies) {
                    for (let keyRep in placeHolderArray[i].comments[key]
                      .replies) {
                      replies.push(
                        placeHolderArray[i].comments[key].replies[keyRep]
                      );
                    }
                    comArr.push(placeHolderArray[i].comments[key]);
                    comArr[comArr.length - 1].replies = [...replies];
                    replies = [];
                  } else {
                    comArr.push(placeHolderArray[i].comments[key]);
                  }
                }
                placeHolderArray[i].comments = [...comArr];
                console.log(comArr);
              }
            }
            console.log(placeHolderArray[i]);
            if (i === articlePaths.length - 1) {
              console.log(placeHolderArray);
              setArticlesMain([...placeHolderArray]);
            }
          }
        });
        // fetch(
        //   `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/articles/${articlePaths[i]}.json`
        // )
        //   .then((response) => response.json())
        //   .then((data) => {
        //     console.log(data);
        //     placeHolderArray.push(JSON.parse(JSON.stringify(data)));
        //     const objEntries = Object.entries(articleColors);
        //     // for (let j = 0; j < objEntries.length; j++) {
        //     //   if (
        //     //     objEntries[j][0] === data.category.toLowerCase() &&
        //     //     placeHolderArray[i]
        //     //   ) {
        //     //     placeHolderArray[i].subTitleClr = objEntries[j][1];
        //     //     const titleSplit = data.title.split(" ");
        //     //     let titleSplit2 = [];
        //     //     let titleSplit3;
        //     //     console.log(titleSplit);
        //     //     for (let k = 0; k < titleSplit.length; k++) {
        //     //       titleSplit2.push(titleSplit[k].toLowerCase);
        //     //     }
        //     //     titleSplit3 = titleSplit2.join("-");
        //     //     titleSplit3 = titleSplit3
        //     //       .split(",")
        //     //       .join("")
        //     //       .split(" ")
        //     //       .join("-");
        //     //     console.log(titleSplit2);
        //     //     placeHolderArray[
        //     //       i
        //     //     ].linkPath = `/${data.category}/${data.subCategory}/${titleSplit3}/${data.id}`;
        //     //   }
        //     // }
        //     // for (let key in articleColors) {
        //     //   if (
        //     //     key === data.category.toLowerCase() &&
        //     //     placeHolderArray[i]
        //     //   ) {
        //     //     placeHolderArray[i].subTitleClr = articleColors[key];
        //     //     const titleSplit = data.title.split(" ");
        //     //     let titleSplit2 = [];
        //     //     let titleSplit3;
        //     //     console.log(titleSplit);
        //     //     titleSplit.forEach((split) => {
        //     //       titleSplit2.push(split.toLowerCase());
        //     //     });
        //     //     titleSplit3 = titleSplit2.join("-");
        //     //     titleSplit3 = titleSplit3
        //     //       .split(",")
        //     //       .join("")
        //     //       .split(" ")
        //     //       .join("-");
        //     //     console.log(titleSplit2);
        //     //     placeHolderArray[
        //     //       i
        //     //     ].linkPath = `/${data.category}/${data.subCategory}/${titleSplit3}/${data.id}`;
        //     //   }
        //     // }
        //     // if (placeHolderArray[i]) {
        //     //   placeHolderArray[i].timeDiff = timeDifference(data.date);
        //     //   // if (
        //     //   //   placeHolderArray[i].comments.length === 1 &&
        //     //   //   placeHolderArray[i].comments[0] === ''
        //     //   // ) {
        //     //   //   placeHolderArray[i].comments[0] = 'dasdsa';
        //     //   // }
        //     // }
        //     console.log(placeHolderArray[i]);
        //     if (
        //       i === articlePaths.length - 1 &&
        //       placeHolderArray.length === articlePaths.length
        //     ) {
        //       console.log(placeHolderArray);
        //       setArticlesMain([...placeHolderArray]);
        //     }
        //   });
        // }
      }
    });
  }, []);

  useEffect(() => {
    console.log(articlesMain);
  }, [articlesMain]);

  return (
    <div id={s.homeMain}>
      <div id={s.main}>
        {articlesMain.length > 1 &&
          articlesMain.map((article, i) => {
            if (i !== 1) {
              return (
                <div className={s.mainBox} key={uuid()}>
                  <div className={s.mainBoxImg}>
                    <Link
                      to={{
                        pathname: article.linkPath,
                        state: { articleData: article },
                      }}
                    >
                      <img src={article.images[0]} alt="" />
                      {article.images.length > 1 && (
                        <i class="far fa-images"></i>
                      )}
                    </Link>
                  </div>
                  <div className={s.mainBoxHeader}>
                    <h3 style={{ color: article.subTitleClr }}>
                      {article.subTitle}
                    </h3>
                    <h3>
                      <Link
                        to={{
                          pathname: article.linkPath,
                          state: { articleData: article },
                        }}
                      >
                        {article.title}
                      </Link>
                    </h3>
                  </div>
                  <div className={s.mainBoxFooter}>
                    <span>{article.timeDiff}</span>
                    <div className={s.mainBoxFooterBundle}>
                      <span>
                        <i class="fas fa-comments"></i>
                        {article.comments ? getComLength(article.comments) : 0}
                      </span>
                      <span>
                        <i class="fas fa-share-alt"></i>{" "}
                        {article.shares.length === 1 && article.shares[0] === ""
                          ? 0
                          : article.shares.length}
                      </span>
                    </div>
                  </div>
                </div>
              );
            } else {
              return (
                <div className={s.mainBoxBig} key={uuid()}>
                  <div className={s.mainBoxImg}>
                    <Link
                      to={{
                        pathname: article.linkPath,
                        state: { articleData: article },
                      }}
                    >
                      <img src={article.images[0]} alt="" />
                      {article.images.length > 1 && (
                        <i class="far fa-images"></i>
                      )}
                    </Link>
                  </div>
                  <div className={s.mainBoxHeader}>
                    <h3>{article.subTitle}</h3>
                    <h3>
                      <Link
                        to={{
                          pathname: article.linkPath,
                          state: { articleData: article },
                        }}
                      >
                        {article.title}
                      </Link>
                    </h3>
                  </div>
                  <div className={s.mainBoxFooter}>
                    <span>{article.timeDiff}</span>
                    <div className={s.mainBoxFooterBundle}>
                      <span>
                        <i class="fas fa-comments"></i>
                        {article.comments ? getComLength(article.comments) : 0}
                      </span>
                      <span>
                        <i class="fas fa-share-alt"></i>{" "}
                        {article.shares.length === 1 && article.shares[0] === ""
                          ? 0
                          : article.shares.length}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }
          })}
        {/* <div className={s.mainBox}>
          <div className={s.mainBoxImg}>
            <img
              src={require('../../assets/img/powerplant.jpg').default}
              alt=""
            />
          </div>
          <div className={s.mainBoxHeader}>
            <h3>Blah blah ssas</h3>
            <h3>Ramiz Salkić u Trebinju pozvao na ukidanje Republike Srpske</h3>
          </div>
          <div className={s.mainBoxFooter}>
            <span>35 min</span>
            <div className={s.mainBoxFooterBundle}>
              <span>
                <i class="fas fa-comments"></i>
                29
              </span>
              <span>
                <i class="fas fa-share-alt"></i>0
              </span>
            </div>
          </div>
        </div>
        <div className={s.mainBoxBig}>
          <div className={s.mainBoxImg}>
            <img
              src={require('../../assets/img/powerplant.jpg').default}
              alt=""
            />
          </div>
          <div className={s.mainBoxHeader}>
            <h3>Blah asd</h3>
            <h3>Blahb sad dsa aaddsx</h3>
          </div>
          <div className={s.mainBoxFooter}>
            <span>35 min</span>
            <div className={s.mainBoxFooterBundle}>
              <span>
                <i class="fas fa-comments"></i>
                29
              </span>
              <span>
                <i class="fas fa-share-alt"></i>0
              </span>
            </div>
          </div>
        </div>
        <div className={s.mainBox}>
          <div className={s.mainBoxImg}>
            <img
              src={require('../../assets/img/powerplant.jpg').default}
              alt=""
            />
          </div>
          <div className={s.mainBoxHeader}>
            <h3>Blahblah</h3>
            <h3>Blahblah</h3>
          </div>
          <div className={s.mainBoxFooter}>
            <span>35 min</span>
            <div className={s.mainBoxFooterBundle}>
              <span>
                <i class="fas fa-comments"></i>
                29
              </span>
              <span>
                <i class="fas fa-share-alt"></i>0
              </span>
            </div>
          </div>
        </div>
        <div className={s.mainBox}>
          <div className={s.mainBoxImg}>
            <img
              src={require('../../assets/img/powerplant.jpg').default}
              alt=""
            />
          </div>
          <div className={s.mainBoxHeader}>
            <h3>Blahblah</h3>
            <h3>Blahblah</h3>
          </div>
          <div className={s.mainBoxFooter}>
            <span>35 min</span>
            <div className={s.mainBoxFooterBundle}>
              <span>
                <i class="fas fa-comments"></i>
                29
              </span>
              <span>
                <i class="fas fa-share-alt"></i>0
              </span>
            </div>
          </div>
        </div>
        <div className={s.mainBox}>
          <div className={s.mainBoxImg}>
            <img
              src={require('../../assets/img/powerplant.jpg').default}
              alt=""
            />
          </div>
          <div className={s.mainBoxHeader}>
            <h3>Blahblah</h3>
            <h3>Blahblah</h3>
          </div>
          <div className={s.mainBoxFooter}>
            <span>35 min</span>
            <div className={s.mainBoxFooterBundle}>
              <span>
                <i class="fas fa-comments"></i>
                29
              </span>
              <span>
                <i class="fas fa-share-alt"></i>0
              </span>
            </div>
          </div>
        </div>
        <div className={s.mainBox}>
          <div className={s.mainBoxImg}>
            <img
              src={require('../../assets/img/powerplant.jpg').default}
              alt=""
            />
          </div>
          <div className={s.mainBoxHeader}>
            <h3>Blahblah</h3>
            <h3>Blahblah</h3>
          </div>
          <div className={s.mainBoxFooter}>
            <span>35 min</span>
            <div className={s.mainBoxFooterBundle}>
              <span>
                <i class="fas fa-comments"></i>
                29
              </span>
              <span>
                <i class="fas fa-share-alt"></i>0
              </span>
            </div>
          </div>
        </div>
        <div className={s.mainBox}>
          <div className={s.mainBoxImg}>
            <img
              src={require('../../assets/img/powerplant.jpg').default}
              alt=""
            />
          </div>
          <div className={s.mainBoxHeader}>
            <h3>Blahblah</h3>
            <h3>Blahblah</h3>
          </div>
          <div className={s.mainBoxFooter}>
            <span>35 min</span>
            <div className={s.mainBoxFooterBundle}>
              <span>
                <i class="fas fa-comments"></i>
                29
              </span>
              <span>
                <i class="fas fa-share-alt"></i>0
              </span>
            </div>
          </div>
        </div> */}
      </div>
      <div id={s.sideBar}>
        <div id={s.sideBarControls}>
          <div className={s.sideBarControlItem}>Najnovije</div>
          <div className={s.sideBarControlItem}>Najčitanije</div>
          <div className={s.sideBarControlItem}>Preporuke</div>
        </div>
        <div id={s.sideBarContent}>
          <div className={s.sideBarItem}>
            <h3>PRVI SLUČAJ</h3>
            <p>Ramiz Salkić u Trebinju pozvao na ukidanje Republike Srpske</p>
            <div className={s.sideBarItemBundle}>
              <span>22 min</span>
              <div className={s.sideBarItemBundleRight}>
                <span>
                  <i class="fas fa-comments"></i>
                  29
                </span>
                <span>
                  <i class="fas fa-share-alt"></i>0
                </span>
              </div>
            </div>
          </div>
        </div>
        <div id={s.sideBarContent}>
          <div className={s.sideBarItem}>
            <h3>PRVI SLUČAJ</h3>
            <p>Ramiz Salkić u Trebinju pozvao na ukidanje Republike Srpske</p>
            <div className={s.sideBarItemBundle}>
              <span>22 min</span>
              <div className={s.sideBarItemBundleRight}>
                <span>
                  <i class="fas fa-comments"></i>
                  29
                </span>
                <span>
                  <i class="fas fa-share-alt"></i>0
                </span>
              </div>
            </div>
          </div>
        </div>
        <div id={s.sideBarContent}>
          <div className={s.sideBarItem}>
            <h3>PRVI SLUČAJ</h3>
            <p>Ramiz Salkić u Trebinju pozvao na ukidanje Republike Srpske</p>
            <div className={s.sideBarItemBundle}>
              <span>22 min</span>
              <div className={s.sideBarItemBundleRight}>
                <span>
                  <i class="fas fa-comments"></i>
                  29
                </span>
                <span>
                  <i class="fas fa-share-alt"></i>0
                </span>
              </div>
            </div>
          </div>
        </div>
        <div id={s.sideBarContent}>
          <div className={s.sideBarItem}>
            <h3>PRVI SLUČAJ</h3>
            <p>Ramiz Salkić u Trebinju pozvao na ukidanje Republike Srpske</p>
            <div className={s.sideBarItemBundle}>
              <span>22 min</span>
              <div className={s.sideBarItemBundleRight}>
                <span>
                  <i class="fas fa-comments"></i>
                  29
                </span>
                <span>
                  <i class="fas fa-share-alt"></i>0
                </span>
              </div>
            </div>
          </div>
        </div>
        <div id={s.sideBarContent}>
          <div className={s.sideBarItem}>
            <h3>PRVI SLUČAJ</h3>
            <p>Ramiz Salkić u Trebinju pozvao na ukidanje Republike Srpske</p>
            <div className={s.sideBarItemBundle}>
              <span>22 min</span>
              <div className={s.sideBarItemBundleRight}>
                <span>
                  <i class="fas fa-comments"></i>
                  29
                </span>
                <span>
                  <i class="fas fa-share-alt"></i>0
                </span>
              </div>
            </div>
          </div>
        </div>
        <div id={s.sideBarContent}>
          <div className={s.sideBarItem}>
            <h3>PRVI SLUČAJ</h3>
            <p>Ramiz Salkić u Trebinju pozvao na ukidanje Republike Srpske</p>
            <div className={s.sideBarItemBundle}>
              <span>22 min</span>
              <div className={s.sideBarItemBundleRight}>
                <span>
                  <i class="fas fa-comments"></i>
                  29
                </span>
                <span>
                  <i class="fas fa-share-alt"></i>0
                </span>
              </div>
            </div>
          </div>
        </div>
        <div id={s.sideBarContent}>
          <div className={s.sideBarItem}>
            <h3>PRVI SLUČAJ</h3>
            <p>Ramiz Salkić u Trebinju pozvao na ukidanje Republike Srpske</p>
            <div className={s.sideBarItemBundle}>
              <span>22 min</span>
              <div className={s.sideBarItemBundleRight}>
                <span>
                  <i class="fas fa-comments"></i>
                  29
                </span>
                <span>
                  <i class="fas fa-share-alt"></i>0
                </span>
              </div>
            </div>
          </div>
        </div>
        <div id={s.sideBarContent}>
          <div className={s.sideBarItem}>
            <h3>PRVI SLUČAJ</h3>
            <p>Ramiz Salkić u Trebinju pozvao na ukidanje Republike Srpske</p>
            <div className={s.sideBarItemBundle}>
              <span>22 min</span>
              <div className={s.sideBarItemBundleRight}>
                <span>
                  <i class="fas fa-comments"></i>
                  29
                </span>
                <span>
                  <i class="fas fa-share-alt"></i>0
                </span>
              </div>
            </div>
          </div>
        </div>
        <div id={s.sideBarContent}>
          <div className={s.sideBarItem}>
            <h3>PRVI SLUČAJ</h3>
            <p>Ramiz Salkić u Trebinju pozvao na ukidanje Republike Srpske</p>
            <div className={s.sideBarItemBundle}>
              <span>22 min</span>
              <div className={s.sideBarItemBundleRight}>
                <span>
                  <i class="fas fa-comments"></i>
                  29
                </span>
                <span>
                  <i class="fas fa-share-alt"></i>0
                </span>
              </div>
            </div>
          </div>
        </div>
        <div id={s.sideBarContent}>
          <div className={s.sideBarItem}>
            <h3>PRVI SLUČAJ</h3>
            <p>Ramiz Salkić u Trebinju pozvao na ukidanje Republike Srpske</p>
            <div className={s.sideBarItemBundle}>
              <span>22 min</span>
              <div className={s.sideBarItemBundleRight}>
                <span>
                  <i class="fas fa-comments"></i>
                  29
                </span>
                <span>
                  <i class="fas fa-share-alt"></i>0
                </span>
              </div>
            </div>
          </div>
        </div>
        <div id={s.sideBarContent}>
          <div className={s.sideBarItem}>
            <h3>PRVI SLUČAJ</h3>
            <p>Ramiz Salkić u Trebinju pozvao na ukidanje Republike Srpske</p>
            <div className={s.sideBarItemBundle}>
              <span>22 min</span>
              <div className={s.sideBarItemBundleRight}>
                <span>
                  <i class="fas fa-comments"></i>
                  29
                </span>
                <span>
                  <i class="fas fa-share-alt"></i>0
                </span>
              </div>
            </div>
          </div>
        </div>
        <div id={s.sideBarContent}>
          <div className={s.sideBarItem}>
            <h3>PRVI SLUČAJ</h3>
            <p>Ramiz Salkić u Trebinju pozvao na ukidanje Republike Srpske</p>
            <div className={s.sideBarItemBundle}>
              <span>22 min</span>
              <div className={s.sideBarItemBundleRight}>
                <span>
                  <i class="fas fa-comments"></i>
                  29
                </span>
                <span>
                  <i class="fas fa-share-alt"></i>0
                </span>
              </div>
            </div>
          </div>
        </div>
        <div id={s.sideBarContent}>
          <div className={s.sideBarItem}>
            <h3>PRVI SLUČAJ</h3>
            <p>Ramiz Salkić u Trebinju pozvao na ukidanje Republike Srpske</p>
            <div className={s.sideBarItemBundle}>
              <span>22 min</span>
              <div className={s.sideBarItemBundleRight}>
                <span>
                  <i class="fas fa-comments"></i>
                  29
                </span>
                <span>
                  <i class="fas fa-share-alt"></i>0
                </span>
              </div>
            </div>
          </div>
        </div>
        <div id={s.sideBarContent}>
          <div className={s.sideBarItem}>
            <h3>PRVI SLUČAJ</h3>
            <p>Ramiz Salkić u Trebinju pozvao na ukidanje Republike Srpske</p>
            <div className={s.sideBarItemBundle}>
              <span>22 min</span>
              <div className={s.sideBarItemBundleRight}>
                <span>
                  <i class="fas fa-comments"></i>
                  29
                </span>
                <span>
                  <i class="fas fa-share-alt"></i>0
                </span>
              </div>
            </div>
          </div>
        </div>
        <div id={s.sideBarContent}>
          <div className={s.sideBarItem}>
            <h3>PRVI SLUČAJ</h3>
            <p>Ramiz Salkić u Trebinju pozvao na ukidanje Republike Srpske</p>
            <div className={s.sideBarItemBundle}>
              <span>22 min</span>
              <div className={s.sideBarItemBundleRight}>
                <span>
                  <i class="fas fa-comments"></i>
                  29
                </span>
                <span>
                  <i class="fas fa-share-alt"></i>0
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeMain;
