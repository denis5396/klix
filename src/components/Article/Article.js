import React, { useEffect, useState, useRef, useContext } from "react";
import parse from "html-react-parser";
import Nav from "../Nav/Nav";
import s from "./Article.module.css";
import ArticleLink from "../ArticleLink/ArticleLink";
import LinkedArticles from "./LinkedArticles";
import LinkedPromo from "./LinkedPromo";
import { Link, useLocation } from "react-router-dom";
import ReactDOM from "react-dom";
import { v1 as uuid } from "uuid";
import { clrs } from "../ArticleLink/ArticleLink";
import CommentType from "../comment/CommentType";
import { timeDifference } from "../AdminPanel/EditArticle/EditArticle";
import { getComLength } from "../comment/Comment";
import LoginContext from "../../context";

const catSubCat = {
  Vijesti: [
    "BiH",
    "Regija",
    "Svijet",
    "Dijaspora",
    "Crna hronika",
    "Humanitarne akcije",
  ],
  Biznis: [
    "Privreda",
    "Finansije",
    "Investicije",
    "Smart Cash",
    "Berza",
    "Startupi",
    "Posao",
  ],
  Sport: [
    "Nogomet",
    "Košarka",
    "Tenis",
    "Rukomet",
    "Formula 1",
    "Skijanje",
    "Atletika",
    "Borilački sportovi",
    "Plivanje",
  ],
  Magazin: ["Kultura", "Muzika", "Film/TV", "Showbiz", "Zanimljivosti"],
  Lifestyle: [
    "Moda i ljepota",
    "Zdravlje",
    "Veze i seks",
    "Gastro",
    "Kuća i ured",
    "Putovanja",
    "Bebe",
    "Fitness",
    "Ljubimci",
  ],
  Scitech: ["Nauka", "Tehnologija"],
  Auto: ["Testovi", "Noviteti", "Koncepti", "Tuning"],
};

const ArticleComp = () => {
  const ctx = useContext(LoginContext);
  const location = useLocation();
  const [articleData, setArticleData] = useState(null);
  const [text, setText] = useState([]);
  const [linkData, setLinkData] = useState({});
  const [internalLinks, setInternalLinks] = useState([]);
  const [clickedSlider, setClickedSlider] = useState(false);
  const [zoomedIn, setZoomedIn] = useState(false);
  const [moving, setMoving] = useState(false);
  const [posOfSlider, setPosOfSlider] = useState(null);
  const [grabXPrev, setGrabXPrev] = useState(null);
  const [grabYPrev, setGrabYPrev] = useState(null);
  const [zoomPos, setZoomPos] = useState("");
  const [counter, setCounter] = useState(0);

  const imageSliderRef = useRef();
  const sliderFooterBar = useRef();
  const timer = useRef(null);
  const stickLeftSideBar = useRef();
  const fullComLength = useRef(0);

  const scrollFnSticky = () => {
    // console.log(document.getElementsByTagName("nav")[0].style);
    const navStyles = window.getComputedStyle(
      document.getElementsByTagName("header")[0]
    );
    const navHeight = +navStyles.getPropertyValue("height").split("px")[0];
    // console.log(navHeight);
    if (stickLeftSideBar.current) {
      const sideBarParent = window.getComputedStyle(
        stickLeftSideBar.current.parentElement
      );

      const sideBarParentMagin = +sideBarParent
        .getPropertyValue("margin-top")
        .split("px")[0];
      // console.log(
      //   stickLeftSideBar.current &&
      //     stickLeftSideBar.current.parentElement.getBoundingClientRect().top -
      //       navHeight -
      //       sideBarParentMagin
      // );
      if (
        stickLeftSideBar.current &&
        stickLeftSideBar.current.parentElement.getBoundingClientRect().top -
          navHeight -
          sideBarParentMagin <=
          0
      ) {
        // stickLeftSideBar.current.style.height = "inherit";
        stickLeftSideBar.current.children[0].style.position = "sticky";
        stickLeftSideBar.current.children[0].style.top = `${
          navHeight + sideBarParentMagin
        }px`;
      }
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    window.addEventListener("scroll", scrollFnSticky);
    return () => {
      window.removeEventListener("scroll", scrollFnSticky);
    };
  }, []);
  useEffect(() => {
    console.log(location.state);
    console.log(location.pathname);
    setArticleData({ ...location.state.articleData });
    let replyLength = 0;

    for (let i = 0; i < location.state.articleData.comments.length; i++) {
      if (location.state.articleData.comments[i].replies) {
        replyLength += location.state.articleData.comments[i].replies.length;
      }
    }
    fullComLength.current =
      replyLength + location.state.articleData.comments.length;
    const txt = location.state.articleData.articleText;
    const paragraphs = [];
    let temp = "";
    const finalParagraphs = [];
    let pos = 0;
    for (let i = 0; i < txt.length; i++) {
      if (txt[i] === "\n" && txt[i + 1] === "\n") {
        paragraphs.push({ text: txt.slice(pos, i) });
        pos = i;
      }
      if (i === txt.length - 1) {
        paragraphs.push({ text: txt.slice(pos) });
      }
    }
    console.log(paragraphs);

    const inbetweenArray = [];
    let check = null;
    let checkBool = false;
    let ind = 0;
    let testArr = [];
    let linkStart = 0;
    paragraphs.forEach((paragraph) => {
      console.log(paragraph);
      for (let i = 0; i < paragraph.text.length; i++) {
        if (
          paragraph.text[i] === "<" &&
          paragraph.text[i + 1] === "b" &&
          paragraph.text[i + 2] === ">" &&
          !paragraph.text.includes("<list>") &&
          !paragraph.text.includes("</list>")
        ) {
          check = i;
          checkBool = true;
          if (temp) {
            // inbetweenArray[ind].push({ text: temp });
            testArr.push({ text: temp });
            temp = "";
          }
        } else if (
          paragraph.text[i] === "<" &&
          paragraph.text[i + 1] === "/" &&
          paragraph.text[i + 2] === "b" &&
          paragraph.text[i + 3] === ">" &&
          !paragraph.text.includes("<list>") &&
          !paragraph.text.includes("</list>")
        ) {
          // inbetweenArray[ind].push({
          //   bold: paragraph.text.slice(check + 3, i),
          // });
          testArr.push({
            bold: paragraph.text.slice(check + 3, i),
          });
          i = i + 4;
          check = null;
          checkBool = false;
        } else if (paragraph.text[i] !== "\n" && !checkBool) {
          temp = temp.concat(paragraph.text[i]);
        }
        if (i === paragraph.text.length - 1 || i >= paragraph.text.length) {
          console.log(ind);
          let listChecker = false;
          if (temp !== "") {
            for (let j = 0; j < temp.length; j++) {
              if (
                temp[j] === "<" &&
                temp[j + 1] === "l" &&
                temp[j + 2] === "i" &&
                temp[j + 3] === "s" &&
                temp[j + 4] === "t" &&
                temp[j + 5] === ">"
              ) {
                listChecker = j + 6;
              } else if (
                temp[j] === "<" &&
                temp[j + 1] === "/" &&
                temp[j + 2] === "l" &&
                temp[j + 3] === "i" &&
                temp[j + 4] === "s" &&
                temp[j + 5] === "t" &&
                temp[j + 6] === ">"
              ) {
                let configListArr = temp.slice(listChecker, j);
                testArr.push({ list: configListArr });
              }
            }
            if (!listChecker) {
              testArr.push({ text: temp });
            }
          }
          // inbetweenArray[ind].push({ texts: temp });
          inbetweenArray.push([...testArr]);
          ind++;
          finalParagraphs.push({ text: temp });
          temp = "";
          testArr = [];
        }
      }
    });
    console.log(paragraphs);
    console.log(finalParagraphs);
    console.log(inbetweenArray);
    let start = undefined;
    const linkEmbedArr = [];
    const linksArr = [];
    let tempArr = [];
    let tempLink = "";
    let linkThere = false;
    let linkPos = 0;
    let linkPosEnd = 0;
    let embedLink = "";
    let embedThere = false;
    let embedPos = 0;
    let embedPosEnd = 0;
    let incr = 0;
    let listSkipLink = false;
    inbetweenArray.forEach((items, ind) => {
      console.log(items);
      items.forEach((item) => {
        console.log(ind);
        for (let key in item) {
          if (key === "list") {
            listSkipLink = true;
          }
          for (let i = 0; i < item[key].length; i++) {
            if (
              item[key][i] === "<" &&
              item[key][i + 1] === "l" &&
              item[key][i + 2] === "i" &&
              item[key][i + 3] === "n" &&
              item[key][i + 4] === "k" &&
              item[key][i + 5] === ">" &&
              !listSkipLink
            ) {
              if (tempLink) {
                //text inbetween links
                for (let j = i + 6; j < item[key].length; j++) {
                  if (
                    item[key][j] === "<" &&
                    item[key][j + 1] === "/" &&
                    item[key][j + 2] === "l" &&
                    item[key][j + 3] === "i" &&
                    item[key][j + 4] === "n" &&
                    item[key][j + 5] === "k" &&
                    item[key][j + 6] === ">"
                  ) {
                    if (item[key].slice(i, j + 7).includes(" externallink")) {
                      //push text inbetween links but if next link is externallink dont make new line link like usually but just add it together with the text
                      tempArr.push({ text: item[key].slice(linkPosEnd, i) });
                      linkPosEnd = 0;
                    }
                  }
                }
                // linkEmbedArr[incr] = [item[key].slice(linkPosEnd, i)];
                // linkPosEnd = 0;
                // incr++;
              } else if (!tempLink && !embedThere && i - 4 > 0) {
                //text before link
                for (let j = i + 6; j < item[key].length; j++) {
                  if (
                    item[key][j] === "<" &&
                    item[key][j + 1] === "/" &&
                    item[key][j + 2] === "l" &&
                    item[key][j + 3] === "i" &&
                    item[key][j + 4] === "n" &&
                    item[key][j + 5] === "k" &&
                    item[key][j + 6] === ">"
                  ) {
                    if (item[key].slice(i, j + 7).includes(" externallink")) {
                      //push text before link but if next link is externallink dont push new line since next link is part of the text
                      tempArr.push({ text: item[key].slice(0, i) });
                    } else {
                      linkEmbedArr[incr] = [item[key].slice(0, i)]; //in case it's image or internal link
                      incr++;
                    }
                  }
                }
                // linkEmbedArr[incr] = [item[key].slice(0, i)];
                // incr++;
              }
              linkThere = true;
              linkPos = i;
            } else if (
              item[key][i] === "<" &&
              item[key][i + 1] === "/" &&
              item[key][i + 2] === "l" &&
              item[key][i + 3] === "i" &&
              item[key][i + 4] === "n" &&
              item[key][i + 5] === "k" &&
              item[key][i + 6] === ">" &&
              !listSkipLink
            ) {
              tempLink = item[key].slice(linkPos, i + 7);
              linkPosEnd = i + 7;
              linksArr.push(tempLink);
              if (tempLink.includes(" externallink")) {
                tempArr.push({ externalLink: tempLink });
              } else {
                //if not extlink make new line for image or innerlink to article
                linkEmbedArr[incr] = [{ link: tempLink }];
                incr++;
              }
            }
            if (
              item[key][i] === "<" &&
              item[key][i + 1] === "e" &&
              item[key][i + 2] === "m" &&
              item[key][i + 3] === "b" &&
              item[key][i + 4] === "e" &&
              item[key][i + 5] === "d" &&
              item[key][i + 6] === ">"
            ) {
              if (embedLink) {
                linkEmbedArr[incr] = [item[key].slice(embedPosEnd, i)];
                linkPosEnd = 0;
              }
              embedThere = true;
              embedPos = i;
            } else if (
              item[key][i] === "<" &&
              item[key][i + 1] === "/" &&
              item[key][i + 2] === "e" &&
              item[key][i + 3] === "m" &&
              item[key][i + 4] === "b" &&
              item[key][i + 5] === "e" &&
              item[key][i + 6] === "d" &&
              item[key][i + 7] === ">"
            ) {
              embedLink = item[key].slice(embedPos, i + 8);
              embedPosEnd = i + 8;
              linkEmbedArr[incr] = [{ embed: embedLink }];
              incr++;
            }
            if (i === item[key].length - 1 && !linkThere && !embedThere) {
              tempArr.push({ [key]: item[key] });
            } else if (i === item[key].length - 1 && linkThere && !embedThere) {
              if (i > linkPosEnd) {
                tempArr.push({ text: item[key].slice(linkPosEnd) });
              }
              linkThere = false;
            } else if (i === item[key].length - 1 && !linkThere && embedThere) {
              tempArr.push({ text: item[key].slice(embedPosEnd) });
              embedThere = false;
            }
          }
          if (key === "list") {
            listSkipLink = false;
          }
        }
      });
      linkEmbedArr[incr] = [...tempArr];
      incr++;
      tempArr = [];
    });
    console.log(linkEmbedArr);
    console.log(finalParagraphs);
    console.log(linksArr);
    const finishedLinks = [];
    const internalLinks = [];
    let checker = false;
    linksArr.forEach((linkInd, ind) => {
      console.log(linkInd);
      if (linkInd.includes(" external")) {
        const splitArr = linkInd.split(" ");
        finishedLinks.push({
          external: { url: splitArr[0], text: splitArr[1] },
        });
      } else if (linkInd.includes(" image")) {
        let splitArr = linkInd.slice(6, linkInd.length - 7);
        let imageText = "";
        console.log(splitArr);
        for (let i = 0; i < splitArr.length; i++) {
          if (
            splitArr[i] === " " &&
            splitArr[i - 1] === "e" &&
            splitArr[i - 2] === "g" &&
            splitArr[i - 3] === "a" &&
            splitArr[i - 4] === "m" &&
            splitArr[i - 5] === "i" &&
            splitArr[i - 6] === " "
          ) {
            imageText = splitArr.slice(i + 1);
            splitArr = splitArr.slice(0, i);
            splitArr = splitArr.split(" ");
            console.log(splitArr);
            splitArr.push(imageText);
          }
        }
        // splitArr = splitArr.split(" ");
        console.log(splitArr);
        finishedLinks.push({
          image: { url: splitArr[0], text: splitArr[2] },
        });
      } else {
        //internal
        let linkText = linkInd.slice(6, linkInd.length - 7);
        console.log(linkText);
        linkText = linkText.split(" ");
        let path = `${linkText[1]}/-${linkText[0]}`;
        console.log(path);
        const path2 = linkText[1].split("/");
        for (let key in catSubCat) {
          // if (key === path2[0]) {
          //   alert("d");
          // }
          if (key.toLowerCase().includes(path2[0])) {
            for (let i = 0; i < catSubCat[key].length; i++) {
              if (catSubCat[key][i].toLowerCase().includes(path2[1])) {
                path = `${key}/${catSubCat[key][i]}`;
              }
            }
          }
        }
        fetch(
          `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/articles/${path}/-${linkText[0]}.json`
        )
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            const titleSplit = data.title.split(" ");
            let titleSplit2 = [];
            let titleSplit3;
            titleSplit.forEach((split) => {
              titleSplit2.push(split.toLowerCase());
            });
            titleSplit3 = titleSplit2.join("-");
            titleSplit3 = titleSplit3.split(",").join("").split(" ").join("-");
            setInternalLinks((old) => [
              ...old,
              {
                title: data.title,
                subTitle: data.subTitle,
                imageUrl: data.images[0],
                linkPath: `/${data.category}/${data.subCategory}/${titleSplit3}/${data.id}`,
                cat: data.category.toLowerCase(),
              },
            ]);
            // internalLinks.push({
            //   internal: {
            //     title: data.title,
            //     subTitle: data.subTitle,
            //     imageUrl: data.images[0],
            //     linkPath: `/${data.category}/${data.subCategory}/${titleSplit3}/${data.id}`,
            //   },
            // });
          });
      }
      if (ind === linksArr.length - 1) {
        console.log(internalLinks);
        console.log(finishedLinks);
        setLinkData([...finishedLinks]);
      }
    });
    // setText(finalParagraphs);
    setText(linkEmbedArr);
  }, [location]);

  useEffect(() => {
    if (articleData) {
      console.log(articleData.shares);
      console.log(Object.keys(articleData.comments[0]).length);
      console.log(articleData.images[0]);
      // if (typeof articleData.comments[0] == 'undefined') {
      //   alert('x');
      // }
      // console.log(articleData.comments[0]);
      console.log(typeof articleData.images);
      console.log(articleData.comments);

      // console.log(articleData.comments.length);
      // console.log(articleData.comments[0]);
    }
  }, [articleData]);

  useEffect(() => {
    console.log(linkData);
  }, [linkData]);

  const itemsarr = [];
  let intLinkThere = false;
  let imageThere = false;
  let embedThere = false;
  let intLinkIncr = 0;
  let extLinkIncr = 0;
  let arrTemp = [];
  let listIncr = 0;
  console.log(text);
  text.map((textInd) => {
    console.log(textInd);
    textInd.map((it) => {
      for (let key in it) {
        if (key === "bold" && textInd.length === 1) {
          itemsarr.push(
            <React.Fragment key={uuid()}>
              <b key={uuid()}>{it[key]}</b>
              <br></br>
            </React.Fragment>
          );
        } else if (key === "link") {
          if (it[key].includes(" external")) {
            itemsarr.push(
              <a key={uuid()} href={linkData[0][0].url}>
                {linkData[0][0].text}
              </a>
            );
          } else if (it[key].includes(" image")) {
            console.log(linkData);
            console.log(linkData[extLinkIncr].image.url);
            itemsarr.push(
              <>
                <img
                  style={{ width: "100%", height: "initial" }}
                  key={uuid()}
                  src={linkData[extLinkIncr].image.url}
                />
                <p className={s.textBelowImage}>
                  {linkData[extLinkIncr].image.text}
                </p>
              </>
            );
            imageThere = true;
            extLinkIncr++;
          } else {
            if (internalLinks.length > 0) {
              //async req
              console.log(internalLinks[0]);
              intLinkThere = true;
              itemsarr.push(
                <ArticleLink
                  key={uuid()}
                  subTitle={internalLinks[intLinkIncr].subTitle}
                  title={internalLinks[intLinkIncr].title}
                  imageUrl={internalLinks[intLinkIncr].imageUrl}
                  linkPath={internalLinks[intLinkIncr].linkPath}
                  category={internalLinks[intLinkIncr].cat}
                />
              );
              intLinkIncr++;
            }
          }
        } else if (key === "embed") {
          itemsarr.push(parse(it[key]));
          embedThere = true;
        } else if (key === "list") {
          const listArr = it[key].split(" || ");
          let foundLinkVar = 0;
          let foundBoldVar = 0;
          const tempListArr = [];
          let tempListLinkArr = [];
          let tempListText = "";
          for (let i = 0; i < listArr.length; i++) {
            if (
              (listArr[i].includes("<link>") &&
                listArr[i].includes("</link>")) ||
              (listArr[i].includes("<b>") && listArr[i].includes("</b>"))
            ) {
              for (let j = 0; j < listArr[i].length; j++) {
                if (
                  listArr[i][j] === "<" &&
                  listArr[i][j + 1] === "b" &&
                  listArr[i][j + 2] === ">"
                ) {
                  foundBoldVar = j + 3;
                  j = j + 2;
                } else if (
                  listArr[i][j] === "<" &&
                  listArr[i][j + 1] === "/" &&
                  listArr[i][j + 2] === "b" &&
                  listArr[i][j + 3] === ">"
                ) {
                  if (tempListText) {
                    tempListLinkArr.push(<span>{tempListText}</span>);
                    tempListText = "";
                  }
                  tempListLinkArr.push(
                    <b>{listArr[i].slice(foundBoldVar, j)}</b>
                  );
                  foundBoldVar = 0;
                  j = j + 3;
                } else if (
                  listArr[i][j] === "<" &&
                  listArr[i][j + 1] === "l" &&
                  listArr[i][j + 2] === "i" &&
                  listArr[i][j + 3] === "n" &&
                  listArr[i][j + 4] === "k" &&
                  listArr[i][j + 5] === ">"
                ) {
                  foundLinkVar = j + 6;
                  j = j + 5;
                } else if (
                  listArr[i][j] === "<" &&
                  listArr[i][j + 1] === "/" &&
                  listArr[i][j + 2] === "l" &&
                  listArr[i][j + 3] === "i" &&
                  listArr[i][j + 4] === "n" &&
                  listArr[i][j + 5] === "k" &&
                  listArr[i][j + 6] === ">"
                ) {
                  let listLink = listArr[i].slice(foundLinkVar, j);
                  const listLinkFirstIndex = listLink.split(" ")[0];
                  listLink = listLink.replace(listLinkFirstIndex + " ", "");
                  if (tempListText) {
                    tempListLinkArr.push(<span>{tempListText}</span>);
                    tempListText = "";
                  }
                  tempListLinkArr.push(
                    <a href={listLinkFirstIndex}>{listLink}</a>
                  );
                  console.log(listLink);
                  console.log(listLinkFirstIndex);
                  foundLinkVar = 0;
                  j = j + 6;
                } else {
                  if (!foundLinkVar && !foundBoldVar) {
                    tempListText = tempListText.concat(listArr[i][j]);
                  }
                }
                if (j === listArr[i].length - 1) {
                  if (tempListText) {
                    tempListLinkArr.push(<span>{tempListText}</span>);
                  }
                  tempListArr.push(<li>{tempListLinkArr}</li>);
                  console.log(tempListLinkArr);
                  console.log(tempListArr);
                  tempListLinkArr = [];
                  tempListText = [];
                }
              }
            } else {
              tempListArr.push(<li>{listArr[i]}</li>);
            }
          }
          if (articleData.listOrder[listIncr] === "ol") {
            itemsarr.push(<ol>{tempListArr}</ol>);
          } else if (articleData.listOrder[listIncr] === "ul") {
            itemsarr.push(<ul>{tempListArr}</ul>);
          }
          listIncr++;
          console.log(tempListText);
        } else {
          if (textInd.length > 1) {
            if (key === "bold") {
              arrTemp.push(<b>{it[key]}</b>);
            } else if (key === "externalLink") {
              let separate = it[key];
              separate = separate.slice(6, separate.length - 8);
              separate = separate.split(" ");
              arrTemp.push(<a href={separate[0]}>{separate[1]}</a>);
            } else {
              arrTemp.push(<span>{it[key]}</span>);
            }
            if (arrTemp.length === textInd.length) {
              console.log(arrTemp);
              itemsarr.push(
                <React.Fragment key={uuid()}>
                  <p key={uuid()}>{arrTemp}</p>
                </React.Fragment>
              );
              arrTemp = [];
            }
          } else {
            console.log(it[key]);
            itemsarr.push(
              <React.Fragment key={uuid()}>
                <p key={uuid()}>{it[key]}</p>
              </React.Fragment>
            );
          }
        }
      }
    });

    if (intLinkThere) {
      //remove brs
      itemsarr.splice(itemsarr.length - 2, 1);
      intLinkThere = false;
    } else if (imageThere) {
      imageThere = false;
    } else if (embedThere) {
      embedThere = false;
    } else {
      itemsarr.push(<br key={uuid()}></br>);
    }
  });

  const handleSliderOverlay = () => {
    setClickedSlider((old) => !old);
    setCounter(0);
  };

  const addRemoveOverlay = () => {
    if (!zoomedIn) {
      setClickedSlider(false);
    }
  };

  const addRemoveOverlayClick = (e) => {
    const { id } = e.target;
    if (id.includes("clickedSlider")) {
      setClickedSlider(false);
      if (zoomedIn) {
        setZoomedIn(false);
      }
    }
  };

  useEffect(() => {
    if (clickedSlider) {
      if (!posOfSlider) {
        setPosOfSlider(imageSliderRef.current.getBoundingClientRect().top);
      }
    }
  }, [clickedSlider]);

  const zoomOut = () => {
    imageSliderRef.current.style.width = "62.5%";
    imageSliderRef.current.style.height = "85vh";
    imageSliderRef.current.style.top = "7vh";
    // imageSliderRef.current.style.transform = "translateY(0%)";
    imageSliderRef.current.style.transform = "translateX(-50%)";
    sliderFooterBar.current.style.color = "#c4c4c4";
  };

  const zoomIn = (mode) => {
    imageSliderRef.current.style.width = "90%";
    // imageSliderRef.current.style.height = "fit-content";
    imageSliderRef.current.style.height = "150vh";
    sliderFooterBar.current.style.color = "#fff";
    imageSliderRef.current.style.transform = "translateX(-50%)";
    switch (mode) {
      case "normal":
        imageSliderRef.current.style.top = "0vh"; //-20bot -10 mid 0 top
        break;
      case "upper":
        // imageSliderRef.current.style.top = "-10%"; //-20bot -10 mid 0 top
        imageSliderRef.current.style.transform = "translate(-50%, -10%)";
        break;
      case "middle":
        // imageSliderRef.current.style.top = "-15%"; //-20bot -10 mid 0 top
        imageSliderRef.current.style.transform = "translate(-50%, -20%)";
        break;
      case "lower":
        // imageSliderRef.current.style.top = "-40vh"; //-20bot -10 mid 0 top
        imageSliderRef.current.style.transform = "translate(-50%, -30%)";
        break;
    }
  };

  const zoomInPerBtn = () => {
    if (zoomedIn) {
      setZoomedIn(false);
      zoomOut();
    } else {
      setZoomedIn(true);
      // imageSliderRef.current.style.width = "90%";
      // // imageSliderRef.current.style.transform = "translateY(-30%)"; //zoom down

      // imageSliderRef.current.style.height = "150vh";

      // // imageSliderRef.current.style.transform = "translateY(-10%)"; //center zoom
      // // imageSliderRef.current.style.transform = "translateY(0%)"; //top zoom
      // imageSliderRef.current.style.marginTop = "0%"; //-20bot -10 mid 0 top
      // sliderFooterBar.current.style.color = "#fff";
      zoomIn("middle");
    }
  };

  const mouseDownMove = () => {
    if (zoomedIn) {
      console.log("mousedown");
      imageSliderRef.current.style.cursor = "grabbing";
      timer.current = setTimeout(() => {
        setMoving(true);
      }, 250);
    }
  };

  const mouseUpMove = (e) => {
    clearTimeout(timer.current);
    timer.current = null;

    if (zoomedIn) {
      imageSliderRef.current.style.cursor = "grab";
      imageSliderRef.current.style.transform = "none";
      imageSliderRef.current.style.top = `7vh`;

      if (zoomPos === "upper") {
        imageSliderRef.current.style.transform = "translate(-50%, -10%)";
      } else if (zoomPos === "middle") {
        imageSliderRef.current.style.transform = "translate(-50%, -20%)";
      } else if (zoomPos === "lower") {
        imageSliderRef.current.style.transform = "translate(-50%, -30%)";
      } else {
        imageSliderRef.current.style.top = `0`;
      }
      imageSliderRef.current.style.left = `50%`;
      setGrabXPrev(null);
      setGrabYPrev(null);
    }
    if (!moving) {
      const oneThird = imageSliderRef.current.offsetHeight / 3;
      const positionOnElement =
        e.clientY - imageSliderRef.current.getBoundingClientRect().top;
      if (positionOnElement < oneThird) {
        if (zoomedIn) {
          setZoomedIn(false);
          zoomOut();
        } else {
          setZoomedIn(true);
          zoomIn("upper");
          setZoomPos("upper");
        }
      } else if (
        positionOnElement >= oneThird &&
        positionOnElement <= oneThird * 2
      ) {
        if (zoomedIn) {
          setZoomedIn(false);
          zoomOut();
        } else {
          setZoomedIn(true);
          zoomIn("middle");
          setZoomPos("middle");
        }
      } else {
        if (zoomedIn) {
          setZoomedIn(false);
          zoomOut();
        } else {
          setZoomedIn(true);
          zoomIn("lower");
          setZoomPos("lower");
        }
      }
    }
    if (moving) {
      setMoving(false);
    }
  };

  useEffect(() => {
    if (imageSliderRef.current) {
      console.log(imageSliderRef.current.style.top);
      console.log(imageSliderRef.current.style.left);
    }
  }, [imageSliderRef]);

  const mouseMove = (e) => {
    console.log("mousemove");
    if (zoomedIn && moving) {
      if (imageSliderRef.current.style) {
        const widthX = imageSliderRef.current.width;
        const heightY = imageSliderRef.current.height;
        let tst1 = imageSliderRef.current.style.left;
        let tst2 = imageSliderRef.current.style.top;
        setGrabXPrev(e.clientX);
        setGrabYPrev(e.clientY);
        console.log(grabXPrev);
        console.log(grabYPrev);
        let addX = 1;
        let addY = 5;
        console.log(imageSliderRef.current.style);
        console.log(Object.assign({}, imageSliderRef.current.style));
        console.log(tst1);
        console.log(tst2);
        console.log(tst1.replace(/\D/g, ""));
        console.log(typeof +tst2.replace(/\D/g, ""));
        tst1 = +tst1.replace(/\D/g, "");
        tst2 = +tst2.replace(/\D/g, "");
        console.log(e.clientX);
        console.log(e.clientY);
        console.log(widthX);
        console.log(heightY);
        console.log(imageSliderRef.current.offsetLeft);
        console.log(imageSliderRef.current.offsetTop);
        console.log(imageSliderRef.current.offsetTop - e.clientY);
        console.log(imageSliderRef.current.offsetLeft - e.clientX);
        // const offset = [imageSliderRef.current.offsetLeft - e.clientX, imageSliderRef.current.offsetTop - e.clientY]
        // imageSliderRef.current.style.left = e.clientX + offset[0] + 'px'
        // imageSliderRef.current.style.top = e.clientY + offset[1] + 'px'
        if (grabXPrev && grabYPrev) {
          const pos1 = grabXPrev - e.clientX;
          const pos2 = grabYPrev - e.clientY;
          console.log(grabXPrev);
          console.log(e.clientX);
          console.log(e.clientY);
          console.log(grabYPrev);
          console.log(pos2);
          console.log(imageSliderRef.current.offsetTop);
          console.log(imageSliderRef.current.offsetTop - pos2);
          const offsetArr = [
            imageSliderRef.current.offsetLeft - pos1,
            imageSliderRef.current.offsetTop - pos2,
          ];

          imageSliderRef.current.style.top = offsetArr[1] + "px";

          imageSliderRef.current.style.left = offsetArr[0] + "px";
        }
      }
    }
  };

  useEffect(() => {}, [moving]);

  useEffect(() => {
    if (zoomedIn) {
      if (imageSliderRef.current) {
        imageSliderRef.current.style.cursor = "grab";
      }
      // document.body.style.position = "fixed";
      // document.body.style.overflowY = "scroll";
    } else {
      if (imageSliderRef.current) {
        imageSliderRef.current.style.cursor = "zoom-in";
      }
      // document.body.style.position = "static";
    }
  }, [zoomedIn]);

  const handleSliderControls = (e, mode) => {
    // setArticleData((old) => {
    // let oldArr = [...old.images];
    // console.log(old);
    // const takeAndAdd = oldArr[0];
    // oldArr.splice(0, 1);
    // oldArr.push(takeAndAdd);
    // console.log(oldArr);
    // old.images = [...oldArr];
    // console.log(old);
    // imageSliderRef.current.src = oldArr[0];
    // return old;
    // });
    if (mode === "right") {
      if (counter < articleData.images.length - 1) {
        setCounter((old) => old + 1);
        imageSliderRef.current.src = articleData.imageText[counter + 1][0];
      } else if (counter === articleData.images.length - 1) {
        setCounter(0);
        imageSliderRef.current.src = articleData.imageText[0][0];
      }
    } else if (mode === "left") {
      if (counter === 0) {
        setCounter(articleData.images.length - 1);
        imageSliderRef.current.src = articleData.imageText[counter][0];
      } else {
        setCounter((old) => old - 1);
        imageSliderRef.current.src = articleData.imageText[counter - 1][0];
      }
    }
  };

  const openSliderFromThumbnail = (index) => {
    setClickedSlider(true);
    setCounter(index);
    // setTimeout(() => {
    //   if (imageSliderRef.current) {
    //     imageSliderRef.current.src = articleData.images[index];
    //   }
    // }, 10);
  };

  const toggleFullscren = (e) => {
    imageSliderRef.current.parentElement.requestFullscreen();
    e.target.className = "fas fa-compress";
    if (document.fullscreenElement) {
      document.exitFullscreen();
      e.target.className = "fas fa-expand";
    }
  };

  return (
    <div id={s.articleParent}>
      {clickedSlider && (
        <div
          onClick={addRemoveOverlayClick}
          onWheel={addRemoveOverlay}
          id={s.clickedSlider}
        >
          <div id={s.sliderMainImgContainer}>
            <div id={s.sliderHeaderBar}>
              <span id={s.slideNumbers}>{`${counter + 1} / ${
                articleData.images.length
              }`}</span>
              <span id={s.slideZoomExpand}>
                {!zoomedIn && (
                  <i class="fas fa-search-plus" onClick={zoomInPerBtn}></i>
                )}
                {zoomedIn && (
                  <i class="fas fa-search-minus" onClick={zoomInPerBtn}></i>
                )}
                <i class="fas fa-expand" onClick={toggleFullscren}></i>
              </span>
            </div>
            <img
              ref={imageSliderRef}
              src={articleData && articleData.imageText[counter][0]}
              onMouseDown={mouseDownMove}
              onMouseUp={mouseUpMove}
              onMouseMove={mouseMove}
            />
            <div
              id={s.sliderRight}
              onClick={(e) => handleSliderControls(e, "right")}
            >
              <i class="fas fa-long-arrow-alt-right"></i>
            </div>
            <div
              id={s.sliderLeft}
              onClick={(e) => handleSliderControls(e, "left")}
            >
              <i class="fas fa-long-arrow-alt-left"></i>
            </div>
            <div id={s.sliderFooterBar} ref={sliderFooterBar}>
              {/* (Foto: D. S./Klix.ba) */}
              {articleData.imageText[counter][1]}
            </div>
          </div>
        </div>
      )}
      <div id={s.articleHeader}>
        <h3
          style={{
            color: articleData && `${clrs[articleData.category.toLowerCase()]}`,
          }}
        >
          {articleData && articleData.subTitle}
        </h3>
        <h1>{articleData && articleData.title}</h1>
      </div>
      <div id={s.articleBody}>
        <div id={s.articleSidebarLeft} ref={stickLeftSideBar}>
          <div id={s.bundleDiv}>
            <div id={s.postedData}>
              <div id={s.postedDataOne}>
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
                <p>{timeDifference(articleData && articleData.date)}</p>
              </div>
            </div>
            <div id={s.commentsShare}>
              <div id={s.comments}>
                <h2>
                  {articleData && articleData.comments[0] === ""
                    ? 0
                    : articleData
                    ? fullComLength.current
                    : 0}
                </h2>
                <p>komentara</p>
              </div>
              <div id={s.shares}>
                <h2>{articleData ? articleData.shares[0].length : ""}</h2>
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
        <div id={s.articleBodyContent}>
          {articleData && articleData.images.length > 1 ? (
            <div id={s.imageSliderContainer}>
              <div id={s.mainSliderImage}>
                <img
                  onClick={handleSliderOverlay}
                  src={articleData.imageText[0][0]}
                />
              </div>
              <div id={s.sliderImages}>
                {articleData.imageText.map((img, i) =>
                  i < 4 && i !== 0 ? (
                    <img
                      src={img[0]}
                      onClick={() => openSliderFromThumbnail(i)}
                    />
                  ) : i === 4 ? (
                    <div id={s.clickForMore}>
                      {articleData.imageText.length - 5 > 0 ? (
                        <span onClick={() => openSliderFromThumbnail(i)}>
                          +{articleData.imageText.length - 5}
                        </span>
                      ) : null}
                      <img
                        src={img[0]}
                        onClick={() => openSliderFromThumbnail(i)}
                      />
                    </div>
                  ) : null
                )}
              </div>
              <p>{articleData.imageText[0][1]}</p>
            </div>
          ) : (
            <div id={s.imageContainer}>
              <img src={articleData && articleData.imageText[0][0]} />
              <div id={s.captionTxt}>
                <p>{articleData && articleData.imageText[0][1]}</p>
              </div>
            </div>
          )}

          <div id={s.articleText}>
            {/* {text.map((textInd) => {
              console.log(textInd);
              textInd.map((it) => {
                for (let key in it) {
                  key === "bold"
                    ? itemsarr.push(
                        <React.Fragment key={uuid()}>
                          <b key={uuid()}>{it[key]}</b>
                          <br></br>
                        </React.Fragment>
                      )
                    : itemsarr.push(
                        <React.Fragment key={uuid()}>
                          <p key={uuid()}>{it[key]}</p>
                        </React.Fragment>
                      );
                }
              });
              itemsarr.push(<br key={uuid()}></br>);
            })} */}
            {itemsarr}
            {/* {articleData && articleData.articleText} */}
            {/* Vijest da WizzAir uvodi letove sa Aerodroma Sarajevo i Aerodroma
            Banja Luka odjeknula je u bh. dijaspori, a i među svima koji su
            tokom pandemije poželjeli putovanja. Od juna 2021. godine WizzAir iz */}
            {/* {parse(
              '<iframe src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2FKlix.ba%2Fposts%2F10158031303966821&show_text=true&width=500" width="500" height="487" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>'
            )} */}
            {/* {parse(
              '<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/p/CRk85dWjuov/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="13" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:16px;"> <a href="https://www.instagram.com/p/CRk85dWjuov/?utm_source=ig_embed&amp;utm_campaign=loading" style=" background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank"> <div style=" display: flex; flex-direction: row; align-items: center;"> <div style="background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 40px; margin-right: 14px; width: 40px;"></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 100px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 60px;"></div></div></div><div style="padding: 19% 0;"></div> <div style="display:block; height:50px; margin:0 auto 12px; width:50px;"><svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-511.000000, -20.000000)" fill="#000000"><g><path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path></g></g></g></svg></div><div style="padding-top: 8px;"> <div style=" color:#3897f0; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:550; line-height:18px;"> View this post on Instagram</div></div><div style="padding: 12.5% 0;"></div> <div style="display: flex; flex-direction: row; margin-bottom: 14px; align-items: center;"><div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(0px) translateY(7px);"></div> <div style="background-color: #F4F4F4; height: 12.5px; transform: rotate(-45deg) translateX(3px) translateY(1px); width: 12.5px; flex-grow: 0; margin-right: 14px; margin-left: 2px;"></div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(9px) translateY(-18px);"></div></div><div style="margin-left: 8px;"> <div style=" background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 20px; width: 20px;"></div> <div style=" width: 0; height: 0; border-top: 2px solid transparent; border-left: 6px solid #f4f4f4; border-bottom: 2px solid transparent; transform: translateX(16px) translateY(-4px) rotate(30deg)"></div></div><div style="margin-left: auto;"> <div style=" width: 0px; border-top: 8px solid #F4F4F4; border-right: 8px solid transparent; transform: translateY(16px);"></div> <div style=" background-color: #F4F4F4; flex-grow: 0; height: 12px; width: 16px; transform: translateY(-4px);"></div> <div style=" width: 0; height: 0; border-top: 8px solid #F4F4F4; border-left: 8px solid transparent; transform: translateY(-4px) translateX(8px);"></div></div></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center; margin-bottom: 24px;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 224px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 144px;"></div></div></a><p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;"><a href="https://www.instagram.com/p/CRk85dWjuov/?utm_source=ig_embed&amp;utm_campaign=loading" style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none;" target="_blank">A post shared by Chloe Ventura (@chloe.ventura)</a></p></div></blockquote>  <script async src="//www.instagram.com/embed.js"></script>'
            )} */}
            {/* Sarajeva leti za čak devet destinacija: Basel, Brussels, Dortmund,
            Memmingen, Eindhoven, Copenhagen, Gothenburg, Stockholm i Paris. Iz
            Banja Luke WizzAir leti za Basel, Dortmund, Eindhoven, Malmo i
            Stockholm, te se pridružuje RyanAiru koji iz Banja Luke leti za
            Memmingen i Gothenburg. */}
          </div>
          <div id={s.tags}>
            {articleData &&
              articleData.tags.map((tag) => <span key={uuid()}>{tag}</span>)}
          </div>
          <div id={s.addComment}>
            <h3>Komentari</h3>
            {ctx.isLoggedIn && (
              <CommentType
                path={{
                  category: location.state.articleData.category,
                  subCategory: location.state.articleData.subCategory,
                  id: location.state.articleData.id,
                }}
              />
            )}

            <button className={s.showComments}>
              <Link
                to={
                  articleData && {
                    pathname: `${articleData.linkPath}/komentari`,
                    state: {
                      articleData,
                    },
                  }
                }
              >
                PRIKAŽI SVE KOMENTARE (
                {articleData && articleData.comments[0] === ""
                  ? 0
                  : articleData
                  ? getComLength(articleData.comments)
                  : 0}
                )
              </Link>
            </button>
          </div>
          <div id={s.linkedArticles}>
            <div id={s.linkedArticlesHeader}>
              <h3>Vezani članci</h3>
              <i class="fas fa-link"></i>
            </div>
            <div id={s.linkedArticlesBody}>
              <LinkedArticles />
              <LinkedArticles />
              <LinkedArticles />
            </div>
            <div id={s.linkedPromo}>
              <div id={s.linkedPromoHeader}>
                <h3>Promo</h3>
                <i class="fas fa-mouse-pointer"></i>
              </div>
              <div id={s.linkedPromoBody}>
                <LinkedPromo />
                <LinkedPromo />
                <LinkedPromo />
              </div>
            </div>
          </div>
        </div>
        <div id={s.articleSidebarRight}></div>
      </div>
    </div>
  );
};

export default ArticleComp;
