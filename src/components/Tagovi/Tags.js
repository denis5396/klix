import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { db } from "../../firebase";
import { v1 as uuid } from "uuid";
import TagArticle from "./TagArticle";
import s from "./Tags.module.css";
import { useLocation } from "react-router-dom";
import { articleColors } from "../AdminPanel/EditArticle/EditArticle";

const Tags = () => {
  const history = useHistory();
  const location = useLocation();
  const [articles, setArticles] = useState({});
  const [term, setTerm] = useState([]);
  const [changeRoute, setChangeRoute] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const [noMatch, setNoMatch] = useState(false);
  const init = useRef(undefined);
  const idToStartFrom = useRef(undefined);
  const indexToStartFrom = useRef(undefined);
  useEffect(() => {
    window.scrollTo(0, 0);
    const term = history.location.pathname.split("/");
    console.log(history.location.pathname.split("/")[1]);
    console.log(history.location.search);
    console.log(term);
    if (!term[1].includes("pretraga")) {
      if (term[1] === "Magazin" && term[2] === "Film-TV") {
        setTerm([term[term.length - 2], "Film/TV"]);
      } else {
        setTerm([term[term.length - 2], term[term.length - 1]]);
      }
    } else {
      setTerm(["pretraga", history.location.search.split("?q=")[1].trim()]);
    }
  }, []);

  useEffect(() => {
    if (term.length && !init.current) {
      init.current = "defined";
      getData();
    }
  }, [term]);

  const getDataFromPath = (data) => {
    return new Promise((resolve) => {
      const promises = [];
      data.forEach((item) => {
        promises.push(
          fetch(
            `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/articles/${item.articlePath}.json`
          ).then((res) => res.json())
        );
        console.log(
          `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/articles/${item.articlePath}.json`
        );
      });
      const promisedData = Promise.all(promises);
      promisedData.then((data) => {
        resolve(data);
      });
    });
  };

  const getData = () => {
    if (term[0] !== "pretraga") {
      const dbRef = db.ref(
        `${
          history.location.pathname.split("/")[1] !== "tagovi"
            ? "articles"
            : "related"
        }/${term[0]}/${term[1]}`
      );
      console.log(
        `${
          history.location.pathname.split("/")[1] !== "tagovi"
            ? "articles"
            : "related"
        }/${term[0]}/${term[1]}`
      );
      if (idToStartFrom.current && !articles[articles.current + 1]) {
        dbRef
          .orderByKey()
          .endBefore(`${idToStartFrom.current}`)
          .limitToLast(2)
          .once("value", (snap) => {
            if (snap.val()) {
              console.log(snap.val());
              const data = Object.values(snap.val());
              if (history.location.pathname.split("/")[1] !== "tagovi") {
                setArticles((old) => {
                  let cpy = { ...old };
                  cpy.current = cpy.current + 1;
                  cpy[cpy.current] = data;
                  console.log(cpy);
                  return cpy;
                });
                idToStartFrom.current = Object.keys(snap.val())[0];
              } else {
                getDataFromPath(data).then((data) => {
                  setArticles((old) => {
                    let cpy = { ...old };
                    cpy.current = cpy.current + 1;
                    cpy[cpy.current] = data;
                    console.log(cpy);
                    return cpy;
                  });
                  idToStartFrom.current = Object.keys(snap.val())[0];
                });
              }
            } else {
              setArticles((old) => {
                let cpy = { ...old };
                cpy.current = null;
                return cpy;
              });
            }
          });
      } else if (idToStartFrom.current) {
        setArticles((old) => ({ ...old, current: old.current + 1 }));
      } else if (!idToStartFrom.current) {
        dbRef
          .orderByKey()
          .limitToLast(2)
          .once("value", (snap) => {
            if (snap.val()) {
              const data = Object.values(snap.val());
              console.log(data);
              if (history.location.pathname.split("/")[1] !== "tagovi") {
                setArticles({ 0: data, current: 0 });
                idToStartFrom.current = Object.keys(snap.val())[0];
              } else {
                getDataFromPath(data).then((data) => {
                  console.log(data);
                  setArticles({ 0: data, current: 0 });
                  idToStartFrom.current = Object.keys(snap.val())[0];
                });
              }
            }
          });
      }
    } else {
      if (!searchData.length) {
        const promises = [];
        const cats = Object.keys(articleColors).map((item) =>
          item[0].toUpperCase().concat(item.slice(1))
        );
        for (let i = 0; i < cats.length; i++) {
          promises.push(
            fetch(
              `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/articles/${cats[i]}.json`
            ).then((res) => res.json())
          );
        }
        const promisedData = Promise.all(promises);
        promisedData.then((data) => {
          console.log(data);
          const tempData = [];
          data.forEach((item) => {
            for (let key in item) {
              console.log(key);
              for (let key2 in item[key]) {
                // console.log(item[key][key2]);
                const { title } = item[key][key2];
                // console.log(title && title.toLowerCase());
                const { articleText } = item[key][key2];
                if (term[1].includes(" ")) {
                  const loopTerms = term[1].toLowerCase().split(" ");
                  console.log(loopTerms);
                  for (let i = 0; i < loopTerms.length; i++) {
                    if (
                      (title &&
                        containsWord(title.toLowerCase(), loopTerms[i])) ||
                      (articleText &&
                        containsWord(articleText.toLowerCase(), loopTerms[i]))
                    ) {
                      console.log(title);
                      tempData.push(item[key][key2]);
                    }
                  }
                } else {
                  if (
                    (title &&
                      containsWord(
                        title.toLowerCase(),
                        term[1].toLowerCase()
                      )) ||
                    (articleText &&
                      containsWord(
                        articleText.toLowerCase(),
                        term[1].toLowerCase()
                      ))
                  ) {
                    tempData.push(item[key][key2]);
                  }
                }
              }
            }
          });
          if (tempData.length) {
            tempData.sort((a, b) => {
              if (new Date(a.date) - new Date(b.date) > 0) {
                return -1;
              } else if (new Date(a.date) - new Date(b.date) < 0) {
                return 1;
              } else {
                return 0;
              }
            });
            console.log(tempData);
            setSearchData(tempData);
            setArticles({ 0: tempData.slice(0, 2), current: 0 });
            indexToStartFrom.current = 2;
          } else {
            setArticles({ data: [], current: null });
            setNoMatch(true);
          }
        });
      } else {
        if (
          !searchData.slice(
            indexToStartFrom.current,
            indexToStartFrom.current + 2
          )[0] &&
          !searchData.slice(
            indexToStartFrom.current,
            indexToStartFrom.current + 2
          )[1]
        ) {
          console.log(
            searchData.slice(
              indexToStartFrom.current,
              indexToStartFrom.current + 2
            )[0]
          );
          console.log(
            searchData.slice(
              indexToStartFrom.current,
              indexToStartFrom.current + 2
            )[1]
          );
          setArticles((old) => {
            let cpy = { ...old };
            cpy.current = null;
            return cpy;
          });
        } else {
          setArticles((old) => {
            let cpy = { ...old };
            cpy.current = cpy.current + 1;
            cpy[cpy.current] = searchData.slice(
              indexToStartFrom.current,
              indexToStartFrom.current + 2
            );
            indexToStartFrom.current += 2;
            return cpy;
          });
        }
      }
    }
  };

  const handlePrev = () => {
    if (searchData.length) {
      if (articles.current !== null) {
        indexToStartFrom.current -= 2;
      }
    }
    setArticles((old) => ({
      ...old,
      current:
        old.current === null ? Object.keys(old).length - 2 : old.current - 1,
    }));
  };

  useEffect(() => {
    console.log(articles);
  }, [articles]);
  useEffect(() => {
    if (init.current !== undefined) {
      idToStartFrom.current = undefined;
      const term = history.location.pathname.split("/");
      if (!term[1].includes("pretraga")) {
        if (term[1] === "Magazin" && term[2] === "Film-TV") {
          setTerm([term[term.length - 2], "Film/TV"]);
        } else {
          setTerm([term[term.length - 2], term[term.length - 1]]);
        }
      } else {
        setTerm(["pretraga", history.location.search.split("?q=")[1].trim()]);
      }
      setChangeRoute(true);
      setNoMatch(false);
      if (searchData.length) {
        setArticles({});
        setSearchData([]);
      }
    }
  }, [location]);
  useEffect(() => {
    if (changeRoute && init.current !== undefined && !noMatch) {
      window.scrollTo(0, 0);
      getData();
    }
  }, [location, changeRoute, term, noMatch]);

  function containsWord(str, word) {
    return str.match(new RegExp("\\b" + word + "\\b")) != null;
  }

  return (
    <div id={s.tagsCnt}>
      <div id={s.tagsLeft}>
        <div id={s.tagsLeftHeader}>
          <h3>
            <Link to="/">Početna</Link>{" "}
            {history.location.pathname.split("/")[1] !== "tagovi" &&
            term[0] !== "pretraga" ? (
              <>
                <span>{term[0]}</span> <span>{term[1]}</span>
              </>
            ) : (
              <span>{term[1]}</span>
            )}
          </h3>
        </div>
        <div id={s.tagsLeftBody}>
          {Object.keys(articles).length ? (
            articles.current !== null ? (
              articles[articles.current].map((art) => (
                <TagArticle key={uuid()} art={art} />
              ))
            ) : (
              <div id={s.nill}>Nema vijesti.</div>
            )
          ) : null}
        </div>
        {!articles.data ? (
          <div id={s.tagsLeftFooter}>
            {Object.keys(articles).length ? (
              articles.current !== 0 ? (
                <button onClick={handlePrev}>Prethodna</button>
              ) : null
            ) : null}
            {Object.keys(articles).length ? (
              articles.current !== null ? (
                <button onClick={getData}>Sljedeća</button>
              ) : null
            ) : null}
          </div>
        ) : null}
      </div>
      <div id={s.tagsRight}></div>
    </div>
  );
};

export default Tags;
