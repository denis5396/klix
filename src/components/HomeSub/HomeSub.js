import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react/cjs/react.development";
import { db } from "../../firebase";
import { subcategories } from "../AdminPanel/AddArticle";
import {
  articleColors,
  timeDifference,
} from "../AdminPanel/EditArticle/EditArticle";
import { clrs } from "../ArticleLink/ArticleLink";
import { getComLengthIfObject } from "../comment/Comment";
import { splitTitle } from "../HomeMain/HomeMain";
import { v1 as uuid } from "uuid";
import s from "./HomeSub.module.css";

const HomeSub = ({ route }) => {
  const [articles, setArticles] = useState([]);
  const [promos, setPromos] = useState([]);
  useEffect(() => {
    alert(clrs[route.toLowerCase()]);
    if (route === "Početna") {
      const dbRefPromo = db.ref("articles/Promo");
      dbRefPromo.once("value", (snap) => {
        console.log(snap.val());
        const data = snap.val();
        let build = [];
        for (let key in data) {
          build = build.concat(Object.values(data[key]).reverse().slice(0, 20));
        }
        build.sort((a, b) => {
          if (new Date(a.date) - new Date(b.date) > 0) {
            return -1;
          } else if (new Date(a.date) - new Date(b.date) < 0) {
            return 1;
          } else {
            return 0;
          }
        });
        build.splice(20);
        setPromos(build);
        console.log(build);
      });
    }
    fetch(
      `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/viewContent/Sporedni sadržaj/${route}.json`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        let newArr = [];
        let newObj = {};
        for (let key in data) {
          newObj[key] = Object.values(data[key])[0];
        }
        newArr.push({ ...newObj });
        console.log(newArr);
        const promises = [];
        for (let key in newArr[0]) {
          newArr[0][key].forEach((item) => {
            promises.push(
              fetch(
                `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/articles/${item[1]}/-${item[0]}.json`
              ).then((res) => res.json())
            );
          });
        }
        const promised = Promise.all(promises);
        promised.then((data) => {
          console.log(data);
          const final = [];
          const fin2 = [];
          let num = 0;
          for (let key in newArr[0]) {
            final.push({
              category: key,
              data: data.slice(num, num + newArr[0][key].length),
            });
            num = num + newArr[0][key].length;
          }
          subcategories[route.toLowerCase()].forEach((sub) => {
            final.forEach((sub2) => {
              if (sub2.category === sub) {
                fin2.push(sub2);
              }
            });
          });
          console.log(fin2);
          setArticles(fin2);
        });
      });
  }, []);

  useEffect(() => {
    console.log(articles);
  }, [articles]);

  return (
    <>
      {articles.length
        ? articles.map((art) => (
            <div id={s.sub} key={uuid()}>
              <div id={s.subBodyHeader}>
                <span
                  style={{
                    backgroundColor: `${
                      clrs[
                        route !== "Početna"
                          ? route.toLowerCase()
                          : art.category.toLowerCase()
                      ]
                    }`,
                  }}
                ></span>
                <h3>{art.category}</h3>
              </div>
              <div
                id={s.subBody}
                style={
                  art.data.length === 4 ? { gridTemplateColumns: "1fr" } : null
                }
              >
                <div id={s.subBodyLeft}>
                  {art.data.map((artItem, i) => {
                    if (i < 4) {
                      return (
                        <div className={s.subBodyItem} key={uuid()}>
                          <div
                            className={`${s.itemImg} ${
                              art.data.length === 4 ? s.itemImgFour : null
                            }`}
                          >
                            <Link
                              to={{
                                pathname: encodeURI(
                                  `/${artItem.category}/${
                                    artItem.subCategory
                                  }/${splitTitle(artItem.title)}/${artItem.id}`
                                ),
                                state: { articleData: artItem },
                              }}
                            >
                              <img src={artItem.imageText[0][0]} />
                              {artItem.images.length > 1 && (
                                <i class="far fa-images"></i>
                              )}
                            </Link>
                          </div>
                          <div className={s.itemText}>
                            <h3
                              style={{
                                color:
                                  articleColors[
                                    route !== "Početna"
                                      ? route.toLowerCase()
                                      : art.category.toLowerCase()
                                  ],
                              }}
                            >
                              {artItem.subTitle}
                            </h3>
                            <h3>
                              <Link
                                to={{
                                  pathname: encodeURI(
                                    `/${artItem.category}/${
                                      artItem.subCategory
                                    }/${splitTitle(artItem.title)}/${
                                      artItem.id
                                    }`
                                  ),
                                  state: { articleData: artItem },
                                }}
                              >
                                {artItem.title}
                              </Link>
                            </h3>
                          </div>
                          <div className={s.itemBundle}>
                            <span>{timeDifference(artItem.date)}</span>
                            <div className={s.itemBundleR}>
                              <span>
                                <i class="fas fa-comments"></i>
                                {artItem.comments
                                  ? getComLengthIfObject(artItem.comments)
                                  : 0}
                              </span>
                              <span>
                                <i class="fas fa-share-alt"></i>
                                {artItem.shares.constructor === Object
                                  ? Object.keys(artItem.shares).length
                                  : 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
                {art.data.length > 4 ? (
                  <div className={s.subBodyItemsBundle}>
                    {art.data.map((artItem, i) => {
                      if (i >= 4) {
                        return (
                          <div className={s.subBodyBundleItem} key={uuid()}>
                            <div className={s.itemText}>
                              <h3
                                style={{
                                  color:
                                    articleColors[art.category.toLowerCase()],
                                }}
                              >
                                {artItem.subTitle}
                              </h3>
                              <h3>
                                <Link
                                  to={{
                                    pathname: encodeURI(
                                      `/${artItem.category}/${
                                        artItem.subCategory
                                      }/${splitTitle(artItem.title)}/${
                                        artItem.id
                                      }`
                                    ),
                                    state: { articleData: artItem },
                                  }}
                                >
                                  {artItem.title}
                                </Link>
                              </h3>
                            </div>
                            <div className={s.itemBundle}>
                              <span>{timeDifference(artItem.date)}</span>
                              <div className={s.itemBundleRight}>
                                <span>
                                  <i class="fas fa-comments"></i>
                                  {artItem.comments
                                    ? getComLengthIfObject(artItem.comments)
                                    : 0}
                                </span>
                                <span>
                                  <i class="fas fa-share-alt"></i>
                                  {artItem.shares.constructor === Object
                                    ? Object.keys(artItem.shares).length
                                    : 0}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    })}
                  </div>
                ) : null}
              </div>
            </div>
          ))
        : null}
      {promos.length ? (
        <div id={s.promoCnt}>
          <div id={s.promoHeader}>
            <span></span>
            <h3>Promo</h3>
          </div>
          <div id={s.promoBody}>
            {promos.map((promo, i) => {
              return (
                <div className={s.subBodyItem} key={uuid()}>
                  {i < 4 ? (
                    <div className={`${s.itemImg} ${s.itemImgFour}`}>
                      <Link
                        to={{
                          pathname: encodeURI(
                            `/${promo.category}/${
                              promo.subCategory
                            }/${splitTitle(promo.title)}/${promo.id}`
                          ),
                          state: { articleData: promo },
                        }}
                      >
                        <img src={promo.imageText[0][0]} />
                        {promo.images.length > 1 && (
                          <i class="far fa-images"></i>
                        )}
                      </Link>
                    </div>
                  ) : null}
                  <div className={s.itemText}>
                    <h3
                      style={{
                        color: articleColors[promo.category.toLowerCase()],
                      }}
                    >
                      {promo.subTitle}
                    </h3>
                    <h3>
                      <Link
                        to={{
                          pathname: encodeURI(
                            `/${promo.category}/${
                              promo.subCategory
                            }/${splitTitle(promo.title)}/${promo.id}`
                          ),
                          state: { articleData: promo },
                        }}
                      >
                        {promo.title}
                      </Link>
                    </h3>
                  </div>
                  <div className={s.itemBundle}>
                    <span>{timeDifference(promo.date)}</span>
                    <div className={s.itemBundleR}>
                      <span>
                        <i class="fas fa-comments"></i>
                        {promo.comments
                          ? getComLengthIfObject(promo.comments)
                          : 0}
                      </span>
                      <span>
                        <i class="fas fa-share-alt"></i>
                        {promo.shares.constructor === Object
                          ? Object.keys(promo.shares).length
                          : 0}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default HomeSub;
