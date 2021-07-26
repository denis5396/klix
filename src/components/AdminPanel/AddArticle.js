import React, { useContext, useEffect, useRef, useState } from 'react';
import parse from 'html-react-parser';
import { v1 as uuid } from 'uuid';
import s from './AddArticle.module.css';
import Overlay from '../Overlay/Overlay';
import Modal from '../Modal/Modal';
import LoginContext from '../../context';

const AddArticle = () => {
  const ctx = useContext(LoginContext);
  const [paste, setPaste] = useState(false);
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

  const postaviSlikeText = useRef();
  const postaviSlikeBorder = useRef();
  const textareaRef = useRef();
  const imgCnt = useRef();
  const overlayRef = useRef();
  const tagContainer = useRef();

  const handleHoverEnter = () => {
    postaviSlikeBorder.current.style.borderColor = '#3f87e5';
  };

  const handleHoverLeave = () => {
    postaviSlikeBorder.current.style.borderColor = '#d8dee4';
  };

  const handleInsert = (mode) => {
    const selectionStart = textareaRef.current.selectionStart;
    const selectionEnd = textareaRef.current.selectionEnd;
    const { value } = textareaRef.current;
    let start = 0;
    switch (mode) {
      case 'bold':
        for (let i = 0; i < value.length; i++) {
          if (
            value[i] === '<' &&
            value[i + 1] === 'b' &&
            value[i + 2] === '>'
          ) {
            start = i;
          } else if (
            value[i] === '<' &&
            value[i + 1] === '/' &&
            value[i + 2] === 'b' &&
            selectionStart >= start + 1 &&
            selectionStart <= i + 3
          ) {
            return true;
          }
        }
        break;
      case 'embed':
        for (let i = 0; i < value.length; i++) {
          if (
            value[i] === '<' &&
            value[i + 1] === 'e' &&
            value[i + 2] === 'm' &&
            value[i + 3] === 'b'
          ) {
            start = i;
          } else if (
            value[i] === '<' &&
            value[i + 1] === '/' &&
            value[i + 2] === 'e' &&
            selectionStart >= start + 1 &&
            selectionStart <= i + 7
          ) {
            return true;
          }
        }
        break;
      case 'link':
        for (let i = 0; i < value.length; i++) {
          if (
            value[i] === '<' &&
            value[i + 1] === 'l' &&
            value[i + 2] === 'i' &&
            value[i + 3] === 'n'
          ) {
            start = i;
          } else if (
            value[i] === '<' &&
            value[i + 1] === '/' &&
            value[i + 2] === 'l' &&
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
      case 'bold':
        for (let i = 0; i < value.length; i++) {
          if (
            value[i] === '<' &&
            value[i + 1] === 'b' &&
            value[i + 2] === '>'
          ) {
            start = i;
          } else if (
            (value[i] === '<' &&
              value[i + 1] === '/' &&
              value[i + 2] === 'b' &&
              value[i + 3] === '>' &&
              selectionStart >= start &&
              selectionStart <= i + 3) ||
            (value[i] === '<' &&
              value[i + 1] === '/' &&
              value[i + 2] === 'b' &&
              value[i + 3] === '>' &&
              selectionEnd >= start &&
              selectionEnd <= i + 4) ||
            (value[i] === '<' &&
              value[i + 1] === '/' &&
              value[i + 2] === 'b' &&
              value[i + 3] === '>' &&
              selectionStart < start &&
              selectionEnd > i + 4)
          ) {
            return true;
          }
        }
        break;
      case 'embed':
        for (let i = 0; i < value.length; i++) {
          if (
            value[i] === '<' &&
            value[i + 1] === 'e' &&
            value[i + 2] === 'm' &&
            value[i + 3] === 'b'
          ) {
            start = i;
          } else if (
            (value[i] === '<' &&
              value[i + 1] === '/' &&
              value[i + 2] === 'e' &&
              value[i + 3] === 'm' &&
              value[i + 4] === 'b' &&
              selectionStart >= start &&
              selectionStart <= i + 7) ||
            (value[i] === '<' &&
              value[i + 1] === '/' &&
              value[i + 2] === 'e' &&
              value[i + 3] === 'm' &&
              value[i + 4] === 'b' &&
              selectionEnd >= start &&
              selectionEnd <= i + 8) ||
            (value[i] === '<' &&
              value[i + 1] === '/' &&
              value[i + 2] === 'e' &&
              value[i + 3] === 'm' &&
              value[i + 4] === 'b' &&
              selectionStart < start &&
              selectionEnd > i + 8)
          ) {
            return true;
          }
        }
        break;
      case 'link':
        for (let i = 0; i < value.length; i++) {
          if (
            value[i] === '<' &&
            value[i + 1] === 'l' &&
            value[i + 2] === 'i' &&
            value[i + 3] === 'n' &&
            value[i + 4] === 'k'
          ) {
            start = i;
          } else if (
            (value[i] === '<' &&
              value[i + 1] === '/' &&
              value[i + 2] === 'l' &&
              value[i + 3] === 'i' &&
              value[i + 4] === 'n' &&
              value[i + 6] === '>' &&
              selectionStart >= start &&
              selectionStart <= i + 6) ||
            (value[i] === '<' &&
              value[i + 1] === '/' &&
              value[i + 2] === 'l' &&
              value[i + 3] === 'i' &&
              value[i + 4] === 'n' &&
              value[i + 6] === '>' &&
              selectionEnd >= start &&
              selectionEnd <= i + 7) ||
            (value[i] === '<' &&
              value[i + 1] === '/' &&
              value[i + 2] === 'l' &&
              value[i + 3] === 'i' &&
              value[i + 4] === 'n' &&
              value[i + 6] === '>' &&
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
    e.preventDefault();
    console.log(textareaRef.current.selectionStart);
    console.log(textareaRef.current.selectionEnd);
    console.log(textareaRef.current.focus);
    if (
      document.activeElement === textareaRef.current &&
      textareaRef.current.selectionStart === textareaRef.current.selectionEnd
    ) {
      const check1 = handleInsert('bold');
      const check2 = handleInsert('embed');
      const check3 = handleInsert('link');
      if (!check1 && !check2 && !check3) {
        const selStart = textareaRef.current.selectionStart;
        let firstPart = textareaRef.current.value.slice(
          0,
          textareaRef.current.selectionStart
        );
        console.log(firstPart);
        firstPart = firstPart.concat('<b></b>');
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
      const check1 = handleSelect('bold');
      const check2 = handleSelect('embed');
      const check3 = handleSelect('link');
      if (!check1 && !check2 && !check3) {
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
      } else if (check1 || check2 || check3) {
        textareaRef.current.selectionEnd = textareaRef.current.selectionStart;
      }
    }
  };

  const handleEmbed = () => {
    if (
      document.activeElement === textareaRef.current &&
      textareaRef.current.selectionStart === textareaRef.current.selectionEnd
    ) {
      const check = handleInsert('bold');
      const check1 = handleInsert('embed');
      const check2 = handleInsert('link');
      if (!check && !check1 && !check2) {
        const selStart = textareaRef.current.selectionStart;
        let firstPart = textareaRef.current.value.slice(
          0,
          textareaRef.current.selectionStart
        );
        console.log(firstPart);
        firstPart = firstPart.concat('<embed></embed>');
        const secondPart = textareaRef.current.value.slice(
          textareaRef.current.selectionStart
        );
        firstPart = firstPart.concat(secondPart);
        textareaRef.current.value = firstPart;
        textareaRef.current.selectionEnd = selStart + 7;
        setTimeout(() => {
          textareaRef.current.focus();
        }, 1);
      } else if (check || check1 || check2) {
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
      const check1 = handleSelect('bold');
      const check2 = handleSelect('embed');
      const check3 = handleSelect('link');
      if (!check1 && !check2 && !check3) {
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
      } else if (check1 || check2 || check3) {
        setTimeout(() => {
          textareaRef.current.focus();
          textareaRef.current.selectionEnd = selectionStart;
        }, 1);
      }
    }
  };

  const handleLink = () => {
    if (
      document.activeElement === textareaRef.current &&
      textareaRef.current.selectionStart === textareaRef.current.selectionEnd
    ) {
      const check1 = handleInsert('bold');
      const check2 = handleInsert('embed');
      const check3 = handleInsert('link');
      if (!check1 && !check2 && !check3) {
        const selStart = textareaRef.current.selectionStart;
        let firstPart = textareaRef.current.value.slice(
          0,
          textareaRef.current.selectionStart
        );
        console.log(firstPart);
        firstPart = firstPart.concat('<link></link>');
        const secondPart = textareaRef.current.value.slice(
          textareaRef.current.selectionStart
        );
        firstPart = firstPart.concat(secondPart);
        textareaRef.current.value = firstPart;
        textareaRef.current.selectionEnd = selStart + 6;
        setTimeout(() => {
          textareaRef.current.focus();
        }, 1);
      } else if (check1 || check2 || check3) {
        setTimeout(() => {
          textareaRef.current.focus();
          textareaRef.current.selectionEnd = textareaRef.current.selectionStart;
        }, 1);
      }
    } else if (
      document.activeElement === textareaRef.current &&
      textareaRef.current.selectionStart !== textareaRef.current.selectionEnd
    ) {
      const check1 = handleSelect('bold');
      const check2 = handleSelect('embed');
      const check3 = handleSelect('link');
      if (!check1 && !check2 && !check3) {
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
      } else if (check1 || check2 || check3) {
        setTimeout(() => {
          textareaRef.current.focus();
          textareaRef.current.selectionEnd = textareaRef.current.selectionStart;
        }, 1);
      }
    }
  };

  const handleEnter = (e) => {
    if (e.keyCode === 13) {
      // console.log(e.target.value);
      // console.log(e.target.value.split(''));
      console.log(
        textareaRef.current.value[textareaRef.current.selectionStart]
      );
      // if (
      //   textareaRef.current.value[textareaRef.current.selectionStart + 1] !==
      //   '\n'
      // ) {
      //   alert('d');
      // }
      // setSelStart({ num: textareaRef.current.selectionStart, enter: true });
    }
  };

  const handlePaste = (e) => {
    setPaste(true);
  };

  const handleChange = (e) => {
    const strArr = e.target.value.split('');
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
          strArr[i] === '\n' &&
          strArr[i + 1] !== '\n' &&
          strArr[i - 1] !== '\n'
        ) {
          copyArr.splice(i, 0, '\n');
        }
      }
    }
    console.log(copyArr);
    textareaRef.current.value = copyArr.join('');
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
        if (!file.type.includes('image')) {
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
          checked: 'false',
          name: copy.name,
        });
      });
      console.log(previewArray);
      console.log(copyArr);
      setImagePreview([...previewArray]);
      setImageArray(copyArr);
      e.target.value = '';
    }
  };

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
              oldCopy[i].checked = 'true';
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
              oldCopy[i].checked = 'false';
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
        if (oldObj.checked !== 'true') {
          oldCopy.push(oldObj);
        } else if (oldObj.checked === 'true') {
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
      value = value.split('');
      value[0] = value[0].toUpperCase();
      value = value.join('');
      e.target.value = '';
      setTags((old) => {
        const oldCopy = [...old];
        oldCopy.push(value);
        return oldCopy;
      });
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

  const handleUpload = () => {};

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
      <div id={s.addArticle}>
        <div id={s.addArticleBody}>
          <div id={s.addArticleContent}>
            <div id={s.addTitle}>
              <input type="text" placeholder="Naslov članka" />
              <input type="text" placeholder="Podnaslov članka" />
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
                      {imagePreview.length > 0 &&
                        imagePreview.map((img, i) => (
                          <div
                            key={uuid()}
                            className={s.imageWrapper}
                            onClick={handleDeleteImg}
                          >
                            <img className={s.previewImage} src={img.url} />
                            <div
                              className={
                                img.checked === 'true' ? s.deletable : null
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
                    <input type="text" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id={s.addArticleInfo}>
            <div id={s.author}>
              <h3>Autor</h3>
              <div id={s.authorInfo}>
                <i class="fas fa-user"></i> <span>C.H.</span>
              </div>
            </div>
            <div id={s.category}>
              <label htmlFor="category">Kategorija</label>
              <select id="category">
                <option>Vijesti</option>
                <option>Biznis</option>
                <option>Sport</option>
                <option>Magazin</option>
                <option>Lifestyle</option>
                <option>Scitech</option>
                <option>Auto</option>
              </select>
            </div>
            <div id={s.tag}>
              <h4>Tagovi</h4>
              <input type="text" onKeyDown={handleAddTags} />
              <div id={s.tagContainer} ref={tagContainer}>
                {tags.map((tag) => (
                  <div className={s.tagItem} key={uuid()}>
                    <span>{tag}</span>
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
          </div>
        </div>
      </div>
    </>
  );
};

export default AddArticle;
