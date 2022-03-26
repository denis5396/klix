import React, { useContext, useEffect, useRef, useState } from "react";
import parse from "html-react-parser";
import { v1 as uuid } from "uuid";
import s from "./AddArticle.module.css";
import Overlay from "../Overlay/Overlay";
import Modal from "../Modal/Modal";
import LoginContext from "../../context";
import { auth, db, storage } from "../../firebase";
import ProgressBar from "../ProgressBar/ProgressBar";
import {
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import { timeDifference } from "./EditArticle/EditArticle";

export const subcategories = {
  početna: [
    "Vijesti",
    "Biznis",
    "Sport",
    "Magazin",
    "Lifestyle",
    "Auto",
    "Scitech",
  ],
  vijesti: [
    "BiH",
    "Regija",
    "Svijet",
    "Dijaspora",
    "Crna hronika",
    "Humanitarne akcije",
  ],
  biznis: [
    "Privreda",
    "Finansije",
    "Investicije",
    "Smart Cash",
    "Berza",
    "Startupi",
    "Posao",
  ],
  sport: [
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
  magazin: ["Kultura", "Muzika", "Film/TV", "Showbiz", "Zanimljivosti"],
  lifestyle: [
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
  scitech: ["Nauka", "Tehnologija"],
  auto: ["Testovi", "Noviteti", "Koncepti", "Tuning"],
};

const AddArticle = () => {
  const ctx = useContext(LoginContext);
  const [paste, setPaste] = useState(false);
  const location = useLocation();
  const history = useHistory();
  const [embed, setEmbed] = useState(false);
  const [selStart, setSelStart] = useState({
    enter: false,
    num: 0,
  });
  const [imageArray, setImageArray] = useState([]);
  const [imagePreview, setImagePreview] = useState({});
  const [savedNames, setSavedNames] = useState([]);
  const [deleteMode, setDeleteMode] = useState(false);
  const [tags, setTags] = useState([]);
  const [progress, setCurProgress] = useState([]);
  const [articleAdded, setArticleAdded] = useState(false);
  const [sending, setSending] = useState(false);
  const [subcategoriesMap, setSubcategoriesMap] = useState([]);
  const [saveSubcat, setSaveSubcat] = useState("BiH");
  const [showSecondList, setShowSecondList] = useState(false);
  const [currentList, setCurrentList] = useState("ul");
  const [lists, setLists] = useState([]);
  const [subCatInit, setSubCatInit] = useState(false);

  //dragging
  const [dragIndex, setDragIndex] = useState(0);
  const [replacedIdx, setReplacedIdx] = useState(0);
  const [clone, setClone] = useState(null);
  const [storeRef, setStoreRef] = useState(null);
  const [drag, setDrag] = useState(false);

  const didMountRef = useRef(false);
  const postaviSlikeText = useRef();
  const postaviSlikeBorder = useRef();
  const textareaRef = useRef();
  const imgCnt = useRef();
  const overlayRef = useRef();
  const tagContainer = useRef();
  const titles = useRef();
  const captionText = useRef();
  const categorySelect = useRef();
  const progressRef = useRef();
  const sendArticleOverlay = useRef();
  const commentsRadio = useRef();
  const subcategorySelect = useRef();
  const isPromo = useRef();

  useEffect(() => {
    console.log(progress);
  }, [progress]);

  useEffect(() => {}, []);
  useEffect(() => {
    if (subCatInit) {
      setSaveSubcat(location.state.articleData.subCategory);
      setSubCatInit(false);
    }
    console.log(subcategoriesMap);
    console.log(didMountRef.current);
  }, [subcategoriesMap, subCatInit]);

  useEffect(() => {
    if (location.state) {
      alert("locationhere");
      console.log(location);
      const { articleData } = location.state;
      const strDate = timeDifference(articleData.date);
      console.log(strDate);
      titles.current.children[0].value = articleData.title;
      titles.current.children[1].value =
        articleData.sponsored && articleData.subTitle !== "PROMO"
          ? `PROMO ${articleData.subTitle}`
          : articleData.sponsored && articleData.subTitle === "PROMO"
          ? "PROMO"
          : articleData.subTitle;
      if (articleData.sponsored) {
        commentsRadio.current.children[0].children[1].disabled = true;
        commentsRadio.current.children[1].children[1].disabled = true;
      }
      textareaRef.current.value = articleData.articleText;
      if (articleData.tags) {
        setTags([...articleData.tags]);
      }
      if (articleData.listOrder) {
        setLists([...articleData.listOrder]);
      }
      if (articleData.commentsAllowed === "Da") {
        commentsRadio.current.children[0].children[1].checked = true;
      } else {
        commentsRadio.current.children[1].children[1].checked = true;
      }
      console.log(subcategories[articleData.category.toLowerCase()]);
      console.log(articleData.subCategory);
      categorySelect.current.value = articleData.category;
      const event = new Event("change", { bubbles: true });
      categorySelect.current.dispatchEvent(event);
      setSubCatInit(true); //init subcategory in select when first loading an art which we want to edit
      if (typeof articleData.imageText === "string") {
        captionText.current.value = articleData.imageText;
      } else {
        let txtString = "";
        articleData.imageText.forEach((imgTxt, i) => {
          if (i !== articleData.imageText.length - 1) {
            txtString = txtString.concat(`${imgTxt[1]} || `);
          } else {
            txtString = txtString.concat(`${imgTxt[1]}`);
          }
        });
        captionText.current.value = txtString;
      }
      const locationImgArray = [];
      let blobToFileArray = [];
      articleData.imageText.forEach((img, i) => {
        locationImgArray.push({
          url: img[0],
          checked: "false",
          name: img[2] ? img[2] : `random${i}`,
        });
      });
      for (let i = 0; i < locationImgArray.length; i++) {
        // fetch(locationImgArray[i].url)
        //   .then((response) => response.blob())
        //   .then((blob) => {
        //     const file = new File([blob], locationImgArray[i].name, {
        //       type: blob.type,
        //     });
        //     blobToFileArray[i] = file;
        //     // blobToFileArray.push(file);
        //     if (i === locationImgArray.length - 1) {
        //       setImageArray([...blobToFileArray]);
        //       console.log(blobToFileArray);
        //     }
        //   });
        (async function (cntr) {
          const response = await fetch(locationImgArray[cntr].url);
          const blob = await response.blob();
          const file = new File([blob], locationImgArray[cntr].name, {
            type: blob.type,
          });
          blobToFileArray[cntr] = file;
          if (cntr === locationImgArray.length - 1) {
            setImageArray(blobToFileArray);
          }
        })(i);
      }
      locationImgArray.forEach((imgPre, i) => {
        // (async function () {
        //   const response = await fetch(imgPre.url);
        //   const blob = await response.blob();
        //   const file = new File([blob], imgPre.name, { type: blob.type });
        //   blobToFileArray.push(file);
        //   if (i === locationImgArray.length - 1) {
        //     setImageArray(blobToFileArray);
        //   }
        // })();
      });
      setImagePreview([...locationImgArray]);
    }
  }, [location]);

  const handleHoverEnter = () => {
    postaviSlikeBorder.current.style.borderColor = "#3f87e5";
  };

  const handleHoverLeave = () => {
    postaviSlikeBorder.current.style.borderColor = "#d8dee4";
  };

  //inserting a diff tag into a tag

  const handleInsert = (mode) => {
    const selectionStart = textareaRef.current.selectionStart;
    const selectionEnd = textareaRef.current.selectionEnd;
    const { value } = textareaRef.current;
    let start = 0;
    switch (mode) {
      case "bold":
        for (let i = 0; i < value.length; i++) {
          if (
            value[i] === "<" &&
            value[i + 1] === "b" &&
            value[i + 2] === ">"
          ) {
            start = i;
          } else if (
            value[i] === "<" &&
            value[i + 1] === "/" &&
            value[i + 2] === "b" &&
            selectionStart >= start + 1 &&
            selectionStart <= i + 3
          ) {
            return true;
          }
        }
        break;
      case "list":
        for (let i = 0; i < value.length; i++) {
          if (
            value[i] === "<" &&
            value[i + 1] === "l" &&
            value[i + 2] === "i" &&
            value[i + 3] === "s" &&
            value[i + 4] === "t" &&
            value[i + 5] === ">"
          ) {
            start = i;
          } else if (
            value[i] === "<" &&
            value[i + 1] === "/" &&
            value[i + 2] === "l" &&
            value[i + 3] === "i" &&
            value[i + 4] === "s" &&
            value[i + 5] === "t" &&
            value[i + 6] === ">" &&
            selectionStart >= start + 6 &&
            selectionStart <= i
          ) {
            let found = 0;
            for (let j = start + 6; j < i; j++) {
              if (
                value[j] === "<" &&
                value[j + 1] === "b" &&
                value[j + 2] === ">"
              ) {
                found = j + 1;
              } else if (
                value[j] === "<" &&
                value[j + 1] === "/" &&
                value[j + 2] === "b" &&
                value[j + 3] === ">" &&
                selectionStart >= found &&
                selectionStart <= j + 3
              ) {
                return "dontAllow";
              }
              if (
                value[j] === "<" &&
                value[j + 1] === "l" &&
                value[j + 2] === "i" &&
                value[j + 3] === "n" &&
                value[j + 4] === "k" &&
                value[j + 5] === ">"
              ) {
                found = j + 1;
              } else if (
                value[j] === "<" &&
                value[j + 1] === "/" &&
                value[j + 2] === "l" &&
                value[j + 3] === "i" &&
                value[j + 4] === "n" &&
                value[j + 5] === "k" &&
                value[j + 6] === ">" &&
                selectionStart >= found &&
                selectionStart <= j + 6
              ) {
                return "dontAllow";
              }
            }
            return "betweenTags";
          } else if (
            value[i] === "<" &&
            value[i + 1] === "/" &&
            value[i + 2] === "l" &&
            value[i + 3] === "i" &&
            value[i + 4] === "s" &&
            value[i + 5] === "t" &&
            value[i + 6] === ">" &&
            selectionStart >= start + 1 &&
            selectionStart <= i + 6
          ) {
            return true;
          }
        }
        break;
      case "embed":
        for (let i = 0; i < value.length; i++) {
          if (
            value[i] === "<" &&
            value[i + 1] === "e" &&
            value[i + 2] === "m" &&
            value[i + 3] === "b"
          ) {
            start = i;
          } else if (
            value[i] === "<" &&
            value[i + 1] === "/" &&
            value[i + 2] === "e" &&
            selectionStart >= start + 1 &&
            selectionStart <= i + 7
          ) {
            return true;
          }
        }
        break;
      case "link":
        for (let i = 0; i < value.length; i++) {
          if (
            value[i] === "<" &&
            value[i + 1] === "l" &&
            value[i + 2] === "i" &&
            value[i + 3] === "n"
          ) {
            start = i;
          } else if (
            value[i] === "<" &&
            value[i + 1] === "/" &&
            value[i + 2] === "l" &&
            value[i + 3] === "i" &&
            value[i + 4] === "n" &&
            value[i + 5] === "k" &&
            selectionStart >= start + 1 &&
            selectionStart <= i + 6
          ) {
            return true;
          }
        }
        break;
    }
  };

  const handleSelect = (mode) => {
    const selectionStart = textareaRef.current.selectionStart;
    const selectionEnd = textareaRef.current.selectionEnd;
    const { value } = textareaRef.current;
    let start = 0;
    //either selStart starts between the tags OR selEnd no other case
    switch (mode) {
      case "bold":
        for (let i = 0; i < value.length; i++) {
          if (
            value[i] === "<" &&
            value[i + 1] === "b" &&
            value[i + 2] === ">"
          ) {
            start = i;
          } else if (
            (value[i] === "<" &&
              value[i + 1] === "/" &&
              value[i + 2] === "b" &&
              value[i + 3] === ">" &&
              selectionStart >= start &&
              selectionStart <= i + 3) ||
            (value[i] === "<" &&
              value[i + 1] === "/" &&
              value[i + 2] === "b" &&
              value[i + 3] === ">" &&
              selectionEnd >= start + 1 &&
              selectionEnd <= i + 4) ||
            (value[i] === "<" &&
              value[i + 1] === "/" &&
              value[i + 2] === "b" &&
              value[i + 3] === ">" &&
              selectionStart < start &&
              selectionEnd > i + 4)
          ) {
            return true;
          }
        }
        break;
      case "list":
        for (let i = 0; i < value.length; i++) {
          if (
            value[i] === "<" &&
            value[i + 1] === "l" &&
            value[i + 2] === "i" &&
            value[i + 3] === "s" &&
            value[i + 4] === "t" &&
            value[i + 5] === ">"
          ) {
            start = i;
          } else if (
            value[i] === "<" &&
            value[i + 1] === "/" &&
            value[i + 2] === "l" &&
            value[i + 3] === "i" &&
            value[i + 4] === "s" &&
            value[i + 5] === "t" &&
            value[i + 6] === ">" &&
            selectionStart >= start + 6 &&
            selectionEnd <= i
          ) {
            let selectFound = 0;
            for (let j = start + 7; j < i; j++) {
              if (
                value[j] === "<" &&
                value[j + 1] === "b" &&
                value[j + 2] === ">"
              ) {
                selectFound = j;
              } else if (
                (value[j] === "<" &&
                  value[j + 1] === "/" &&
                  value[j + 2] === "b" &&
                  value[j + 3] === ">" &&
                  selectionStart >= selectFound &&
                  selectionStart <= j + 3) ||
                (value[j] === "<" &&
                  value[j + 1] === "/" &&
                  value[j + 2] === "b" &&
                  value[j + 3] === ">" &&
                  selectionEnd >= selectFound + 1 &&
                  selectionEnd <= j + 4) ||
                (value[j] === "<" &&
                  value[j + 1] === "/" &&
                  value[j + 2] === "b" &&
                  value[j + 3] === ">" &&
                  selectionStart < selectFound &&
                  selectionEnd > j + 4)
              ) {
                return "notAllowed";
              }
              if (
                value[j] === "<" &&
                value[j + 1] === "l" &&
                value[j + 2] === "i" &&
                value[j + 3] === "n" &&
                value[j + 4] === "k" &&
                value[j + 5] === ">"
              ) {
                selectFound = j;
              } else if (
                (value[j] === "<" &&
                  value[j + 1] === "/" &&
                  value[j + 2] === "l" &&
                  value[j + 3] === "i" &&
                  value[j + 4] === "n" &&
                  value[j + 5] === "k" &&
                  value[j + 6] === ">" &&
                  selectionStart >= selectFound &&
                  selectionStart <= j + 6) ||
                (value[j] === "<" &&
                  value[j + 1] === "/" &&
                  value[j + 2] === "l" &&
                  value[j + 3] === "i" &&
                  value[j + 4] === "n" &&
                  value[j + 5] === "k" &&
                  value[j + 6] === ">" &&
                  selectionEnd >= selectFound + 1 &&
                  selectionEnd <= j + 7) ||
                (value[j] === "<" &&
                  value[j + 1] === "/" &&
                  value[j + 2] === "l" &&
                  value[j + 3] === "i" &&
                  value[j + 4] === "n" &&
                  value[j + 5] === "k" &&
                  value[j + 6] === ">" &&
                  selectionStart < selectFound &&
                  selectionEnd > j + 7)
              ) {
                return "notAllowed";
              }
            }
            return "betweenTagsSelect";
          } else if (
            (value[i] === "<" &&
              value[i + 1] === "/" &&
              value[i + 2] === "l" &&
              value[i + 3] === "i" &&
              value[i + 4] === "s" &&
              value[i + 5] === "t" &&
              value[i + 6] === ">" &&
              selectionStart >= start &&
              selectionStart <= i + 6) ||
            (value[i] === "<" &&
              value[i + 1] === "/" &&
              value[i + 2] === "l" &&
              value[i + 3] === "i" &&
              value[i + 4] === "s" &&
              value[i + 5] === "t" &&
              value[i + 6] === ">" &&
              selectionEnd >= start + 1 &&
              selectionEnd <= i + 7) ||
            (value[i] === "<" &&
              value[i + 1] === "/" &&
              value[i + 2] === "l" &&
              value[i + 3] === "i" &&
              value[i + 4] === "s" &&
              value[i + 5] === "t" &&
              value[i + 6] === ">" &&
              selectionStart < start &&
              selectionEnd > i + 7)
          ) {
            return true;
          }
        }
        break;
      case "embed":
        for (let i = 0; i < value.length; i++) {
          if (
            value[i] === "<" &&
            value[i + 1] === "e" &&
            value[i + 2] === "m" &&
            value[i + 3] === "b"
          ) {
            start = i;
          } else if (
            (value[i] === "<" &&
              value[i + 1] === "/" &&
              value[i + 2] === "e" &&
              value[i + 3] === "m" &&
              value[i + 4] === "b" &&
              selectionStart >= start + 1 &&
              selectionStart <= i + 7) ||
            (value[i] === "<" &&
              value[i + 1] === "/" &&
              value[i + 2] === "e" &&
              value[i + 3] === "m" &&
              value[i + 4] === "b" &&
              selectionEnd >= start + 1 &&
              selectionEnd <= i + 8) ||
            (value[i] === "<" &&
              value[i + 1] === "/" &&
              value[i + 2] === "e" &&
              value[i + 3] === "m" &&
              value[i + 4] === "b" &&
              selectionStart < start &&
              selectionEnd > i + 8)
          ) {
            return true;
          }
        }
        break;
      case "link":
        for (let i = 0; i < value.length; i++) {
          if (
            value[i] === "<" &&
            value[i + 1] === "l" &&
            value[i + 2] === "i" &&
            value[i + 3] === "n" &&
            value[i + 4] === "k"
          ) {
            start = i;
          } else if (
            (value[i] === "<" &&
              value[i + 1] === "/" &&
              value[i + 2] === "l" &&
              value[i + 3] === "i" &&
              value[i + 4] === "n" &&
              value[i + 6] === ">" &&
              selectionStart >= start + 1 &&
              selectionStart <= i + 6) ||
            (value[i] === "<" &&
              value[i + 1] === "/" &&
              value[i + 2] === "l" &&
              value[i + 3] === "i" &&
              value[i + 4] === "n" &&
              value[i + 6] === ">" &&
              selectionEnd >= start + 1 &&
              selectionEnd <= i + 7) ||
            (value[i] === "<" &&
              value[i + 1] === "/" &&
              value[i + 2] === "l" &&
              value[i + 3] === "i" &&
              value[i + 4] === "n" &&
              value[i + 6] === ">" &&
              selectionStart < start &&
              selectionEnd > i + 7)
          ) {
            return true;
          }
        }
        break;
    }
  };

  const handleBold = (e) => {
    // e = e || window.event;
    // e.preventDefault();
    // const str = textareaRef.current.getSelection().toString();
    // alert(typeof str);
    // const result = str.bold();
    // textareaRef.current.value = result;
    e.preventDefault(); //fixes glitchy movement behaviour in the textarea when u click on any insert tag btn
    console.log(textareaRef.current.selectionStart);
    console.log(textareaRef.current.selectionEnd);
    console.log(textareaRef.current.focus);
    if (
      document.activeElement === textareaRef.current &&
      textareaRef.current.selectionStart === textareaRef.current.selectionEnd
    ) {
      const check1 = handleInsert("bold");
      const check2 = handleInsert("embed");
      const check3 = handleInsert("link");
      const check4 = handleInsert("list");
      console.log(check1);
      console.log(check2);
      console.log(check3);
      console.log(check4);
      if (
        (!check1 && !check2 && !check3 && !check4) ||
        check4 === "betweenTags"
      ) {
        const selStart = textareaRef.current.selectionStart;
        let firstPart = textareaRef.current.value.slice(
          0,
          textareaRef.current.selectionStart
        );
        console.log(firstPart);
        firstPart = firstPart.concat("<b></b>");
        const secondPart = textareaRef.current.value.slice(
          textareaRef.current.selectionStart
        );
        firstPart = firstPart.concat(secondPart);
        textareaRef.current.value = firstPart;
        textareaRef.current.selectionEnd = selStart + 3;
      }
    } else if (
      document.activeElement === textareaRef.current &&
      textareaRef.current.selectionStart !== textareaRef.current.selectionEnd
    ) {
      const check1 = handleSelect("bold");
      const check2 = handleSelect("embed");
      const check3 = handleSelect("link");
      const check4 = handleSelect("list");
      if (
        (!check1 && !check2 && !check3 && !check4) ||
        check4 === "betweenTagsSelect"
      ) {
        const selectionStart = textareaRef.current.selectionStart;
        const selectionEnd = textareaRef.current.selectionEnd;
        let textareaText = textareaRef.current.value;
        let selectedText = textareaText.substring(selectionStart, selectionEnd);
        selectedText = selectedText.bold();
        textareaText =
          textareaText.slice(0, selectionStart) +
          selectedText +
          textareaText.slice(selectionEnd);
        textareaRef.current.value = textareaText;
        textareaRef.current.selectionEnd = selectionEnd + 3;
      } else if (check1 || check2 || check3 || check4) {
        textareaRef.current.selectionEnd = textareaRef.current.selectionStart;
      }
    }
  };

  useEffect(() => {
    if (lists && lists.length > 0) {
      console.log(lists);
    }
  }, [lists]);

  const handleList = (e) => {
    e.preventDefault();
    let curClickedList = "";
    if (e.target.tagName === "I") {
      if (e.target.className.includes("ul")) {
        curClickedList = "ul";
      } else {
        curClickedList = "ol";
      }
    } else if (e.target.id.includes("listOl")) {
      if (e.target.children[0].className.includes("ul")) {
        curClickedList = "ul";
      } else {
        curClickedList = "ol";
      }
    } else if (e.target.tagName === "LI") {
      if (e.target.children[0].className.includes("ul")) {
        curClickedList = "ul";
      } else {
        curClickedList = "ol";
      }
    }
    const posOfInsertion = seeWhichList(
      textareaRef.current.value,
      "adding",
      textareaRef.current.selectionStart
    );
    if (
      document.activeElement === textareaRef.current &&
      textareaRef.current.selectionStart === textareaRef.current.selectionEnd
    ) {
      // alert(posOfInsertion);
      const check1 = handleInsert("bold");
      const check2 = handleInsert("embed");
      const check3 = handleInsert("link");
      const check4 = handleInsert("list");
      if (!check1 && !check2 && !check3 && !check4) {
        const selStart = textareaRef.current.selectionStart;
        let firstPart = textareaRef.current.value.slice(
          0,
          textareaRef.current.selectionStart
        );
        console.log(firstPart);
        firstPart = firstPart.concat("<list></list>");
        const secondPart = textareaRef.current.value.slice(
          textareaRef.current.selectionStart
        );
        firstPart = firstPart.concat(secondPart);
        textareaRef.current.value = firstPart;
        textareaRef.current.selectionEnd = selStart + 6;
        setLists((old) => {
          console.log(e.target);
          // if (e.target.tagName === "I") {
          //   alert(e.target.className);
          // } else if (e.target.id.includes("listOl")) {
          //   alert(e.target.children[0].className);
          // }
          let oldArr = [...old];
          // alert(currentList);
          // alert(typeof currentList);
          // oldArr.push(curClickedList);
          console.log(oldArr);
          oldArr.splice(posOfInsertion, 0, curClickedList);
          console.log(oldArr);
          return oldArr;
        });
      }
    } else if (
      document.activeElement === textareaRef.current &&
      textareaRef.current.selectionStart !== textareaRef.current.selectionEnd
    ) {
      const check1 = handleSelect("bold");
      const check2 = handleSelect("embed");
      const check3 = handleSelect("link");
      const check4 = handleSelect("list");
      if (!check1 && !check2 && !check3 && !check4) {
        const selectionStart = textareaRef.current.selectionStart;
        const selectionEnd = textareaRef.current.selectionEnd;
        let textareaText = textareaRef.current.value;
        let selectedText = textareaText.substring(selectionStart, selectionEnd);
        selectedText = `<list>${selectedText}</list>`;
        textareaText =
          textareaText.slice(0, selectionStart) +
          selectedText +
          textareaText.slice(selectionEnd);
        textareaRef.current.value = textareaText;
        textareaRef.current.selectionEnd = selectionEnd + 6;
        setLists((old) => {
          console.log(e.target);
          let oldArr = [...old];
          oldArr.splice(posOfInsertion, 0, curClickedList);
          return oldArr;
        });
      } else if (check1 || check2 || check3 || check4) {
        textareaRef.current.selectionEnd = textareaRef.current.selectionStart;
      }
    }
  };

  const handleEmbed = (e) => {
    e.preventDefault();
    if (
      document.activeElement === textareaRef.current &&
      textareaRef.current.selectionStart === textareaRef.current.selectionEnd
    ) {
      const check = handleInsert("bold");
      const check1 = handleInsert("embed");
      const check2 = handleInsert("link");
      const check3 = handleInsert("list");
      if (!check && !check1 && !check2 && !check3) {
        const selStart = textareaRef.current.selectionStart;
        let firstPart = textareaRef.current.value.slice(
          0,
          textareaRef.current.selectionStart
        );
        console.log(firstPart);
        firstPart = firstPart.concat("<embed></embed>");
        const secondPart = textareaRef.current.value.slice(
          textareaRef.current.selectionStart
        );
        firstPart = firstPart.concat(secondPart);
        textareaRef.current.value = firstPart;
        textareaRef.current.selectionEnd = selStart + 7;
        setTimeout(() => {
          textareaRef.current.focus();
        }, 1);
      } else if (check || check1 || check2 || check3) {
        alert("hey");
        // alert(`check1${check1}`);
        // alert(`check2${check2}`);
        setTimeout(() => {
          textareaRef.current.focus();
          textareaRef.current.selectionEnd = textareaRef.current.selectionStart;
        }, 1);
      }
    } //NOW SELECTING
    else if (
      document.activeElement === textareaRef.current &&
      textareaRef.current.selectionStart !== textareaRef.current.selectionEnd
    ) {
      const selectionStart = textareaRef.current.selectionStart;
      const selectionEnd = textareaRef.current.selectionEnd;
      const check1 = handleSelect("bold");
      const check2 = handleSelect("embed");
      const check3 = handleSelect("link");
      const check4 = handleSelect("list");
      if (!check1 && !check2 && !check3 && !check4) {
        let textareaText = textareaRef.current.value;
        let selectedText = textareaText.substring(selectionStart, selectionEnd);
        selectedText = `<embed>${selectedText}</embed>`;
        console.log(selectedText);
        textareaText =
          textareaText.slice(0, selectionStart) +
          selectedText +
          textareaText.slice(selectionEnd);
        textareaRef.current.value = textareaText;
        textareaRef.current.selectionEnd = selectionEnd + 7;
        setTimeout(() => {
          textareaRef.current.focus();
        }, 1);
      } else if (check1 || check2 || check3 || check4) {
        setTimeout(() => {
          textareaRef.current.focus();
          textareaRef.current.selectionEnd = selectionStart;
        }, 1);
      }
    }
  };

  const handleLink = (e) => {
    e.preventDefault();
    if (
      document.activeElement === textareaRef.current &&
      textareaRef.current.selectionStart === textareaRef.current.selectionEnd
    ) {
      const check1 = handleInsert("bold");
      const check2 = handleInsert("embed");
      const check3 = handleInsert("link");
      const check4 = handleInsert("list");
      if (
        (!check1 && !check2 && !check3 && !check4) ||
        check4 === "betweenTags"
      ) {
        const selStart = textareaRef.current.selectionStart;
        let firstPart = textareaRef.current.value.slice(
          0,
          textareaRef.current.selectionStart
        );
        console.log(firstPart);
        firstPart = firstPart.concat("<link></link>");
        const secondPart = textareaRef.current.value.slice(
          textareaRef.current.selectionStart
        );
        firstPart = firstPart.concat(secondPart);
        textareaRef.current.value = firstPart;
        textareaRef.current.selectionEnd = selStart + 6;
        setTimeout(() => {
          textareaRef.current.focus();
        }, 1);
      } else if (check1 || check2 || check3 || check4) {
        setTimeout(() => {
          textareaRef.current.focus();
          textareaRef.current.selectionEnd = textareaRef.current.selectionStart;
        }, 1);
      }
    } else if (
      document.activeElement === textareaRef.current &&
      textareaRef.current.selectionStart !== textareaRef.current.selectionEnd
    ) {
      const check1 = handleSelect("bold");
      const check2 = handleSelect("embed");
      const check3 = handleSelect("link");
      const check4 = handleSelect("list");
      if (
        (!check1 && !check2 && !check3 && !check4) ||
        check4 === "betweenTagsSelect"
      ) {
        const selectionStart = textareaRef.current.selectionStart;
        const selectionEnd = textareaRef.current.selectionEnd;
        let textareaText = textareaRef.current.value;
        let selectedText = textareaText.substring(selectionStart, selectionEnd);
        selectedText = `<link>${selectedText}</link>`;
        textareaText =
          textareaText.slice(0, selectionStart) +
          selectedText +
          textareaText.slice(selectionEnd);
        textareaRef.current.value = textareaText;
        textareaRef.current.selectionEnd = selectionEnd + 6;
        setTimeout(() => {
          textareaRef.current.focus();
        }, 1);
      } else if (check1 || check2 || check3 || check4) {
        setTimeout(() => {
          textareaRef.current.focus();
          textareaRef.current.selectionEnd = textareaRef.current.selectionStart;
        }, 1);
      }
    }
  };

  const handleEnter = (e) => {
    // console.log(e.target.value);
    // console.log(e.target.value.split(''));
    const { value } = textareaRef.current;
    const slStart = textareaRef.current.selectionStart;
    const slEnd = textareaRef.current.selectionEnd;
    let enterPosFind = null;
    let insideList = false;
    let enterPos = 0;
    if (e.keyCode === 13) {
      for (let i = 0; i < value.length; i++) {
        if (
          value[i] === "<" &&
          value[i + 1] === "b" &&
          value[i + 2] === ">" &&
          !insideList
        ) {
          enterPosFind = i;
        } else if (
          value[i] === "<" &&
          value[i + 1] === "/" &&
          value[i + 2] === "b" &&
          value[i + 3] === ">"
        ) {
          if (slStart <= i + 3 && slStart > enterPosFind) {
            textareaRef.current.readOnly = true;
            setTimeout(() => {
              textareaRef.current.readOnly = false;
            }, 100);
            enterPosFind = 0;
            return;
          }
        }
        if (
          value[i] === "<" &&
          value[i + 1] === "l" &&
          value[i + 2] === "i" &&
          value[i + 3] === "s" &&
          value[i + 4] === "t" &&
          value[i + 5] === ">"
        ) {
          enterPosFind = i;
          insideList = true;
        } else if (
          value[i] === "<" &&
          value[i + 1] === "/" &&
          value[i + 2] === "l" &&
          value[i + 3] === "i" &&
          value[i + 4] === "s" &&
          value[i + 5] === "t" &&
          value[i + 6] === ">"
        ) {
          if (slStart <= i + 6 && slStart > enterPosFind) {
            textareaRef.current.readOnly = true;
            setTimeout(() => {
              textareaRef.current.readOnly = false;
            }, 100);
            enterPosFind = 0;
            return;
          }
          insideList = false;
        }
        if (
          value[i] === "<" &&
          value[i + 1] === "e" &&
          value[i + 2] === "m" &&
          value[i + 3] === "b" &&
          value[i + 4] === "e" &&
          value[i + 5] === "d" &&
          value[i + 6] === ">"
        ) {
          enterPosFind = i;
        } else if (
          value[i] === "<" &&
          value[i + 1] === "/" &&
          value[i + 2] === "e" &&
          value[i + 3] === "m" &&
          value[i + 4] === "b" &&
          value[i + 5] === "e" &&
          value[i + 6] === "d" &&
          value[i + 7] === ">"
        ) {
          if (slStart <= i + 7 && slStart > enterPosFind) {
            textareaRef.current.readOnly = true;
            setTimeout(() => {
              textareaRef.current.readOnly = false;
            }, 100);
            enterPosFind = 0;
            return;
          }
        }
        if (
          value[i] === "<" &&
          value[i + 1] === "l" &&
          value[i + 2] === "i" &&
          value[i + 3] === "n" &&
          value[i + 4] === "k" &&
          value[i + 5] === ">" &&
          !insideList
          //handle link/b tags inside list
        ) {
          enterPosFind = i;
          insideList = true;
        } else if (
          value[i] === "<" &&
          value[i + 1] === "/" &&
          value[i + 2] === "l" &&
          value[i + 3] === "i" &&
          value[i + 4] === "n" &&
          value[i + 5] === "k" &&
          value[i + 6] === ">"
        ) {
          if (slStart <= i + 6 && slStart > enterPosFind) {
            textareaRef.current.readOnly = true;
            setTimeout(() => {
              textareaRef.current.readOnly = false;
            }, 100);
            enterPosFind = 0;
            return;
          }
          insideList = false;
        }
      }
    }
    if (
      e.keyCode !== 46 &&
      e.keyCode !== 37 &&
      e.keyCode !== 38 &&
      e.keyCode !== 39 &&
      e.keyCode !== 40 &&
      e.keyCode !== 35 &&
      e.keyCode !== 36
    ) {
      for (let i = 0; i < value.length; i++) {
        if (
          (value[i] === "<" &&
            value[i + 1] === "b" &&
            value[i + 2] === ">" &&
            slStart < [i + 3] &&
            slStart >= [i + 1]) ||
          (value[i] === "<" &&
            value[i + 1] === "/" &&
            value[i + 2] === "b" &&
            value[i + 3] === ">" &&
            slStart < [i + 4] &&
            slStart >= [i + 1])
        ) {
          textareaRef.current.readOnly = true;
          setTimeout(() => {
            textareaRef.current.readOnly = false;
          }, 100);
        } else if (
          (value[i] === "<" &&
            value[i + 1] === "l" &&
            value[i + 2] === "i" &&
            value[i + 3] === "s" &&
            value[i + 4] === "t" &&
            value[i + 5] === ">" &&
            slStart < [i + 6] &&
            slStart >= [i + 1]) ||
          (value[i] === "<" &&
            value[i + 1] === "/" &&
            value[i + 2] === "l" &&
            value[i + 3] === "i" &&
            value[i + 4] === "s" &&
            value[i + 5] === "t" &&
            value[i + 6] === ">" &&
            slStart < [i + 7] &&
            slStart >= [i + 1])
        ) {
          textareaRef.current.readOnly = true;
          setTimeout(() => {
            textareaRef.current.readOnly = false;
          }, 100);
        } else if (
          (value[i] === "<" &&
            value[i + 1] === "e" &&
            value[i + 2] === "m" &&
            value[i + 3] === "b" &&
            value[i + 4] === "e" &&
            value[i + 5] === "d" &&
            value[i + 6] === ">" &&
            slStart < [i + 7] &&
            slStart >= [i + 1]) ||
          (value[i] === "<" &&
            value[i + 1] === "/" &&
            value[i + 2] === "e" &&
            value[i + 3] === "m" &&
            value[i + 4] === "b" &&
            value[i + 5] === "e" &&
            value[i + 6] === "d" &&
            value[i + 7] === ">" &&
            slStart < [i + 8] &&
            slStart >= [i + 1])
        ) {
          textareaRef.current.readOnly = true;
          setTimeout(() => {
            textareaRef.current.readOnly = false;
          }, 100);
        } else if (
          (value[i] === "<" &&
            value[i + 1] === "l" &&
            value[i + 2] === "i" &&
            value[i + 3] === "n" &&
            value[i + 4] === "k" &&
            value[i + 5] === ">" &&
            slStart < [i + 6] &&
            slStart >= [i + 1]) ||
          (value[i] === "<" &&
            value[i + 1] === "/" &&
            value[i + 2] === "l" &&
            value[i + 3] === "i" &&
            value[i + 4] === "n" &&
            value[i + 5] === "k" &&
            value[i + 6] === ">" &&
            slStart < [i + 7] &&
            slStart >= [i + 1])
        ) {
          textareaRef.current.readOnly = true;
          setTimeout(() => {
            textareaRef.current.readOnly = false;
          }, 100);
        }
      }
    } else if (e.keyCode === 46) {
      let startStart = 0;
      let startEnd = 0;
      let listCount = 0;
      let num = undefined;
      let endStart = 0;
      let endEnd = 0;
      const ret = seeWhichList(value, "deleting", slStart);
      console.log(ret);
      alert(ret);
      for (let i = 0; i < value.length; i++) {
        if (
          (value[i] === "<" &&
            value[i + 1] === "b" &&
            value[i + 2] === ">" &&
            slStart === i &&
            slEnd === i) ||
          (value[i] === "<" &&
            value[i + 1] === "/" &&
            value[i + 2] === "b" &&
            value[i + 3] === ">" &&
            slStart === i &&
            slEnd === i)
        ) {
          textareaRef.current.readOnly = true;
          setTimeout(() => {
            textareaRef.current.readOnly = false;
          }, 100);
          break;
        } else if (
          (value[i] === "<" &&
            value[i + 1] === "e" &&
            value[i + 2] === "m" &&
            value[i + 3] === "b" &&
            value[i + 4] === "e" &&
            value[i + 5] === "d" &&
            value[i + 6] === ">" &&
            slStart === i &&
            slEnd === i) ||
          (value[i] === "<" &&
            value[i + 1] === "/" &&
            value[i + 2] === "e" &&
            value[i + 3] === "m" &&
            value[i + 4] === "b" &&
            value[i + 5] === "e" &&
            value[i + 6] === "d" &&
            value[i + 7] === ">" &&
            slStart === i &&
            slEnd === i)
        ) {
          textareaRef.current.readOnly = true;
          setTimeout(() => {
            textareaRef.current.readOnly = false;
          }, 100);
          break;
        } else if (
          (value[i] === "<" &&
            value[i + 1] === "l" &&
            value[i + 2] === "i" &&
            value[i + 3] === "n" &&
            value[i + 4] === "k" &&
            value[i + 5] === ">" &&
            slStart === i &&
            slEnd === i) ||
          (value[i] === "<" &&
            value[i + 1] === "/" &&
            value[i + 2] === "l" &&
            value[i + 3] === "i" &&
            value[i + 4] === "n" &&
            value[i + 5] === "k" &&
            value[i + 6] === ">" &&
            slStart === i &&
            slEnd === i)
        ) {
          textareaRef.current.readOnly = true;
          setTimeout(() => {
            textareaRef.current.readOnly = false;
          }, 100);
          break;
        } else if (
          (value[i] === "<" &&
            value[i + 1] === "l" &&
            value[i + 2] === "i" &&
            value[i + 3] === "s" &&
            value[i + 4] === "t" &&
            value[i + 5] === ">" &&
            slStart === i &&
            slEnd === i) ||
          (value[i] === "<" &&
            value[i + 1] === "/" &&
            value[i + 2] === "l" &&
            value[i + 3] === "i" &&
            value[i + 4] === "s" &&
            value[i + 5] === "t" &&
            value[i + 6] === ">" &&
            slStart === i &&
            slEnd === i)
        ) {
          textareaRef.current.readOnly = true;
          setTimeout(() => {
            textareaRef.current.readOnly = false;
          }, 100);
          break;
        } else if (
          value[i] === "<" &&
          value[i + 1] === "b" &&
          value[i + 2] === ">" &&
          slStart < [i + 3] &&
          slStart >= [i]
        ) {
          startStart = i;
          startEnd = i + 3;
          const copyTxt1 = textareaRef.current.value.split("");
          const copyTxt2 = textareaRef.current.value.split("");
          const copyTxt3 = textareaRef.current.value.split("");
          for (let j = i; j < value.length; j++) {
            if (
              value[j] === "<" &&
              value[j + 1] === "/" &&
              value[j + 2] === "b" &&
              value[j + 3] === ">"
            ) {
              const slice = copyTxt1.splice(0, startStart);
              const slice2 = copyTxt2.slice(startEnd, j);
              const slice3 = copyTxt3.splice(j + 4);
              console.log(slice);
              console.log(slice2);
              console.log(slice3);
              let newStr = [slice.join(""), slice2.join(""), slice3.join("")];
              newStr = newStr.join("");
              // console.log(newStr);
              textareaRef.current.value = newStr;

              break;
            }
          }

          textareaRef.current.readOnly = true;
          setTimeout(() => {
            textareaRef.current.readOnly = false;
          }, 100);
        } else if (
          value[i] === "<" &&
          value[i + 1] === "/" &&
          value[i + 2] === "b" &&
          value[i + 3] === ">" &&
          slStart < [i + 4] &&
          slStart >= [i + 1]
        ) {
          startStart = i;
          startEnd = i + 3;
          const copyTxt1 = textareaRef.current.value.split("");
          const copyTxt2 = textareaRef.current.value.split("");
          const copyTxt3 = textareaRef.current.value.split("");
          for (let j = i; j >= 0; j--) {
            if (
              value[j] === "<" &&
              value[j + 1] === "b" &&
              value[j + 2] === ">"
            ) {
              const slice = copyTxt1.splice(0, j);
              const slice2 = copyTxt2.slice(j + 3, startStart);
              const slice3 = copyTxt3.splice(startStart + 4);
              console.log(slice);
              console.log(slice2);
              console.log(slice3);
              let newStr = [slice.join(""), slice2.join(""), slice3.join("")];
              newStr = newStr.join("");
              // console.log(newStr);
              textareaRef.current.value = newStr;

              break;
            }
          }
          textareaRef.current.readOnly = true;
          setTimeout(() => {
            textareaRef.current.readOnly = false;
          }, 100);
        } else if (
          value[i] === "<" &&
          value[i + 1] === "e" &&
          value[i + 2] === "m" &&
          value[i + 3] === "b" &&
          value[i + 4] === "e" &&
          value[i + 5] === "d" &&
          value[i + 6] === ">" &&
          slStart < [i + 7] &&
          slStart >= [i]
          // (value[i] === '<' &&
          //   value[i + 1] === '/' &&
          //   value[i + 2] === 'e' &&
          //   value[i + 3] === 'm' &&
          //   value[i + 4] === 'b' &&
          //   value[i + 5] === 'e' &&
          //   value[i + 6] === 'd' &&
          //   value[i + 7] === '>' &&
          //   slStart < [i + 8] &&
          //   slStart >= [i + 1])
        ) {
          startStart = i;
          startEnd = i + 7;
          const copyTxt1 = textareaRef.current.value.split("");
          const copyTxt2 = textareaRef.current.value.split("");
          const copyTxt3 = textareaRef.current.value.split("");
          for (let j = i; j < value.length; j++) {
            if (
              value[j] === "<" &&
              value[j + 1] === "/" &&
              value[j + 2] === "e" &&
              value[j + 3] === "m" &&
              value[j + 4] === "b" &&
              value[j + 5] === "e" &&
              value[j + 6] === "d" &&
              value[j + 7] === ">"
            ) {
              const slice = copyTxt1.splice(0, startStart);
              const slice2 = copyTxt2.slice(startEnd, j);
              const slice3 = copyTxt3.splice(j + 8);
              // console.log(slice);
              // console.log(slice2);
              // console.log(slice3);
              let newStr = [slice.join(""), slice2.join(""), slice3.join("")];
              newStr = newStr.join("");
              // console.log(newStr);
              textareaRef.current.value = newStr;
              break;
            }
          }
          textareaRef.current.readOnly = true;
          setTimeout(() => {
            textareaRef.current.readOnly = false;
          }, 100);
        } else if (
          value[i] === "<" &&
          value[i + 1] === "/" &&
          value[i + 2] === "e" &&
          value[i + 3] === "m" &&
          value[i + 4] === "b" &&
          value[i + 5] === "e" &&
          value[i + 6] === "d" &&
          value[i + 7] === ">" &&
          slStart < [i + 8] &&
          slStart >= [i + 1]
        ) {
          startStart = i;
          startEnd = i + 3;
          const copyTxt1 = textareaRef.current.value.split("");
          const copyTxt2 = textareaRef.current.value.split("");
          const copyTxt3 = textareaRef.current.value.split("");
          for (let j = i; j >= 0; j--) {
            if (
              value[j] === "<" &&
              value[j + 1] === "e" &&
              value[j + 2] === "m" &&
              value[j + 3] === "b" &&
              value[j + 4] === "e" &&
              value[j + 5] === "d" &&
              value[j + 6] === ">"
            ) {
              const slice = copyTxt1.splice(0, j);
              const slice2 = copyTxt2.slice(j + 7, startStart);
              const slice3 = copyTxt3.splice(startStart + 8);
              console.log(slice);
              console.log(slice2);
              console.log(slice3);
              let newStr = [slice.join(""), slice2.join(""), slice3.join("")];
              newStr = newStr.join("");
              // console.log(newStr);
              textareaRef.current.value = newStr;

              break;
            }
          }
          textareaRef.current.readOnly = true;
          setTimeout(() => {
            textareaRef.current.readOnly = false;
          }, 100);
        } else if (
          value[i] === "<" &&
          value[i + 1] === "l" &&
          value[i + 2] === "i" &&
          value[i + 3] === "n" &&
          value[i + 4] === "k" &&
          value[i + 5] === ">" &&
          slStart < [i + 6] &&
          slStart >= [i]
          // (value[i] === '<' &&
          //   value[i + 1] === '/' &&
          //   value[i + 2] === 'l' &&
          //   value[i + 3] === 'i' &&
          //   value[i + 4] === 'n' &&
          //   value[i + 5] === 'k' &&
          //   value[i + 6] === '>' &&
          //   slStart < [i + 7] &&
          //   slStart >= [i + 1])
        ) {
          startStart = i;
          startEnd = i + 6;
          const copyTxt1 = textareaRef.current.value.split("");
          const copyTxt2 = textareaRef.current.value.split("");
          const copyTxt3 = textareaRef.current.value.split("");
          for (let j = i; j < value.length; j++) {
            if (
              value[j] === "<" &&
              value[j + 1] === "/" &&
              value[j + 2] === "l" &&
              value[j + 3] === "i" &&
              value[j + 4] === "n" &&
              value[j + 5] === "k" &&
              value[j + 6] === ">"
            ) {
              const slice = copyTxt1.splice(0, startStart);
              const slice2 = copyTxt2.slice(startEnd, j);
              const slice3 = copyTxt3.splice(j + 7);
              // console.log(slice);
              // console.log(slice2);
              // console.log(slice3);
              let newStr = [slice.join(""), slice2.join(""), slice3.join("")];
              newStr = newStr.join("");
              // console.log(newStr);
              textareaRef.current.value = newStr;
              break;
            }
          }
          textareaRef.current.readOnly = true;
          setTimeout(() => {
            textareaRef.current.readOnly = false;
          }, 100);
        } else if (
          value[i] === "<" &&
          value[i + 1] === "/" &&
          value[i + 2] === "l" &&
          value[i + 3] === "i" &&
          value[i + 4] === "n" &&
          value[i + 5] === "k" &&
          value[i + 6] === ">" &&
          slStart < [i + 7] &&
          slStart >= [i + 1]
        ) {
          startStart = i;
          startEnd = i + 3;
          const copyTxt1 = textareaRef.current.value.split("");
          const copyTxt2 = textareaRef.current.value.split("");
          const copyTxt3 = textareaRef.current.value.split("");
          for (let j = i; j >= 0; j--) {
            if (
              value[j] === "<" &&
              value[j + 1] === "l" &&
              value[j + 2] === "i" &&
              value[j + 3] === "n" &&
              value[j + 4] === "k" &&
              value[j + 5] === ">"
            ) {
              const slice = copyTxt1.splice(0, j);
              const slice2 = copyTxt2.slice(j + 6, startStart);
              const slice3 = copyTxt3.splice(startStart + 7);
              console.log(slice);
              console.log(slice2);
              console.log(slice3);
              let newStr = [slice.join(""), slice2.join(""), slice3.join("")];
              newStr = newStr.join("");
              // console.log(newStr);
              textareaRef.current.value = newStr;

              break;
            }
          }
          textareaRef.current.readOnly = true;
          setTimeout(() => {
            textareaRef.current.readOnly = false;
          }, 100);
        } else if (
          value[i] === "<" &&
          value[i + 1] === "l" &&
          value[i + 2] === "i" &&
          value[i + 3] === "s" &&
          value[i + 4] === "t" &&
          value[i + 5] === ">" &&
          slStart < [i + 6] &&
          slStart >= [i]
        ) {
          startStart = i;
          startEnd = i + 6;
          const copyTxt1 = textareaRef.current.value.split("");
          const copyTxt2 = textareaRef.current.value.split("");
          const copyTxt3 = textareaRef.current.value.split("");
          for (let k = 0; k < i; k++) {
            if (
              value[k] === "<" &&
              value[k + 1] === "l" &&
              value[k + 2] === "i" &&
              value[k + 3] === "s" &&
              value[k + 4] === "t" &&
              value[k + 5] === ">"
            ) {
              listCount++;
            }
          }
          for (let j = i; j < value.length; j++) {
            if (
              value[j] === "<" &&
              value[j + 1] === "/" &&
              value[j + 2] === "l" &&
              value[j + 3] === "i" &&
              value[j + 4] === "s" &&
              value[j + 5] === "t" &&
              value[j + 6] === ">"
            ) {
              const slice = copyTxt1.splice(0, startStart);
              const slice2 = copyTxt2.slice(startEnd, j);
              const slice3 = copyTxt3.splice(j + 7);
              // console.log(slice);
              // console.log(slice2);
              // console.log(slice3);
              let newStr = [slice.join(""), slice2.join(""), slice3.join("")];
              newStr = newStr.join("");
              // alert(listCount);
              setTimeout(() => {
                setLists((old) => {
                  let oldArr = [...old];
                  oldArr.splice(listCount, 1);
                  return oldArr;
                });
                listCount = 0;
              }, 10);
              // console.log(newStr);
              textareaRef.current.value = newStr;
              break;
            }
          }
          textareaRef.current.readOnly = true;
          setTimeout(() => {
            textareaRef.current.readOnly = false;
          }, 100);
        } else if (
          value[i] === "<" &&
          value[i + 1] === "/" &&
          value[i + 2] === "l" &&
          value[i + 3] === "i" &&
          value[i + 4] === "s" &&
          value[i + 5] === "t" &&
          value[i + 6] === ">" &&
          slStart < [i + 7] &&
          slStart >= [i + 1]
        ) {
          startStart = i;
          startEnd = i + 3;
          const copyTxt1 = textareaRef.current.value.split("");
          const copyTxt2 = textareaRef.current.value.split("");
          const copyTxt3 = textareaRef.current.value.split("");
          for (let k = 0; k < i; k++) {
            if (
              value[k] === "<" &&
              value[k + 1] === "/" &&
              value[k + 2] === "l" &&
              value[k + 3] === "i" &&
              value[k + 4] === "s" &&
              value[k + 5] === "t" &&
              value[k + 6] === ">"
            ) {
              listCount++;
            }
          }
          for (let j = i; j >= 0; j--) {
            if (
              value[j] === "<" &&
              value[j + 1] === "l" &&
              value[j + 2] === "i" &&
              value[j + 3] === "s" &&
              value[j + 4] === "t" &&
              value[j + 5] === ">"
            ) {
              const slice = copyTxt1.splice(0, j);
              const slice2 = copyTxt2.slice(j + 6, startStart);
              const slice3 = copyTxt3.splice(startStart + 7);
              console.log(slice);
              console.log(slice2);
              console.log(slice3);
              let newStr = [slice.join(""), slice2.join(""), slice3.join("")];
              newStr = newStr.join("");
              // console.log(newStr);
              alert(listCount);
              setTimeout(() => {
                setLists((old) => {
                  let oldArr = [...old];
                  oldArr.splice(listCount, 1);
                  return oldArr;
                });
                listCount = 0;
              }, 10);
              textareaRef.current.value = newStr;

              break;
            }
          }
          textareaRef.current.readOnly = true;
          setTimeout(() => {
            textareaRef.current.readOnly = false;
          }, 100);
        }
      }
    }
    if (e.keyCode === 8) {
      for (let i = 0; i < value.length; i++) {
        if (
          (value[i] === "<" &&
            value[i + 1] === "b" &&
            value[i + 2] === ">" &&
            slStart === i + 3 &&
            slEnd === i + 3) ||
          (value[i] === "<" &&
            value[i + 1] === "/" &&
            value[i + 2] === "b" &&
            value[i + 3] === ">" &&
            slStart === i + 4 &&
            slEnd === i + 4)
        ) {
          textareaRef.current.readOnly = true;
          setTimeout(() => {
            textareaRef.current.readOnly = false;
          }, 100);
          break;
        } else if (
          (value[i] === "<" &&
            value[i + 1] === "e" &&
            value[i + 2] === "m" &&
            value[i + 3] === "b" &&
            value[i + 4] === "e" &&
            value[i + 5] === "d" &&
            value[i + 6] === ">" &&
            slStart === i + 7 &&
            slEnd === i + 7) ||
          (value[i] === "<" &&
            value[i + 1] === "/" &&
            value[i + 2] === "e" &&
            value[i + 3] === "m" &&
            value[i + 4] === "b" &&
            value[i + 5] === "e" &&
            value[i + 6] === "d" &&
            value[i + 7] === ">" &&
            slStart === i + 8 &&
            slEnd === i + 8)
        ) {
          textareaRef.current.readOnly = true;
          setTimeout(() => {
            textareaRef.current.readOnly = false;
          }, 100);
          break;
        } else if (
          (value[i] === "<" &&
            value[i + 1] === "l" &&
            value[i + 2] === "i" &&
            value[i + 3] === "n" &&
            value[i + 4] === "k" &&
            value[i + 5] === ">" &&
            slStart === i + 6 &&
            slEnd === i + 6) ||
          (value[i] === "<" &&
            value[i + 1] === "/" &&
            value[i + 2] === "l" &&
            value[i + 3] === "i" &&
            value[i + 4] === "n" &&
            value[i + 5] === "k" &&
            value[i + 6] === ">" &&
            slStart === i + 7 &&
            slEnd === i + 7)
        ) {
          textareaRef.current.readOnly = true;
          setTimeout(() => {
            textareaRef.current.readOnly = false;
          }, 100);
          break;
        } else if (
          (value[i] === "<" &&
            value[i + 1] === "l" &&
            value[i + 2] === "i" &&
            value[i + 3] === "s" &&
            value[i + 4] === "t" &&
            value[i + 5] === ">" &&
            slStart === i + 6 &&
            slEnd === i + 6) ||
          (value[i] === "<" &&
            value[i + 1] === "/" &&
            value[i + 2] === "l" &&
            value[i + 3] === "i" &&
            value[i + 4] === "s" &&
            value[i + 5] === "t" &&
            value[i + 6] === ">" &&
            slStart === i + 7 &&
            slEnd === i + 7)
        ) {
          textareaRef.current.readOnly = true;
          setTimeout(() => {
            textareaRef.current.readOnly = false;
          }, 100);
          break;
        }
      }
    }
    if (
      document.activeElement === textareaRef.current &&
      textareaRef.current.selectionStart !== textareaRef.current.selectionEnd
    ) {
      for (let i = 0; i < value.length; i++) {
        if (
          value[i] === "<" &&
          value[i + 1] === "b" &&
          value[i + 2] === ">" &&
          slStart > i &&
          slStart <= i + 2
        ) {
          textareaRef.current.readOnly = true;
          setTimeout(() => {
            textareaRef.current.readOnly = false;
            textareaRef.current.selectionEnd = slStart;
            textareaRef.current.selectionStart = slStart;
          }, 100);
        } else if (
          value[i] === "<" &&
          value[i + 1] === "b" &&
          value[i + 2] === ">" &&
          slEnd > i &&
          slEnd <= i + 3
        ) {
          textareaRef.current.readOnly = true;
          setTimeout(() => {
            textareaRef.current.readOnly = false;
            textareaRef.current.selectionEnd = slStart;
            textareaRef.current.selectionStart = slStart;
          }, 100);
        } else if (
          value[i] === "<" &&
          value[i + 1] === "b" &&
          value[i + 2] === ">" &&
          slStart <= i &&
          slEnd >= i + 3
        ) {
          textareaRef.current.readOnly = true;
          setTimeout(() => {
            textareaRef.current.readOnly = false;
            textareaRef.current.selectionEnd = slStart;
            textareaRef.current.selectionStart = slStart;
          }, 100);
        } else if (
          value[i] === "<" &&
          value[i + 1] === "/" &&
          value[i + 2] === "b" &&
          value[i + 3] === ">" &&
          slStart >= i &&
          slStart <= i + 3
        ) {
          textareaRef.current.readOnly = true;
          setTimeout(() => {
            textareaRef.current.readOnly = false;
            textareaRef.current.selectionEnd = slStart;
            textareaRef.current.selectionStart = slStart;
          }, 100);
        } else if (
          value[i] === "<" &&
          value[i + 1] === "/" &&
          value[i + 2] === "b" &&
          value[i + 3] === ">" &&
          slEnd > i &&
          slEnd <= i + 4
        ) {
          textareaRef.current.readOnly = true;
          setTimeout(() => {
            textareaRef.current.readOnly = false;
            textareaRef.current.selectionEnd = slStart;
            textareaRef.current.selectionStart = slStart;
          }, 100);
        } else if (
          value[i] === "<" &&
          value[i + 1] === "/" &&
          value[i + 2] === "b" &&
          value[i + 3] === ">" &&
          slStart <= i &&
          slEnd >= i + 4
        ) {
          textareaRef.current.readOnly = true;
          setTimeout(() => {
            textareaRef.current.readOnly = false;
            textareaRef.current.selectionEnd = slStart;
            textareaRef.current.selectionStart = slStart;
          }, 100);
        } else if (
          value[i] === "<" &&
          value[i + 1] === "e" &&
          value[i + 2] === "m" &&
          value[i + 3] === "b" &&
          value[i + 4] === "e" &&
          value[i + 5] === "d" &&
          value[i + 6] === ">" &&
          slStart > i &&
          slStart <= i + 6
        ) {
          textareaRef.current.readOnly = true;
          setTimeout(() => {
            textareaRef.current.readOnly = false;
            textareaRef.current.selectionEnd = slStart;
            textareaRef.current.selectionStart = slStart;
          }, 100);
        } else if (
          value[i] === "<" &&
          value[i + 1] === "e" &&
          value[i + 2] === "m" &&
          value[i + 3] === "b" &&
          value[i + 4] === "e" &&
          value[i + 5] === "d" &&
          value[i + 6] === ">" &&
          slEnd > i &&
          slEnd <= i + 7
        ) {
          textareaRef.current.readOnly = true;
          setTimeout(() => {
            textareaRef.current.readOnly = false;
            textareaRef.current.selectionEnd = slStart;
            textareaRef.current.selectionStart = slStart;
          }, 100);
        } else if (
          value[i] === "<" &&
          value[i + 1] === "e" &&
          value[i + 2] === "m" &&
          value[i + 3] === "b" &&
          value[i + 4] === "e" &&
          value[i + 5] === "d" &&
          value[i + 6] === ">" &&
          slStart <= i &&
          slEnd >= i + 7
        ) {
          textareaRef.current.readOnly = true;
          setTimeout(() => {
            textareaRef.current.readOnly = false;
            textareaRef.current.selectionEnd = slStart;
            textareaRef.current.selectionStart = slStart;
          }, 100);
        } else if (
          value[i] === "<" &&
          value[i + 1] === "/" &&
          value[i + 2] === "e" &&
          value[i + 3] === "m" &&
          value[i + 4] === "b" &&
          value[i + 5] === "e" &&
          value[i + 6] === "d" &&
          value[i + 7] === ">" &&
          slStart >= i &&
          slStart <= i + 7
        ) {
          textareaRef.current.readOnly = true;
          setTimeout(() => {
            textareaRef.current.readOnly = false;
            textareaRef.current.selectionEnd = slStart;
            textareaRef.current.selectionStart = slStart;
          }, 100);
        } else if (
          value[i] === "<" &&
          value[i + 1] === "/" &&
          value[i + 2] === "e" &&
          value[i + 3] === "m" &&
          value[i + 4] === "b" &&
          value[i + 5] === "e" &&
          value[i + 6] === "d" &&
          value[i + 7] === ">" &&
          slEnd > i &&
          slEnd <= i + 8
        ) {
          textareaRef.current.readOnly = true;
          setTimeout(() => {
            textareaRef.current.readOnly = false;
            textareaRef.current.selectionEnd = slStart;
            textareaRef.current.selectionStart = slStart;
          }, 100);
        } else if (
          value[i] === "<" &&
          value[i + 1] === "/" &&
          value[i + 2] === "e" &&
          value[i + 3] === "m" &&
          value[i + 4] === "b" &&
          value[i + 5] === "e" &&
          value[i + 6] === "d" &&
          value[i + 7] === ">" &&
          slStart <= i &&
          slEnd >= i + 8
        ) {
          textareaRef.current.readOnly = true;
          setTimeout(() => {
            textareaRef.current.readOnly = false;
            textareaRef.current.selectionEnd = slStart;
            textareaRef.current.selectionStart = slStart;
          }, 100);
        } else if (
          value[i] === "<" &&
          value[i + 1] === "l" &&
          value[i + 2] === "i" &&
          value[i + 3] === "n" &&
          value[i + 4] === "k" &&
          value[i + 5] === ">" &&
          slStart > i &&
          slStart <= i + 5
        ) {
          textareaRef.current.readOnly = true;
          setTimeout(() => {
            textareaRef.current.readOnly = false;
            textareaRef.current.selectionEnd = slStart;
            textareaRef.current.selectionStart = slStart;
          }, 100);
        } else if (
          value[i] === "<" &&
          value[i + 1] === "l" &&
          value[i + 2] === "i" &&
          value[i + 3] === "n" &&
          value[i + 4] === "k" &&
          value[i + 5] === ">" &&
          slEnd > i &&
          slEnd <= i + 6
        ) {
          textareaRef.current.readOnly = true;
          setTimeout(() => {
            textareaRef.current.readOnly = false;
            textareaRef.current.selectionEnd = slStart;
            textareaRef.current.selectionStart = slStart;
          }, 100);
        } else if (
          value[i] === "<" &&
          value[i + 1] === "l" &&
          value[i + 2] === "i" &&
          value[i + 3] === "n" &&
          value[i + 4] === "k" &&
          value[i + 5] === ">" &&
          slStart <= i &&
          slEnd >= i + 6
        ) {
          textareaRef.current.readOnly = true;
          setTimeout(() => {
            textareaRef.current.readOnly = false;
            textareaRef.current.selectionEnd = slStart;
            textareaRef.current.selectionStart = slStart;
          }, 100);
        } else if (
          value[i] === "<" &&
          value[i + 1] === "/" &&
          value[i + 2] === "l" &&
          value[i + 3] === "i" &&
          value[i + 4] === "n" &&
          value[i + 5] === "k" &&
          value[i + 6] === ">" &&
          slStart >= i &&
          slStart <= i + 6
        ) {
          textareaRef.current.readOnly = true;
          setTimeout(() => {
            textareaRef.current.readOnly = false;
            textareaRef.current.selectionEnd = slStart;
            textareaRef.current.selectionStart = slStart;
          }, 100);
        } else if (
          value[i] === "<" &&
          value[i + 1] === "/" &&
          value[i + 2] === "l" &&
          value[i + 3] === "i" &&
          value[i + 4] === "n" &&
          value[i + 5] === "k" &&
          value[i + 6] === ">" &&
          slEnd > i &&
          slEnd <= i + 7
        ) {
          textareaRef.current.readOnly = true;
          setTimeout(() => {
            textareaRef.current.readOnly = false;
            textareaRef.current.selectionEnd = slStart;
            textareaRef.current.selectionStart = slStart;
          }, 100);
        } else if (
          value[i] === "<" &&
          value[i + 1] === "/" &&
          value[i + 2] === "l" &&
          value[i + 3] === "i" &&
          value[i + 4] === "n" &&
          value[i + 5] === "k" &&
          value[i + 6] === ">" &&
          slStart <= i &&
          slEnd >= i + 7
        ) {
          textareaRef.current.readOnly = true;
          setTimeout(() => {
            textareaRef.current.readOnly = false;
            textareaRef.current.selectionEnd = slStart;
            textareaRef.current.selectionStart = slStart;
          }, 100);
        } else if (
          value[i] === "<" &&
          value[i + 1] === "l" &&
          value[i + 2] === "i" &&
          value[i + 3] === "s" &&
          value[i + 4] === "t" &&
          value[i + 5] === ">" &&
          slStart > i &&
          slStart <= i + 5
        ) {
          textareaRef.current.readOnly = true;
          setTimeout(() => {
            textareaRef.current.readOnly = false;
            textareaRef.current.selectionEnd = slStart;
            textareaRef.current.selectionStart = slStart;
          }, 100);
        } else if (
          value[i] === "<" &&
          value[i + 1] === "l" &&
          value[i + 2] === "i" &&
          value[i + 3] === "s" &&
          value[i + 4] === "t" &&
          value[i + 5] === ">" &&
          slEnd > i &&
          slEnd <= i + 6
        ) {
          textareaRef.current.readOnly = true;
          setTimeout(() => {
            textareaRef.current.readOnly = false;
            textareaRef.current.selectionEnd = slStart;
            textareaRef.current.selectionStart = slStart;
          }, 100);
        } else if (
          value[i] === "<" &&
          value[i + 1] === "l" &&
          value[i + 2] === "i" &&
          value[i + 3] === "s" &&
          value[i + 4] === "t" &&
          value[i + 5] === ">" &&
          slStart <= i &&
          slEnd >= i + 6
        ) {
          textareaRef.current.readOnly = true;
          setTimeout(() => {
            textareaRef.current.readOnly = false;
            textareaRef.current.selectionEnd = slStart;
            textareaRef.current.selectionStart = slStart;
          }, 100);
        } else if (
          value[i] === "<" &&
          value[i + 1] === "/" &&
          value[i + 2] === "l" &&
          value[i + 3] === "i" &&
          value[i + 4] === "s" &&
          value[i + 5] === "t" &&
          value[i + 6] === ">" &&
          slStart >= i &&
          slStart <= i + 6
        ) {
          textareaRef.current.readOnly = true;
          setTimeout(() => {
            textareaRef.current.readOnly = false;
            textareaRef.current.selectionEnd = slStart;
            textareaRef.current.selectionStart = slStart;
          }, 100);
        } else if (
          value[i] === "<" &&
          value[i + 1] === "/" &&
          value[i + 2] === "l" &&
          value[i + 3] === "i" &&
          value[i + 4] === "s" &&
          value[i + 5] === "t" &&
          value[i + 6] === ">" &&
          slEnd > i &&
          slEnd <= i + 7
        ) {
          textareaRef.current.readOnly = true;
          setTimeout(() => {
            textareaRef.current.readOnly = false;
            textareaRef.current.selectionEnd = slStart;
            textareaRef.current.selectionStart = slStart;
          }, 100);
        } else if (
          value[i] === "<" &&
          value[i + 1] === "/" &&
          value[i + 2] === "l" &&
          value[i + 3] === "i" &&
          value[i + 4] === "s" &&
          value[i + 5] === "t" &&
          value[i + 6] === ">" &&
          slStart <= i &&
          slEnd >= i + 7
        ) {
          textareaRef.current.readOnly = true;
          setTimeout(() => {
            textareaRef.current.readOnly = false;
            textareaRef.current.selectionEnd = slStart;
            textareaRef.current.selectionStart = slStart;
          }, 100);
        }
      }
    }
    console.log(textareaRef.current.value[textareaRef.current.selectionStart]);
    // if (
    //   textareaRef.current.value[textareaRef.current.selectionStart + 1] !==
    //   '\n'
    // ) {
    //   alert('d');
    // }
    // setSelStart({ num: textareaRef.current.selectionStart, enter: true });
  };

  const handlePaste = (e) => {
    setPaste(true);
  };

  const handleChange = (e) => {
    const strArr = e.target.value.split("");
    const selStartx = textareaRef.current.selectionStart;
    const copyArr = [...strArr];
    console.log(textareaRef.current.value[textareaRef.current.selectionStart]);
    if (paste) {
      // if (e.target.value.includes('instagram')) {
      //   const str = parse(e.target.value);
      //   console.log(str);
      // }
      for (let i = 0; i < strArr.length; i++) {
        if (
          strArr[i] === "\n" &&
          strArr[i + 1] !== "\n" &&
          strArr[i - 1] !== "\n"
        ) {
          copyArr.splice(i, 0, "\n");
        }
      }
    }
    console.log(copyArr);
    textareaRef.current.value = copyArr.join("");
    console.log(textareaRef.current.value[textareaRef.current.selectionStart]);
    // if (selStart.num < textareaRef.current.value.length && selStart.enter) {
    //   textareaRef.current.selectionEnd = selStart.num;
    // }
    if (paste) {
      setPaste(false);
    }
    // setSelStart({ num: 0, enter: false });
    // } else if (!paste) {
    //   const strArr = e.target.value.split('');
    //   const copyArr = [...strArr];
    //   for (let i = 0; i < strArr.length; i++) {
    //     if (
    //       strArr[i] === '\n' &&
    //       strArr[i + 1] !== '\n' &&
    //       strArr[i - 1] !== '\n'
    //     ) {
    //       copyArr.splice(i, 0, '\n');
    //     }
    //   }
    //   console.log(copyArr);
    //   textareaRef.current.value = copyArr.join('');
    // }
  };

  const handleImages = (e) => {
    let { files } = e.target;
    console.log(files);
    console.log(imageArray);
    if (files.length > 0) {
      let count = 0;
      const fileList = Array.from(files);
      let previewArray = [];
      console.log(fileList);
      fileList.forEach((file, i) => {
        if (!file.type.includes("image")) {
          fileList.splice(i, 1);
        }
      });
      let copyArr = [];
      let passFilter = [];
      if (imageArray.length > 0) {
        copyArr = [...imageArray];
        let check = false;
        fileList.forEach((file) => {
          imageArray.forEach((imgObj, i) => {
            if (file.name === imgObj.name) {
              check = true;
            }
            if (!check && i === imageArray.length - 1) {
              copyArr.push(file);
              check = false;
            }
            if (check && i === imageArray.length - 1) {
              check = false;
            }
          });
        });
      } else {
        copyArr = [...fileList];
      }
      copyArr.forEach((copy) => {
        previewArray.push({
          url: URL.createObjectURL(copy),
          checked: "false",
          name: copy.name,
        });
      });
      console.log(previewArray);
      console.log(copyArr);
      setImagePreview([...previewArray]);
      setImageArray(copyArr);
      e.target.value = "";
    }
  };

  useEffect(() => {
    console.log(imagePreview);
  }, [imagePreview]);
  useEffect(() => {
    console.log(imageArray);
  }, [imageArray]);

  const handleDeleteMode = () => {
    let check = false;
    for (let i = 0; i < imgCnt.current.children.length; i++) {
      if (imgCnt.current.children[i].children[1].className) {
        check = true;
      }
    }
    if (!ctx.overlay && check) {
      setDeleteMode(true);
      ctx.handleOverlay();
    }
  };

  const handleDeleteImg = (e) => {
    for (let i = 0; i < imgCnt.current.children.length; i++) {
      if (
        imgCnt.current.children[i].children[0].contains(e.target) &&
        !imgCnt.current.children[i].children[1].className
      ) {
        setImagePreview((old) => {
          let oldCopy = [...old];
          old.forEach((oldArr, ind) => {
            if (ind === i) {
              oldCopy[i].checked = "true";
            }
          });
          return oldCopy;
        });
      } else if (
        imgCnt.current.children[i].children[1].contains(e.target) &&
        imgCnt.current.children[i].children[1].className
      ) {
        setImagePreview((old) => {
          let oldCopy = [...old];
          old.forEach((oldArr, ind) => {
            if (ind === i) {
              oldCopy[i].checked = "false";
            }
          });
          return oldCopy;
        });
      }
    }
  };

  const handleConfirmDeletion = () => {
    const saveName = [];
    setImagePreview((old) => {
      let oldCopy = [];
      old.forEach((oldObj, i) => {
        if (oldObj.checked !== "true") {
          oldCopy.push(oldObj);
        } else if (oldObj.checked === "true") {
          saveName.push(oldObj.name);
        }
      });
      // console.log(oldCopy);
      // console.log(imageArray);
      // console.log(saveName);
      if (saveName.length > 0) {
        setSavedNames(saveName);
      }
      return oldCopy;
    });
  };

  useEffect(() => {
    if (savedNames.length > 0) {
      setImageArray((old) => {
        let oldCopy = [];
        let check = false;
        old.forEach((oldObj) => {
          savedNames.forEach((nameI, i) => {
            if (nameI === oldObj.name) {
              check = true;
            }
            if (i === savedNames.length - 1 && !check) {
              oldCopy.push(oldObj);
              check = false;
            }
            if (i === savedNames.length - 1 && check) {
              check = false;
            }
          });
        });
        console.log(savedNames);
        console.log(oldCopy);
        return oldCopy;
      });
    }
  }, [savedNames]);

  const handleAddTags = (e) => {
    if (e.keyCode === 13) {
      let { value } = e.target;
      if (value) {
        // value = value.split("");
        // value[0] = value[0].toUpperCase();
        // value = value.join("");
        e.target.value = "";
        if (value.includes(".")) {
          value = value.split(".");
          value = value.join("_");
        }
        setTags((old) => {
          const oldCopy = [...old];
          oldCopy.push(value);
          console.log(oldCopy);
          return oldCopy;
        });
      }
    }
  };

  const handleRemoveTag = (e) => {
    for (let i = 0; i < tagContainer.current.children.length; i++) {
      if (tagContainer.current.children[i].contains(e.target)) {
        setTags((old) => {
          const oldCopy = [...old];
          oldCopy.splice(i, 1);

          return oldCopy;
        });
      }
    }
  };

  const checkTextBeforeSubmit = (e) => {
    if (e.keyCode === 13) {
      alert("d");
    }
    // textareaRef.current.readOnly = true
  };

  const checkIfContainsPromo = (string) => {
    const str = string.toLowerCase();
    if (str.trim() === "promo" || str.trim().includes("promo ")) {
      return true;
    }
  };

  const seeWhichList = (str, mode, selStart) => {
    let occurence = 0;
    let start;
    console.log(str.length);
    console.log(selStart);
    if (mode === "deleting") {
      for (let i = 0; i < str.length; i++) {
        if (
          str[i] === "<" &&
          str[i + 1] === "l" &&
          str[i + 2] === "i" &&
          str[i + 3] === "s" &&
          str[i + 4] === "t" &&
          str[i + 5] === ">"
        ) {
          start = i;
          occurence++;
        } else if (
          str[i] === "<" &&
          str[i + 1] === "/" &&
          str[i + 2] === "l" &&
          str[i + 3] === "i" &&
          str[i + 4] === "s" &&
          str[i + 5] === "t" &&
          str[i + 6] === ">"
        ) {
          if (selStart > start && selStart <= i + 6) {
            return occurence;
          }
        }
      }
    } else {
      for (let i = 0; i < str.length; i++) {
        if (
          str[i] === "<" &&
          str[i + 1] === "l" &&
          str[i + 2] === "i" &&
          str[i + 3] === "s" &&
          str[i + 4] === "t" &&
          str[i + 5] === ">"
        ) {
          occurence++;
        }
        if (i === selStart) {
          return occurence;
        } else if (i === str.length - 1 && selStart === str.length) {
          return occurence;
        }
      }
    }
  };

  const handleUpload = () => {
    const title = titles.current.children[0].value;
    const subTitle = titles.current.children[1].value.toUpperCase();
    console.log(title);
    console.log(subTitle);
    const articleText = textareaRef.current.value.trim();
    const captionTxt = captionText.current.value.trim();
    let catSel = categorySelect.current.value;
    let subcatSel = subcategorySelect.current.value;
    const checkIfPromo = checkIfContainsPromo(subTitle);
    let promoSubTitle;
    if (checkIfPromo && subTitle.trim().length > 5) {
      promoSubTitle = subTitle.trim().split("PROMO ");
      promoSubTitle.splice(0, 1);
      promoSubTitle = promoSubTitle.join("").trim();
      console.log(promoSubTitle);
    }
    const commentChoice =
      commentsRadio.current.children[0].children[1].checked &&
      !commentsRadio.current.children[0].children[1].disabled
        ? "Da"
        : "Ne";
    console.log(imageArray);
    console.log(location.state);
    console.log(tags);
    let deletedTags = [];
    if (location.state && location.state.articleData.tags) {
      deletedTags = location.state.articleData.tags.reduce((acc, cur) => {
        if (
          !tags.some((el) =>
            el.value ? el.value === cur.value : el === cur.value
          )
        ) {
          return [...acc, cur];
        }
        return acc;
      }, []);
      console.log(deletedTags);
    }
    // alert(commentChoice);
    // console.log(lists);
    // console.log(location.state.articleData.listOrder);
    if (title && subTitle && articleText) {
      if (imageArray.length > 0 && captionTxt) {
        const articleFinished = {
          author: ctx.user.displayName,
          title: title,
          subTitle: promoSubTitle ? promoSubTitle : subTitle,
          articleText: articleText,
          category: catSel,
          subCategory: subcatSel,
          images: imageArray,
          imageText: imageCaptionTextAttach(),
          tags: tags,
          commentsAllowed: commentChoice,
          shares: [""],
          visited: (location.state && location.state.articleData.visited) || 0,
        };
        let captTxt = [];
        if (lists.length > 0) {
          articleFinished.listOrder = [...lists];
        }
        if (checkIfPromo) {
          articleFinished.sponsored = true;
        }
        if (
          location.state &&
          checkIfPromo &&
          location.state.articleData.promoId
        ) {
          //means that we wanna edit an already existing promo article and we did not change the promo status of it so we can keep the previous promoid
          articleFinished.promoId = location.state.articleData.promoId;
        }
        console.log(articleFinished.tags);
        console.log(articleFinished);
        setSending(true);
        let length = !checkIfPromo ? 1 : 2;
        console.log(length);
        // alert(length);
        auth.onAuthStateChanged((user) => {
          if (user) {
            user.getIdToken(true).then((idToken) => {
              const categoriesNoChange =
                location.state &&
                catSel === location.state.articleData.category &&
                subcatSel === location.state.articleData.subCategory;
              fetch(
                `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/articles/${catSel}/${subcatSel}${
                  categoriesNoChange ? "/-" + location.state.articleData.id : ""
                }.json?auth=${idToken}`,
                {
                  method: `${
                    !location.state
                      ? "POST"
                      : !categoriesNoChange
                      ? "POST"
                      : "PATCH"
                  }`,
                  body: JSON.stringify(articleFinished),
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              )
                .then((response) => response.json())
                .then((data) => {
                  console.log(data);
                  let id;
                  const imgUrls = [];
                  if (!location.state) {
                    id = data.name.slice(1);
                    //add art to dates in the db, for newest art, most visited, most popular
                    const d = new Date();
                    const year = d.getFullYear();
                    const month = d.getMonth() + 1;
                    const day = d.getDate();
                    fetch(
                      `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/dates/${year}/${month}/${day}.json?auth=${idToken}`,
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          id: data.name,
                          path: `${articleFinished.category}/${articleFinished.subCategory}`,
                        }),
                      }
                    );
                  } else {
                    if (categoriesNoChange) {
                      //patch
                      id = location.state.articleData.id;
                    } else {
                      //cats changed so we have a new id
                      id = data.name.slice(1);
                    }
                  }
                  // id.split('');
                  // console.log(id);
                  // id.join('');
                  console.log(id);
                  if (!articleFinished.id) {
                    //always happens, we do not init the id where we declare the var, but we do it here
                    articleFinished.id = id;
                  }
                  console.log(articleFinished);
                  let progressArray = [];
                  // console.log(image);
                  imageArray.forEach((img, i) => {
                    progressArray.push({
                      imageName: img.name,
                      percent: "",
                    });
                    console.log(
                      `images/${catSel}/${subcatSel}/-${id}/${img.name}`
                    );
                    const uploadTask = storage
                      .ref(`images/${catSel}/${subcatSel}/-${id}/${img.name}`)
                      .put(img);
                    uploadTask.on(
                      "state_changed",
                      (snapshot) => {
                        console.log(snapshot);
                        console.log(
                          `bytesTransfered: ${
                            snapshot.bytesTransferred
                          }, percent: ${Math.floor(
                            (snapshot.bytesTransferred / snapshot.totalBytes) *
                              100
                          )}% fileName: ${img.name}`
                        );

                        progressArray.forEach((arr, i) => {
                          if (arr.imageName === img.name) {
                            if (progressRef.current.children[0]) {
                              console.log(
                                progressRef.current.children[i].children[1]
                                  .children[0]
                              );
                              progressRef.current.children[
                                i
                              ].children[1].children[0].style.width = `${Math.floor(
                                (snapshot.bytesTransferred /
                                  snapshot.totalBytes) *
                                  100
                              )}%`;
                              if (
                                Math.floor(
                                  (snapshot.bytesTransferred /
                                    snapshot.totalBytes) *
                                    100
                                ) !== 0
                              ) {
                                progressRef.current.children[
                                  i
                                ].children[1].children[0].textContent = `${Math.floor(
                                  (snapshot.bytesTransferred /
                                    snapshot.totalBytes) *
                                    100
                                )}%`;
                              }

                              if (
                                Math.floor(
                                  (snapshot.bytesTransferred /
                                    snapshot.totalBytes) *
                                    100
                                ) === 100
                              ) {
                                setTimeout(() => {
                                  progressRef.current.children[
                                    i
                                  ].children[2].children[0].style.display =
                                    "inline-block";
                                }, 200);
                              }
                              // progressRef.current.children[i].children[1]
                              // .children[0]
                            }
                          }
                        });
                        setCurProgress(progressArray);
                        console.log(snapshot.totalBytes);
                        console.log(`images/${catSel}/${subcatSel}/-${id}`);
                      },
                      (error) => {
                        console.log(error);
                      },
                      () => {
                        storage
                          .ref(`images/${catSel}/${subcatSel}/-${id}`)
                          .child(img.name)
                          .getDownloadURL()
                          .then((url) => {
                            console.log(url);
                            imgUrls.push(url);
                            // let imgNames = [];
                            // imgNames.push([img.name, url]);
                            articleFinished.imageText.forEach(
                              (imgTxt, indx) => {
                                if (imgTxt.name === img.name) {
                                  captTxt[indx] = [
                                    url,
                                    imgTxt.captionText,
                                    img.name,
                                  ];
                                }
                              }
                            );
                            if (imgUrls.length === imageArray.length) {
                              articleFinished.images = [...imgUrls];
                              articleFinished.imageText = [...captTxt];
                              if (!location.state) {
                                const date = new Date();
                                const time = `${date.getFullYear()}-${
                                  date.getMonth() + 1
                                }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                                articleFinished.date = time;
                                console.log(articleFinished);
                              } else {
                                articleFinished.date =
                                  location.state.articleData.date;
                              }
                              captTxt = [];
                              const dbRef = db.ref(
                                `articles/${catSel}/${subcatSel}/-${id}`
                              );
                              const promises = [];
                              if (!location.state) {
                                //POST
                                if (articleFinished.tags.length) {
                                  for (
                                    let i = 0;
                                    i < articleFinished.tags.length;
                                    i++
                                  ) {
                                    promises.push(
                                      fetch(
                                        `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/related/${articleFinished.category}/${articleFinished.tags[i]}.json`,
                                        {
                                          method: "POST",
                                          headers: {
                                            "Content-Type": "application/json",
                                          },
                                          body: JSON.stringify({
                                            articlePath: `${articleFinished.category}/${articleFinished.subCategory}/-${id}`,
                                            thumbnail:
                                              articleFinished.imageText[0][0],
                                            title: articleFinished.title,
                                            subTitle: articleFinished.subTitle,
                                            date: articleFinished.date,
                                          }),
                                        }
                                      ).then((res) => res.json())
                                    );
                                  }
                                  const promisedData = Promise.all(promises);
                                  promisedData.then((data) => {
                                    console.log(data);
                                    const patchPromises = [];
                                    const reformattedTags = []; //tag obj with val and db id
                                    for (
                                      let i = 0;
                                      i < articleFinished.tags.length;
                                      i++
                                    ) {
                                      patchPromises.push(
                                        fetch(
                                          `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/related/${articleFinished.category}/${articleFinished.tags[i]}/${data[i].name}.json`,
                                          {
                                            method: "PATCH",
                                            headers: {
                                              "Content-Type":
                                                "application/json",
                                            },
                                            body: JSON.stringify({
                                              articlePath: `${articleFinished.category}/${articleFinished.subCategory}/-${id}`,
                                              thumbnail:
                                                articleFinished.imageText[0][0],
                                              title: articleFinished.title,
                                              subTitle:
                                                articleFinished.subTitle,
                                              date: articleFinished.date,
                                              id: data[i].name,
                                            }),
                                          }
                                        ).then((res) => res.json())
                                      );
                                      reformattedTags.push({
                                        id: data[i].name,
                                        value: articleFinished.tags[i],
                                      });
                                    }
                                    articleFinished.tags = [...reformattedTags];
                                    const promisedPatch =
                                      Promise.all(patchPromises);
                                    promisedPatch.then((data) => {
                                      if (length === 1) {
                                        dbRef
                                          .update(articleFinished)
                                          .then((res) => {
                                            dbRef
                                              .once("value")
                                              .then((snapshot) => {
                                                setArticleAdded(true);
                                              });
                                          });
                                      } else {
                                        fetch(
                                          `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/articles/Promo/${catSel}.json?auth=${idToken}`,
                                          {
                                            method: "POST",
                                            body: JSON.stringify(
                                              articleFinished
                                            ),
                                            headers: {
                                              "Content-Type":
                                                "application/json",
                                            },
                                          }
                                        )
                                          .then((res) => res.json())
                                          .then((data) => {
                                            articleFinished.promoId = data.name;
                                            dbRef
                                              .update(articleFinished)
                                              .then((res) => {
                                                dbRef
                                                  .once("value")
                                                  .then((snapshot) => {
                                                    setArticleAdded(true);
                                                  });
                                              });
                                          });
                                      }
                                    });
                                  });
                                } else {
                                  // no tags post art
                                  if (length === 1) {
                                    dbRef
                                      .update(articleFinished)
                                      .then((res) => {
                                        dbRef.once("value").then((snapshot) => {
                                          setArticleAdded(true);
                                        });
                                      });
                                  } else {
                                    fetch(
                                      `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/articles/Promo/${catSel}.json?auth=${idToken}`,
                                      {
                                        method: "POST",
                                        body: JSON.stringify(articleFinished),
                                        headers: {
                                          "Content-Type": "application/json",
                                        },
                                      }
                                    )
                                      .then((res) => res.json())
                                      .then((data) => {
                                        articleFinished.promoId = data.name;
                                        dbRef
                                          .update(articleFinished)
                                          .then((res) => {
                                            dbRef
                                              .once("value")
                                              .then((snapshot) => {
                                                setArticleAdded(true);
                                              });
                                          });
                                      });
                                  }
                                }
                              } else {
                                //PATCH
                                //newly added tag
                                const newlyAdded = [];
                                const oldTags = [];
                                if (
                                  location.state.articleData.tags &&
                                  articleFinished.tags.length
                                ) {
                                  for (
                                    let i = 0;
                                    i < articleFinished.tags.length;
                                    i++
                                  ) {
                                    if (
                                      //arr.includes, arr.some stops after 1 el is found and returns bool, filter returns arr and empty arr can still be truthy so use.length on the arr
                                      // !location.state.articleData.tags.includes(
                                      //   articleFinished.tags[i]
                                      // )
                                      !location.state.articleData.tags.some(
                                        (el) =>
                                          el.value ===
                                          (articleFinished.tags[i].value
                                            ? articleFinished.tags[i].value
                                            : articleFinished.tags[i])
                                      )
                                    ) {
                                      newlyAdded.push(articleFinished.tags[i]);
                                    } else {
                                      oldTags.push(
                                        location.state.articleData.tags.find(
                                          (el) =>
                                            el.value ===
                                            articleFinished.tags[i].value
                                        ) //find returns the first val that matches so it's faster than filter
                                      );
                                    }
                                  }
                                } else if (articleFinished.tags.length) {
                                  //zero tags before so we spread the new existing ones
                                  newlyAdded.push(
                                    ...articleFinished.tags //no need to do [...tags] that would create an array as the first value of newlyadded
                                  );
                                }

                                let changedCat;
                                if (
                                  articleFinished.category !==
                                  location.state.articleData.category
                                ) {
                                  changedCat = true;
                                }
                                let changedSubCat;
                                if (
                                  articleFinished.subCategory !==
                                  location.state.articleData.subCategory
                                ) {
                                  changedSubCat = true;
                                }

                                //find out if title,subtitle,first img(thumbnail) changed if yes add the previous tags as well and patch them
                                let checker = false;
                                if (
                                  articleFinished.title !==
                                  location.state.articleData.title
                                ) {
                                  checker = true;
                                } else if (
                                  articleFinished.subTitle !==
                                  location.state.articleData.subTitle
                                ) {
                                  checker = true;
                                } else if (
                                  articleFinished.imageText[0][0] ===
                                  location.state.articleData.imageText[0][0]
                                ) {
                                  checker = true;
                                } else if (changedCat) {
                                  checker = true;
                                } else if (changedSubCat) {
                                  checker = true;
                                }
                                if (newlyAdded.length) {
                                  console.log("butwhyman");
                                  console.log(newlyAdded);
                                  console.log(oldTags);
                                  for (let i = 0; i < newlyAdded.length; i++) {
                                    promises.push(
                                      fetch(
                                        `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/related/${articleFinished.category}/${newlyAdded[i]}.json`,
                                        {
                                          method: "POST",
                                          headers: {
                                            "Content-Type": "application/json",
                                          },
                                          body: JSON.stringify({
                                            articlePath: `${articleFinished.category}/${articleFinished.subCategory}/-${id}`,
                                            thumbnail:
                                              articleFinished.imageText[0][0],
                                            title: articleFinished.title,
                                            subTitle: articleFinished.subTitle,
                                            date: articleFinished.date,
                                          }),
                                        }
                                      ).then((res) => res.json())
                                    );
                                  }
                                }
                                if (checker && oldTags.length) {
                                  console.log("does this run");
                                  console.log(oldTags);
                                  for (let i = 0; i < oldTags.length; i++) {
                                    if (changedCat) {
                                      deletedTags.push({
                                        id: oldTags[i].id,
                                        value: oldTags[i].value,
                                      });
                                    }
                                    promises.push(
                                      fetch(
                                        `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/related/${
                                          articleFinished.category
                                        }/${oldTags[i].value}${
                                          !changedCat ? "/" + oldTags[i].id : ""
                                        }.json`,
                                        {
                                          method: `${
                                            changedCat ? "POST" : "PATCH"
                                          }`,
                                          headers: {
                                            "Content-Type": "application/json",
                                          },
                                          body: JSON.stringify({
                                            articlePath: `${articleFinished.category}/${articleFinished.subCategory}/-${id}`,
                                            thumbnail:
                                              articleFinished.imageText[0][0],
                                            title: articleFinished.title,
                                            subTitle: articleFinished.subTitle,
                                            date: articleFinished.date,
                                            id: oldTags[i].id,
                                          }),
                                        }
                                      ).then((res) => res.json())
                                    );
                                  }
                                }
                                if (deletedTags.length) {
                                  for (let i = 0; i < deletedTags.length; i++) {
                                    promises.push(
                                      fetch(
                                        `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/related/${
                                          !changedCat
                                            ? articleFinished.category
                                            : location.state.articleData
                                                .category
                                        }/${deletedTags[i].value}/${
                                          deletedTags[i].id
                                        }.json`,
                                        {
                                          method: "DELETE",
                                          headers: {
                                            "Content-Type": "application/json",
                                          },
                                        }
                                      ).then((res) => res.json())
                                    );
                                  }
                                }
                                const promisedData = Promise.all(promises);
                                promisedData.then((data) => {
                                  let reformattedTags = []; //tag obj with val and db id
                                  const promisesPatch = [];
                                  if (newlyAdded.length) {
                                    for (
                                      let i = 0;
                                      i < newlyAdded.length;
                                      i++
                                    ) {
                                      reformattedTags.push({
                                        id: data[i].name,
                                        value: newlyAdded[i],
                                      });
                                      promisesPatch.push(
                                        fetch(
                                          `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/related/${articleFinished.category}/${newlyAdded[i]}/${data[i].name}.json`,
                                          {
                                            method: "PATCH",
                                            headers: {
                                              "Content-Type":
                                                "application/json",
                                            },
                                            body: JSON.stringify({
                                              articlePath: `${articleFinished.category}/${articleFinished.subCategory}/-${id}`,
                                              thumbnail:
                                                articleFinished.imageText[0][0],
                                              title: articleFinished.title,
                                              subTitle:
                                                articleFinished.subTitle,
                                              date: articleFinished.date,
                                              id: data[i].name,
                                            }),
                                          }
                                        ).then((res) => res.json())
                                      );
                                    }
                                  }
                                  if (oldTags.length) {
                                    if (!changedCat) {
                                      reformattedTags = [
                                        ...reformattedTags,
                                        ...oldTags,
                                      ];
                                    } else {
                                      let pos = newlyAdded.length;
                                      let incr = 0;
                                      for (
                                        let i = pos;
                                        i < pos + oldTags.length;
                                        i++
                                      ) {
                                        reformattedTags.push({
                                          id: data[i].name,
                                          value: oldTags[incr].value,
                                        });
                                        promisesPatch.push(
                                          fetch(
                                            `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/related/${articleFinished.category}/${oldTags[incr].value}/${data[i].name}.json`,
                                            {
                                              method: "PATCH",
                                              headers: {
                                                "Content-Type":
                                                  "application/json",
                                              },
                                              body: JSON.stringify({
                                                articlePath: `${articleFinished.category}/${articleFinished.subCategory}/-${id}`,
                                                thumbnail:
                                                  articleFinished
                                                    .imageText[0][0],
                                                title: articleFinished.title,
                                                subTitle:
                                                  articleFinished.subTitle,
                                                date: articleFinished.date,
                                                id: data[i].name,
                                              }),
                                            }
                                          ).then((res) => res.json())
                                        );
                                        incr++;
                                      }
                                    }
                                  }
                                  //delete old article if we have changed either cat or subcat
                                  if (changedCat || changedSubCat) {
                                    console.log("zasto");
                                    promisesPatch.push(
                                      fetch(
                                        `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/articles/${location.state.articleData.category}/${location.state.articleData.subCategory}/-${location.state.articleData.id}.json`,
                                        {
                                          method: "DELETE",
                                          headers: {
                                            "Content-Type": "application/json",
                                          },
                                        }
                                      ).then((res) => res.json())
                                    );
                                  }
                                  if (
                                    deletedTags.length &&
                                    !newlyAdded.length &&
                                    !oldTags.length
                                  ) {
                                    delete articleFinished.tags;
                                  } else {
                                    articleFinished.tags = [...reformattedTags];
                                  }
                                  if (promisesPatch.length) {
                                    const promised = Promise.all(promisesPatch);
                                    promised.then((data) => {
                                      dbRef
                                        .update(articleFinished)
                                        .then((res) => {
                                          dbRef
                                            .once("value")
                                            .then((snapshot) => {
                                              if (length === 1) {
                                                if (
                                                  location.state.articleData
                                                    .sponsored &&
                                                  !articleFinished.sponsored
                                                ) {
                                                  //WAS PROMO, no longer is
                                                  fetch(
                                                    `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/articles/Promo/${location.state.articleData.category}/${location.state.articleData.promoId}.json?auth=${idToken}`,
                                                    {
                                                      method: "DELETE",
                                                      headers: {
                                                        "Content-Type":
                                                          "application/json",
                                                      },
                                                    }
                                                  )
                                                    .then((res) => res.json())
                                                    .then((data) => {
                                                      delete articleFinished.promoId;
                                                      delete articleFinished.sponsored;
                                                      dbRef
                                                        .set(articleFinished)
                                                        .then((res) => {
                                                          dbRef
                                                            .once("value")
                                                            .then(
                                                              (snapshot) => {
                                                                setArticleAdded(
                                                                  true
                                                                );
                                                              }
                                                            );
                                                        });
                                                    });
                                                } else {
                                                  setArticleAdded(true);
                                                }
                                              } else {
                                                if (
                                                  !location.state.articleData
                                                    .sponsored &&
                                                  articleFinished.sponsored
                                                ) {
                                                  //WAS NOT PROMO, NOW IS
                                                  fetch(
                                                    `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/articles/Promo/${catSel}.json?auth=${idToken}`,
                                                    {
                                                      method: "POST",
                                                      body: JSON.stringify(
                                                        articleFinished
                                                      ),
                                                      headers: {
                                                        "Content-Type":
                                                          "application/json",
                                                      },
                                                    }
                                                  )
                                                    .then((res) => res.json())
                                                    .then((data) => {
                                                      articleFinished.promoId =
                                                        data.name;
                                                      dbRef
                                                        .update(articleFinished)
                                                        .then((res) => {
                                                          dbRef
                                                            .once("value")
                                                            .then(
                                                              (snapshot) => {
                                                                setArticleAdded(
                                                                  true
                                                                );
                                                              }
                                                            );
                                                        });
                                                    });
                                                } else {
                                                  //WAS PROMO, IS PROMO NOW AS WELL
                                                  //if cat changed delete old one post new one otherwise update(put) old one
                                                  if (!changedCat) {
                                                    fetch(
                                                      `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/articles/Promo/${catSel}/${location.state.articleData.promoId}.json?auth=${idToken}`,
                                                      {
                                                        method: "PUT",
                                                        body: JSON.stringify(
                                                          articleFinished
                                                        ),
                                                        headers: {
                                                          "Content-Type":
                                                            "application/json",
                                                        },
                                                      }
                                                    )
                                                      .then((res) => res.json())
                                                      .then((data) =>
                                                        setArticleAdded(true)
                                                      );
                                                  } else {
                                                    //if only subcat changed put/update is enough as demonstrated above, if cat changed then post
                                                    const finalizePromo = [];
                                                    finalizePromo.push(
                                                      fetch(
                                                        `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/articles/Promo/${catSel}.json?auth=${idToken}`,
                                                        {
                                                          method: "POST",
                                                          body: JSON.stringify(
                                                            articleFinished
                                                          ),
                                                          headers: {
                                                            "Content-Type":
                                                              "application/json",
                                                          },
                                                        }
                                                      ).then((res) =>
                                                        res.json()
                                                      ),
                                                      fetch(
                                                        `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/articles/Promo/${location.state.articleData.category}/${location.state.articleData.promoId}.json?auth=${idToken}`,
                                                        {
                                                          method: "DELETE",
                                                          headers: {
                                                            "Content-Type":
                                                              "application/json",
                                                          },
                                                        }
                                                      ).then((res) =>
                                                        res.json()
                                                      )
                                                    );
                                                    const promisedFinalize =
                                                      Promise.all(
                                                        finalizePromo
                                                      );
                                                    promisedFinalize.then(
                                                      (data) => {
                                                        articleFinished.promoId =
                                                          data[0].name;
                                                        dbRef
                                                          .update(
                                                            articleFinished
                                                          )
                                                          .then((res) => {
                                                            dbRef
                                                              .once("value")
                                                              .then(
                                                                (snapshot) => {
                                                                  setArticleAdded(
                                                                    true
                                                                  );
                                                                }
                                                              );
                                                          });
                                                      }
                                                    );
                                                  }
                                                }
                                              }
                                            });
                                        });
                                    });
                                  } else {
                                    dbRef
                                      .update(articleFinished)
                                      .then((res) => {
                                        dbRef.once("value").then((snapshot) => {
                                          if (length === 1) {
                                            if (
                                              location.state.articleData
                                                .sponsored &&
                                              !articleFinished.sponsored
                                            ) {
                                              //WAS PROMO, no longer is
                                              fetch(
                                                `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/articles/Promo/${location.state.articleData.category}/${location.state.articleData.promoId}.json?auth=${idToken}`,
                                                {
                                                  method: "DELETE",
                                                  headers: {
                                                    "Content-Type":
                                                      "application/json",
                                                  },
                                                }
                                              )
                                                .then((res) => res.json())
                                                .then((data) => {
                                                  delete articleFinished.promoId;
                                                  delete articleFinished.sponsored;
                                                  dbRef
                                                    .set(articleFinished)
                                                    .then((res) => {
                                                      dbRef
                                                        .once("value")
                                                        .then((snapshot) => {
                                                          setArticleAdded(true);
                                                        });
                                                    });
                                                });
                                            } else {
                                              setArticleAdded(true);
                                            }
                                          } else {
                                            console.log(articleFinished);
                                            if (
                                              !location.state.articleData
                                                .sponsored &&
                                              articleFinished.sponsored
                                            ) {
                                              //WAS NOT PROMO, NOW IS
                                              fetch(
                                                `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/articles/Promo/${catSel}.json?auth=${idToken}`,
                                                {
                                                  method: "POST",
                                                  body: JSON.stringify(
                                                    articleFinished
                                                  ),
                                                  headers: {
                                                    "Content-Type":
                                                      "application/json",
                                                  },
                                                }
                                              )
                                                .then((res) => res.json())
                                                .then((data) => {
                                                  articleFinished.promoId =
                                                    data.name;
                                                  dbRef
                                                    .update(articleFinished)
                                                    .then((res) => {
                                                      dbRef
                                                        .once("value")
                                                        .then((snapshot) => {
                                                          setArticleAdded(true);
                                                        });
                                                    });
                                                });
                                            } else {
                                              //WAS PROMO, IS PROMO NOW AS WELL
                                              //if cat changed delete old one post new one otherwise update(put) old one
                                              if (!changedCat) {
                                                fetch(
                                                  `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/articles/Promo/${catSel}/${location.state.articleData.promoId}.json?auth=${idToken}`,
                                                  {
                                                    method: "PUT",
                                                    body: JSON.stringify(
                                                      articleFinished
                                                    ),
                                                    headers: {
                                                      "Content-Type":
                                                        "application/json",
                                                    },
                                                  }
                                                )
                                                  .then((res) => res.json())
                                                  .then((data) =>
                                                    setArticleAdded(true)
                                                  );
                                              } else {
                                                //if only subcat changed put/update is enough if cat changed then post
                                                const finalizePromo = [];
                                                finalizePromo.push(
                                                  fetch(
                                                    `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/articles/Promo/${catSel}.json?auth=${idToken}`,
                                                    {
                                                      method: "POST",
                                                      body: JSON.stringify(
                                                        articleFinished
                                                      ),
                                                      headers: {
                                                        "Content-Type":
                                                          "application/json",
                                                      },
                                                    }
                                                  ).then((res) => res.json()),
                                                  fetch(
                                                    `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/articles/Promo/${location.state.articleData.category}/${location.state.articleData.promoId}.json?auth=${idToken}`,
                                                    {
                                                      method: "DELETE",
                                                      headers: {
                                                        "Content-Type":
                                                          "application/json",
                                                      },
                                                    }
                                                  ).then((res) => res.json())
                                                );
                                                const promisedFinalize =
                                                  Promise.all(finalizePromo);
                                                promisedFinalize.then(
                                                  (data) => {
                                                    articleFinished.promoId =
                                                      data[0].name;
                                                    dbRef
                                                      .update(articleFinished)
                                                      .then((res) => {
                                                        dbRef
                                                          .once("value")
                                                          .then((snapshot) => {
                                                            setArticleAdded(
                                                              true
                                                            );
                                                          });
                                                      });
                                                  }
                                                );
                                              }
                                            }
                                          }
                                        });
                                      });
                                  }
                                });
                                // else if (
                                //   location.state.articleData.tags &&
                                //   !articleFinished.tags.length
                                // ) {

                                // }
                              }
                            }
                          })
                          .catch((error) => console.log(error));
                      }
                    );
                  });
                });
            });
          }
        });
      }
    }
  };

  const emptyFields = () => {
    console.log("starting");
    titles.current.children[0].value = "";
    titles.current.children[1].value = "";
    textareaRef.current.value = "";
    captionText.current.value = "";
    categorySelect.current.value = "Vijesti";
    tagContainer.current.previousSibling.value = "";
    commentsRadio.current.children[0].children[1].disabled = false;
    commentsRadio.current.children[1].children[1].disabled = false;
    commentsRadio.current.children[0].children[1].checked = true;
    setSubcategoriesMap(subcategories.vijesti);
    setImageArray([]);
    setImagePreview([]);
    setTags([]);
    setArticleAdded(false);
    setCurProgress([]);
  };

  useEffect(() => {
    if (didMountRef.current) {
      if (!sending) {
        emptyFields();
      }
    } else {
      didMountRef.current = true;
      if (!location.state) {
        setSubcategoriesMap([...subcategories.vijesti]);
      }
    }
  }, [sending]);

  const handleCloseOverlay = (e) => {
    if (
      (sendArticleOverlay.current.contains(e.target) &&
        !progressRef.current.contains(e.target) &&
        articleAdded) ||
      (progressRef.current.children[0] &&
        progressRef.current.children[0].children[1].contains(e.target) &&
        articleAdded)
    ) {
      setSending(false);
      if (location.state) {
        window.history.replaceState(null, "");
        history.replace("/editarticles");
      }
      // emptyFields();
    }
  };

  const handleIfPromo = (e) => {
    const { value } = e.target;
    if (value.length === 0) {
      commentsRadio.current.children[0].children[1].disabled = false;
      commentsRadio.current.children[1].children[1].disabled = false;
      commentsRadio.current.children[0].children[1].checked = true;
    }
    if (value) {
      const contains = checkIfContainsPromo(value);
      if (contains) {
        commentsRadio.current.children[0].children[1].disabled = true;
        commentsRadio.current.children[1].children[1].disabled = true;
      } else {
        commentsRadio.current.children[0].children[1].disabled = false;
        commentsRadio.current.children[1].children[1].disabled = false;
      }
    }
  };

  const handleCategoryChange = (e) => {
    const { value } = e.target;
    switch (value) {
      case "Vijesti":
        setSubcategoriesMap([...subcategories.vijesti]);
        break;
      case "Biznis":
        setSubcategoriesMap([...subcategories.biznis]);
        break;
      case "Sport":
        setSubcategoriesMap([...subcategories.sport]);
        break;
      case "Magazin":
        setSubcategoriesMap([...subcategories.magazin]);
        break;
      case "Lifestyle":
        setSubcategoriesMap([...subcategories.lifestyle]);
        break;
      case "Scitech":
        setSubcategoriesMap([...subcategories.scitech]);
        break;
      case "Auto":
        setSubcategoriesMap([...subcategories.auto]);
        break;
    }
  };

  const saveSubcategory = (e) => {
    setSaveSubcat(e.target.value);
  };

  const dragStart = (e, ind) => {
    e.dataTransfer.setData("text", ind);
    console.log(e.target.src);
  };

  const drop = (e, dropInd) => {
    e.preventDefault();
    let data = e.dataTransfer.getData("text");
    let drgIdx = 0;
    let replacedIdx = 0;
    if (+data === dropInd) {
      return;
    }
    setDragIndex(+data);
    drgIdx = +data;
    replacedIdx = dropInd;
    setReplacedIdx(dropInd);
    console.log(imagePreview);
    setImagePreview((old) => {
      let oldArr = [...old];
      oldArr[drgIdx] = { ...old[replacedIdx] };
      oldArr[replacedIdx] = { ...old[drgIdx] };
      console.log(oldArr);
      return oldArr;
    });
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  const imageCaptionTextAttach = () => {
    let strValue = captionText.current.value;
    if (strValue.trim() === "blank") {
      //skip typing blank for every time if we have all blank imgs
      strValue = [];
      imagePreview.forEach((img, i) => {
        strValue.push("blank");
      });
    } else {
      strValue = strValue.split(" || ");
    }
    const finalValue = [];
    if (imagePreview.length !== strValue.length) {
      return;
    }
    imagePreview.forEach((img, i) => {
      if (captionText.current.value.trim() !== "") {
        finalValue.push({ name: img.name, captionText: strValue[i] });
      } else {
        finalValue.push({ name: img.name, captionText: "" });
      }
    });
    console.log(finalValue);
    return finalValue;
  };

  const showSecondListFn = () => {
    setShowSecondList(true);
  };

  const hideSecondList = () => {
    setShowSecondList(false);
  };

  const handleUlSwitch = () => {
    setCurrentList((old) => {
      if (old === "ul") {
        return "ol";
      } else {
        return "ul";
      }
    });
  };

  return (
    <>
      {/* {parse(
        '<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/p/CRk85dWjuov/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="13" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:16px;"> <a href="https://www.instagram.com/p/CRk85dWjuov/?utm_source=ig_embed&amp;utm_campaign=loading" style=" background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank"> <div style=" display: flex; flex-direction: row; align-items: center;"> <div style="background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 40px; margin-right: 14px; width: 40px;"></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 100px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 60px;"></div></div></div><div style="padding: 19% 0;"></div> <div style="display:block; height:50px; margin:0 auto 12px; width:50px;"><svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-511.000000, -20.000000)" fill="#000000"><g><path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path></g></g></g></svg></div><div style="padding-top: 8px;"> <div style=" color:#3897f0; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:550; line-height:18px;"> View this post on Instagram</div></div><div style="padding: 12.5% 0;"></div> <div style="display: flex; flex-direction: row; margin-bottom: 14px; align-items: center;"><div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(0px) translateY(7px);"></div> <div style="background-color: #F4F4F4; height: 12.5px; transform: rotate(-45deg) translateX(3px) translateY(1px); width: 12.5px; flex-grow: 0; margin-right: 14px; margin-left: 2px;"></div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(9px) translateY(-18px);"></div></div><div style="margin-left: 8px;"> <div style=" background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 20px; width: 20px;"></div> <div style=" width: 0; height: 0; border-top: 2px solid transparent; border-left: 6px solid #f4f4f4; border-bottom: 2px solid transparent; transform: translateX(16px) translateY(-4px) rotate(30deg)"></div></div><div style="margin-left: auto;"> <div style=" width: 0px; border-top: 8px solid #F4F4F4; border-right: 8px solid transparent; transform: translateY(16px);"></div> <div style=" background-color: #F4F4F4; flex-grow: 0; height: 12px; width: 16px; transform: translateY(-4px);"></div> <div style=" width: 0; height: 0; border-top: 8px solid #F4F4F4; border-left: 8px solid transparent; transform: translateY(-4px) translateX(8px);"></div></div></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center; margin-bottom: 24px;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 224px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 144px;"></div></div></a><p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;"><a href="https://www.instagram.com/p/CRk85dWjuov/?utm_source=ig_embed&amp;utm_campaign=loading" style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none;" target="_blank">A post shared by Chloe Ventura (@chloe.ventura)</a></p></div></blockquote>  <script async src="//www.instagram.com/embed.js"></script>'
      )}
      {parse(
        '<iframe src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2FKlix.ba%2Fposts%2F10158031303966821&show_text=true&width=500" width="500" height="487" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>'
      )} */}
      {ctx.overlay && (
        <Overlay handleConfirm={handleConfirmDeletion}>
          <Modal />
        </Overlay>
      )}

      {sending && (
        <Overlay
          ref={sendArticleOverlay}
          handleCloseOverlay={handleCloseOverlay}
        >
          <ProgressBar
            progress={progress}
            ref={progressRef}
            articleAdded={articleAdded}
            location={location.state ? location.state : null}
          />
        </Overlay>
      )}

      <div id={s.addArticle}>
        <div id={s.addArticleBody}>
          <div id={s.addArticleContent}>
            <div id={s.addTitle} ref={titles}>
              <input type="text" placeholder="Naslov članka" />
              <input
                type="text"
                placeholder="Podnaslov članka"
                onChange={handleIfPromo}
              />
            </div>
            <div id={s.addText}>
              <div id={s.addTextHeader}>
                <i class="fas fa-chevron-down"></i>
                Tekst
              </div>
              <div id={s.addTextBody}>
                <div id={s.addTextBodyHeader}>
                  <ul>
                    <li title="bold" onMouseDown={handleBold}>
                      B
                    </li>
                    <li
                      title="list"
                      onMouseDown={handleList}
                      onMouseEnter={showSecondListFn}
                      onMouseLeave={hideSecondList}
                    >
                      {currentList === "ul" ? (
                        <i class="fas fa-list-ul"></i>
                      ) : (
                        <i class="fas fa-list-ol"></i>
                      )}
                      {showSecondList && (
                        <div id={s.listOl} onMouseDown={handleUlSwitch}>
                          {currentList === "ul" ? (
                            <i class="fas fa-list-ol"></i>
                          ) : (
                            <i class="fas fa-list-ul"></i>
                          )}
                        </div>
                      )}
                    </li>
                    <li title="embed" onMouseDown={handleEmbed}>
                      &lt;&gt;
                    </li>
                    <li title="link" onMouseDown={handleLink}>
                      <i class="fas fa-link"></i>
                    </li>
                  </ul>
                </div>
                <div id={s.addTextBodyBody}>
                  <textarea
                    ref={textareaRef}
                    onKeyDown={handleEnter}
                    onPaste={handlePaste}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>
            </div>
            <div id={s.addImages}>
              <div id={s.addImagesHeader}>
                <div id={s.addImagesBundleLeft}>
                  <i class="fas fa-chevron-down"></i>
                  Slike
                </div>
                <div id={s.addImagesBundleRight}>
                  <i onClick={handleDeleteMode} class="far fa-trash-alt"></i>
                </div>
              </div>
              <div id={s.addImagesBody}>
                <div className={s.uploadImageContainer}>
                  <div id={s.uploadImageText}>Postavi slike</div>
                  <div id={s.uploadImage} ref={postaviSlikeBorder}>
                    <input
                      type="file"
                      id="file"
                      accept="image/*"
                      multiple={true}
                      onChange={handleImages}
                    />
                    <label
                      htmlFor="file"
                      onMouseEnter={handleHoverEnter}
                      onMouseLeave={handleHoverLeave}
                    >
                      <i class="fas fa-images"></i>
                      <span ref={postaviSlikeText}>Postavi slike</span>
                    </label>
                    <div id={s.imageContainer} ref={imgCnt}>
                      {imagePreview &&
                        imagePreview.length > 0 &&
                        imagePreview.map((img, i) => (
                          <div
                            key={uuid()}
                            className={s.imageWrapper}
                            onClick={handleDeleteImg}
                            draggable={true}
                            onDragStart={(e) => dragStart(e, i)}
                            onDrop={(e) => drop(e, i)}
                            onDragOver={allowDrop}
                          >
                            <img className={s.previewImage} src={img.url} />
                            <div
                              className={
                                img.checked === "true" ? s.deletable : null
                              }
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
                <div className={s.imageCaptionContainer}>
                  <div id={s.imageCaptionText}>Natpis</div>
                  <div id={s.imageCaption}>
                    <textarea ref={captionText} type="text" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id={s.addArticleInfo}>
            <div id={s.author}>
              <h3>Autor</h3>
              <div id={s.authorCnt}>
                <div id={s.authorInfo}>
                  <i class="fas fa-user"></i>{" "}
                  <span style={{ textTransform: "capitalize" }}>
                    {ctx.user.displayName}
                  </span>
                </div>
                <button
                  onClick={handleUpload}
                  disabled={sending ? true : false}
                >
                  Spasi
                </button>
              </div>
            </div>
            <div id={s.category}>
              <label htmlFor="category">Kategorija</label>
              <select
                id="category"
                ref={categorySelect}
                onChange={handleCategoryChange}
              >
                <option>Vijesti</option>
                <option>Biznis</option>
                <option>Sport</option>
                <option>Magazin</option>
                <option>Lifestyle</option>
                <option>Scitech</option>
                <option>Auto</option>
              </select>
              <label id={s.subcategory}>Podkategorija</label>
              <select
                ref={subcategorySelect}
                value={saveSubcat}
                onChange={saveSubcategory}
              >
                {subcategoriesMap.map((item) => {
                  return <option key={uuid()}>{item}</option>;
                })}
              </select>
            </div>
            <div id={s.tag}>
              <h4>Tagovi</h4>
              <input type="text" onKeyDown={handleAddTags} />
              <div id={s.tagContainer} ref={tagContainer}>
                {tags.map((tag) => (
                  <div className={s.tagItem} key={uuid()}>
                    <span>{tag.value ? tag.value : tag}</span>
                    <i onClick={handleRemoveTag} class="fas fa-times"></i>
                  </div>
                ))}
                {/* <div className={s.tagItem}>
                  <span>Hello</span>
                  <i class="fas fa-times"></i>
                </div>
                <div className={s.tagItem}>
                  <span>Hello</span>
                  <i class="fas fa-times"></i>
                </div>
                <div className={s.tagItem}>
                  <span>Helloasdasd</span>
                  <i class="fas fa-times"></i>
                </div>
                <div className={s.tagItem}>
                  <span>Helloasdasd</span>
                  <i class="fas fa-times"></i>
                </div>
                <div className={s.tagItem}>
                  <span>Helloasdasd</span>
                  <i class="fas fa-times"></i>
                </div>
                <div className={s.tagItem}>
                  <span>Helloasdasd</span>
                  <i class="fas fa-times"></i>
                </div>
                <div className={s.tagItem}>
                  <span>Helloasdasd</span>
                  <i class="fas fa-times"></i>
                </div> */}
              </div>
            </div>
            <div id={s.commentsAllowed}>
              <div>
                <h3>Dozvoli komentare:</h3>
              </div>
              <div id={s.commentBundle} ref={commentsRadio}>
                <div className={s.commentItem}>
                  <label htmlFor="komentda">Da</label>
                  <input
                    type="radio"
                    id="komentda"
                    name="koment"
                    defaultChecked
                  />
                </div>
                <div className={s.commentItem}>
                  <label htmlFor="komentne">Ne</label>
                  <input type="radio" id="komentne" name="koment" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddArticle;
