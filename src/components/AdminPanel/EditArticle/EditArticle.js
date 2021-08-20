import React, { useEffect, useRef, useState } from 'react';
import s from './EditArticle.module.css';
import { subcategories } from '../AddArticle';
import { v1 as uuid } from 'uuid';
import Overlay from '../../Overlay/Overlay';

import { useHistory } from 'react-router-dom';
import { db } from '../../../firebase';
import Modal from '../../Modal/Modal';

const EditArticles = () => {
  const [select, setSelect] = useState([...subcategories.vijesti]);
  const [curSelect, setCurSelect] = useState('BiH');
  const [selectTwo, setSelectTwo] = useState([...subcategories.početna]);
  const [curSelectTwo, setCurSelectTwo] = useState('Vijesti');
  const [glavni, setGlavni] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showSubCat, setShowSubCat] = useState(false);
  const [loading, setLoading] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [articles, setArticles] = useState([
    {
      title: 'asd',
      subTitle: 'asdd',
      images: [
        'https://firebasestorage.googleapis.com/v0/b/klix-74c29.appspot.com/o/images%2FBiznis%2FFinansije%2F-Mh9IGTA76VEvVt_QsSj%2FHearthstone%20Screenshot%2003-25-21%2021.19.39.png?alt=media&token=c654015b-96f1-44b0-8c04-a49849e623ee',
      ],
      shares: [''],
      comments: [''],
    },
    {
      title: 'asd',
      subTitle: 'asdd',
      images: [
        'https://firebasestorage.googleapis.com/v0/b/klix-74c29.appspot.com/o/images%2FBiznis%2FFinansije%2F-Mh9IGTA76VEvVt_QsSj%2FHearthstone%20Screenshot%2003-25-21%2021.19.39.png?alt=media&token=c654015b-96f1-44b0-8c04-a49849e623ee',
      ],
      shares: [''],
      comments: [''],
    },
    {
      title: 'asd',
      subTitle: 'asdd',
      images: [
        'https://firebasestorage.googleapis.com/v0/b/klix-74c29.appspot.com/o/images%2FBiznis%2FFinansije%2F-Mh9IGTA76VEvVt_QsSj%2FHearthstone%20Screenshot%2003-25-21%2021.19.39.png?alt=media&token=c654015b-96f1-44b0-8c04-a49849e623ee',
      ],
      shares: [''],
      comments: [''],
    },
    {},
    {},
    {},
    {},
  ]);
  const [clickedPos, setClickedPos] = useState(null);
  const [fetchPos, setFetchPos] = useState(null);
  const [showAddingItem, setShowAddingItem] = useState(false);

  const switchSelect = useRef();
  const selectMainVal = useRef();
  const articleFetchCnt = useRef();
  const mainContentCnt = useRef();
  const subConentCntLeft = useRef();
  const subConentCntRight = useRef();
  const modalRef = useRef();
  const history = useHistory();

  const [articleFetch, setArticleFetch] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    console.log(subcategories);
    if (articles) {
      console.log(articles[0]);
    }
  });

  useEffect(() => {
    console.log(switchSelect.current.value);
    window.addEventListener('popstate', () => {
      alert('popped');
    });
  }, []);

  const handleSelectChange = (e, mode) => {
    if (mode === 'dva') {
      setCurSelectTwo(e.target.value);
    } else if (mode === 'jedan') {
      setCurSelect(e.target.value);
    }
  };

  const handleSelectMain = (e, mode) => {
    setArticleFetch([]);
    const { value } = e.target;
    setShowSubCat(true);
    switch (value) {
      case 'Početna':
        if (mode === 'two') {
          setSelectTwo([...subcategories.početna]);
          setCurSelectTwo([...subcategories.početna[0]]);
          break;
        }
      case 'Vijesti':
        if (mode === 'jedan') {
          setSelect([...subcategories.vijesti]);
          setCurSelect(subcategories.vijesti[0]);
          break;
        } else if (mode === 'two') {
          setSelectTwo([...subcategories.vijesti]);
          setCurSelectTwo(subcategories.vijesti[0]);
          break;
        }
      case 'Biznis':
        if (mode === 'jedan') {
          setSelect([...subcategories.biznis]);
          setCurSelect(subcategories.biznis[0]);
          break;
        } else if (mode === 'two') {
          setSelectTwo([...subcategories.biznis]);
          setCurSelectTwo(subcategories.biznis[0]);
          break;
        }
      case 'Sport':
        if (mode === 'jedan') {
          setSelect([...subcategories.sport]);
          setCurSelect(subcategories.sport[0]);
          break;
        } else if (mode === 'two') {
          setSelectTwo([...subcategories.sport]);
          setCurSelectTwo(subcategories.sport[0]);
          break;
        }
      case 'Magazin':
        if (mode === 'jedan') {
          setSelect([...subcategories.magazin]);
          setCurSelect(subcategories.magazin[0]);
          break;
        } else if (mode === 'two') {
          setSelectTwo([...subcategories.magazin]);
          setCurSelectTwo(subcategories.magazin[0]);
          break;
        }
      case 'Lifestyle':
        if (mode === 'jedan') {
          setSelect([...subcategories.lifestyle]);
          setCurSelect(subcategories.lifestyle[0]);
          break;
        } else if (mode === 'two') {
          setSelectTwo([...subcategories.lifestyle]);
          setCurSelectTwo(subcategories.lifestyle[0]);
          break;
        }
      case 'Scitech':
        if (mode === 'jedan') {
          setSelect([...subcategories.scitech]);
          setCurSelect(subcategories.scitech[0]);
          break;
        } else if (mode === 'two') {
          setSelectTwo([...subcategories.scitech]);
          setCurSelectTwo(subcategories.scitech[0]);
          break;
        }
      case 'Auto':
        if (mode === 'jedan') {
          setSelect([...subcategories.auto]);
          setCurSelect(subcategories.auto[0]);
          break;
        } else if (mode === 'two') {
          setSelectTwo([...subcategories.auto]);
          setCurSelectTwo(subcategories.auto[0]);
          break;
        }
    }
  };

  const handleGlavni = (e) => {
    if (e.target.value === 'Glavni sadržaj') {
      setGlavni(true);
    } else {
      setGlavni(false);
    }
  };

  const handleCloseOverlay = (e) => {
    const { id } = e.target;
    if (id.includes('overlay') && !showModal) {
      setAdding(false);
      setShowSubCat(false);
      setArticleFetch([]);
      setClickedPos(null);
    }
  };

  const timeDifference = (time) => {
    const date = new Date();
    const curTime = [
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
    ];
    let difference;
    let transformedDate = time.split(/-|:| /);
    for (let i = 0; i < transformedDate.length; i++) {
      transformedDate[i] = +transformedDate[i];
    }
    let year;
    let month;
    let dateDiff;
    let hour;
    let minute;
    let second;
    year = curTime[0] - transformedDate[0];
    month = curTime[1] - transformedDate[1];
    dateDiff = curTime[2] - transformedDate[2];
    hour = curTime[3] - transformedDate[3];
    minute = curTime[4] - transformedDate[4];
    second = curTime[5] - transformedDate[5];
    console.log(transformedDate);
    let monthLower = false;
    let dateLower = false;
    let hourLower = false;
    let minuteLower = false;
    let secondLower = false;
    console.log(second);
    if (month < 0) {
      monthLower = true;
    }
    if (dateDiff < 0) {
      dateLower = true;
    }
    if (hour < 0) {
      hourLower = true;
    }
    if (minute < 0) {
      minuteLower = true;
    }
    if (second < 0) {
      secondLower = true;
    }
    console.log(curTime[4]);
    console.log(transformedDate[4]);
    difference = `${monthLower && year > 0 ? year - 1 : year} ${
      dateLower && month > 0
        ? month - 1
        : dateLower && month < 0
        ? 12 - Math.abs(month - 1)
        : !dateLower && month < 0
        ? 12 - Math.abs(month)
        : month
    } ${
      hourLower
        ? dateDiff - 1
        : dateDiff < 0 && hourLower
        ? daysInMonth(date.getMonth(), curTime[0]) - Math.abs(dateDiff - 1)
        : !hourLower && dateDiff < 0
        ? daysInMonth(date.getMonth(), curTime[0]) - Math.abs(dateDiff)
        : dateDiff
    } ${
      minuteLower && hour > 0
        ? hour - 1
        : minuteLower && hour < 0
        ? 24 - Math.abs(hour - 1)
        : !minuteLower && hour < 0
        ? 24 - Math.abs(hour)
        : hour
    } ${
      secondLower && minute > 0
        ? minute - 1
        : secondLower && minute < 0
        ? 60 - Math.abs(minute - 1)
        : !secondLower && minute < 0
        ? 60 - Math.abs(minute)
        : minute
    } ${secondLower ? 60 - Math.abs(second) : second}`;
    console.log(difference);
    difference = difference.split(' ');

    let check = false;
    let returnVal = '';
    difference.forEach((diff, i) => {
      if (+diff !== 0 && diff > 0 && !check) {
        check = true;
        switch (i) {
          case 0:
            returnVal = `${diff} god`;
            break;
          case 1:
            returnVal = `${diff} mje`;
            break;
          case 2:
            if (diff[diff.length - 1] == 1 && diff != 11) {
              returnVal = `${diff} dan`;
              break;
            } else {
              returnVal = `${diff} dana`;
              break;
            }
          case 3:
            let xform = diff;
            xform = xform.split('');
            xform.forEach((item, i) => {
              if (i === xform.length - 1) {
                if (item == 1 && diff != 11) {
                  returnVal = `${diff} sat`;
                } else if (
                  (item == 2 || item == 3 || item == 4) &&
                  (diff <= 4 || diff >= 22)
                ) {
                  returnVal = `${diff} sata`;
                } else if (
                  item == 0 ||
                  item == 5 ||
                  item == 6 ||
                  item == 7 ||
                  item == 8 ||
                  item == 9 ||
                  diff == 11 ||
                  diff == 12 ||
                  diff == 13 ||
                  diff == 14
                ) {
                  returnVal = `${diff} sati`;
                }
              }
            });
            console.log(xform);
            break;
          case 4:
            returnVal = `${diff} min`;
            break;
          case 5:
            returnVal = `${diff} sek`;
            break;
        }
      }
      // else if (!check && i === difference.length - 1) {
      //   alert(`${diff} sekundi`);
      // }
    });
    console.log(transformedDate);
    console.log(curTime);
    return returnVal;
  };

  const fetchArticles = () => {
    setLoading(true);
    const mainVal = selectMainVal.current.value;
    const dbRef = db.ref(`articles/${mainVal}/${curSelect}`);

    dbRef.get().then((snapshot) => {
      if (snapshot.exists) {
        const data = snapshot.val();
        let realData = [];
        let incr = 0;
        for (let key in data) {
          realData.push(data[key]);
          realData[incr].timeDiff = timeDifference(realData[incr].date);
          incr++;
        }
        setArticleFetch(realData);
      }
    });
  };

  function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  const handleAddFetchedArticle = (e) => {
    if (articleFetchCnt.current) {
      for (let i = 0; i < articleFetchCnt.current.children.length; i++) {
        if (articleFetchCnt.current.children[i].contains(e.target)) {
          console.log(articleFetch[i]);
          setFetchPos(i);
          setShowModal(true);
        }
      }
    }
  };

  useEffect(() => {}, []);

  const handleSetPos = (e) => {};

  const showAdding = (ind) => {
    if (!switching) {
      setClickedPos(ind);
      console.log(ind);
    }
  };
  const hideAdding = () => {
    setClickedPos(null);
  };

  const handleConfirmation = (e) => {
    if (e.target.textContent === 'Da') {
      alert(clickedPos);
      alert(fetchPos);
      setArticles((old) => {
        let newArr = [...old];
        newArr[clickedPos] = articleFetch[fetchPos];
        return newArr;
      });
      setShowModal(false);
      setAdding(false);
      setShowSubCat(false);
      setArticleFetch([]);
      setClickedPos(null);
      setFetchPos(null);
    } else if (e.target.textContent === 'Ne') {
      setShowModal(false);
      setFetchPos(null);
    }
  };

  useEffect(() => {
    console.log(articleFetch);
  }, [articleFetch]);

  return (
    <>
      {/* <iframe
        id="sofa-standings-embed-1-37036"
        width="100%"
        height={717}
        src="https://www.sofascore.com/tournament/1/37036/standings/tables/embed"
        frameBorder={0}
        scrolling="no"
        style={{ height: '717px!important' }}
      >
        {'{'}' '{'}'}
      </iframe>{' '}
      <div>
        Standings provided by{' '}
        <a target="_blank" href="https://www.sofascore.com/">
          SofaScore LiveScore
        </a>
      </div> */}
      {adding && (
        <Overlay handleCloseOverlay={handleCloseOverlay}>
          <div id={s.allArticlesHeader}>
            <select
              onChange={(e) => handleSelectMain(e, 'jedan')}
              defaultValue={''}
              ref={selectMainVal}
            >
              <option disabled={true} label={' -- Izaberi opciju -- '}></option>
              <option>Vijesti</option>
              <option>Biznis</option>
              <option>Sport</option>
              <option>Magazin</option>
              <option>Lifestyle</option>
              <option>Scitech</option>
              <option>Auto</option>
            </select>
            {showSubCat && (
              <>
                <select
                  value={curSelect}
                  onChange={(e) => handleSelectChange(e, 'jedan')}
                >
                  {select.map((item) => (
                    <option key={uuid()}>{item}</option>
                  ))}
                </select>
                <button id={s.fetchBtn} onClick={fetchArticles}>
                  Prikaži sadržaj
                </button>
              </>
            )}

            <div id={s.allArticlesItems} ref={articleFetchCnt}>
              {articleFetch &&
                articleFetch.map((articleItem) => {
                  return (
                    <div
                      className={s.articleFetchItem}
                      onClick={handleAddFetchedArticle}
                      key={uuid()}
                    >
                      <div className={s.articleFetchItemImgCnt}>
                        {/* <img src={articleItem.url[0]} /> */}
                        <img src={articleItem.images[0]} />
                      </div>
                      <div className={s.articleItemFetchTitles}>
                        <h3>{articleItem.subTitle}</h3>
                        <h3>{articleItem.title}</h3>
                      </div>
                      <div className={s.articleItemFetchFooter}>
                        <span>{articleItem.timeDiff}</span>
                        <div className={s.articleItemFetchBundle}>
                          <span>
                            <i class="fas fa-comment"></i>{' '}
                            {articleItem.comments.length === 1 &&
                            articleItem.comments[0] === ''
                              ? 0
                              : articleItem.comments.length}
                          </span>
                          <span>
                            <i class="fas fa-share-alt"></i>{' '}
                            {articleItem.shares.length === 1 &&
                            articleItem.shares[0] === ''
                              ? 0
                              : articleItem.shares.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          {showModal && (
            <Modal ref={modalRef} handleClick={handleConfirmation} />
          )}
        </Overlay>
      )}
      <div id={s.editArticles}>
        <div id={s.allArticles}></div>
        <div id={s.allArticlesMain}>
          <div id={s.allArticlesMainBody}>
            <div id={s.allArticlesMainBodyHeader}>
              <select
                onChange={handleGlavni}
                ref={switchSelect}
                value={glavni ? 'Glavni sadržaj' : 'Sporedni sadržaj'}
              >
                <option>Glavni sadržaj</option>
                <option>Sporedni sadržaj</option>
              </select>
              <select
                onChange={(e) => handleSelectMain(e, 'two')}
                defaultValue={'Početna'}
              >
                <option>Početna</option>
                <option>Vijesti</option>
                <option>Biznis</option>
                <option>Sport</option>
                <option>Magazin</option>
                <option>Lifestyle</option>
                <option>Scitech</option>
                <option>Auto</option>
              </select>
              {!glavni && (
                <select
                  onChange={(e) => handleSelectChange(e, 'dva')}
                  value={curSelectTwo}
                  defaultValue={'Vijesti'}
                >
                  {selectTwo.map((item) => (
                    <option key={uuid()}>{item}</option>
                  ))}
                </select>
              )}
            </div>
            {!glavni && (
              <div className={s.articleSubCnt}>
                <div className={s.subLeft} ref={subConentCntLeft}>
                  {articles.map((article, i) => {
                    if (Object.keys(article).length !== 0 && i < 4) {
                      return (
                        <div
                          className={s.subLeftItem}
                          onMouseEnter={() => showAdding(i)}
                          onMouseLeave={hideAdding}
                          key={uuid()}
                        >
                          {clickedPos !== i && (
                            <>
                              <div className={s.subLeftItemImg}>
                                <img src={article.images[0]} />
                              </div>
                              <div className={s.subLeftItemText}>
                                <h3>{article.subTitle}</h3>
                                <h3>{article.title}</h3>
                              </div>
                              <div className={s.subLeftItemBundle}>
                                <span>{article.timeDiff}</span>
                                <div className={s.subLeftBundleRight}>
                                  <span>
                                    <i class="fas fa-comment"></i>{' '}
                                    {article.comments.length === 1 &&
                                    article.comments[0] === ''
                                      ? 0
                                      : article.comments.length}
                                  </span>
                                  <span>
                                    <i class="fas fa-share-alt"></i>{' '}
                                    {article.shares.length === 1 &&
                                    article.shares[0] === ''
                                      ? 0
                                      : article.shares.length}
                                  </span>
                                </div>
                              </div>
                            </>
                          )}{' '}
                          {clickedPos === i && (
                            <div className={s.addArticleLeft}>
                              <i
                                class="fas fa-plus"
                                onClick={() => setAdding(true)}
                              ></i>
                            </div>
                          )}
                        </div>
                      );
                    } else {
                      if (i <= 3) {
                        return (
                          <div
                            className={
                              i !== 1 ? s.addArticle : `${s.addArticle}`
                            }
                            key={uuid()}
                          >
                            <i
                              class="fas fa-plus"
                              onClick={() => setAdding(true)}
                            ></i>
                          </div>
                        );
                      }
                    }
                  })}
                </div>
                <div className={s.subRight} ref={subConentCntRight}>
                  {articles.map((article, i) => {
                    if (Object.keys(article).length !== 0) {
                      if (i >= 4) {
                        return (
                          <div className={s.subRightItem} key={uuid()}>
                            <div className={s.subRightText}>
                              <h3>{article.subTitle}</h3>
                              <h3>{article.title}</h3>
                            </div>
                            <div className={s.subRightBundle}>
                              <span>{article.timeDiff}</span>
                              <div className={s.subRightBundleRight}>
                                <span>
                                  <i class="fas fa-comment"></i>{' '}
                                  {article.comments.length === 1 &&
                                  article.comments[0] === ''
                                    ? 0
                                    : article.comments.length}
                                </span>
                                <span>
                                  <i class="fas fa-share-alt"></i>{' '}
                                  {article.shares.length === 1 &&
                                  article.shares[0] === ''
                                    ? 0
                                    : article.shares.length}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    } else {
                      if (i >= 4 && i < 6) {
                        return (
                          <div className={s.addArticle} key={uuid()}>
                            <i
                              class="fas fa-plus"
                              onClick={() => setAdding(true)}
                            ></i>
                          </div>
                        );
                      }
                    }
                  })}
                </div>
              </div>
            )}
            {glavni && (
              <div id={s.allArticlesMainBodyContent} ref={mainContentCnt}>
                {articles &&
                  articles.map((article, i) => {
                    if (Object.keys(article).length !== 0) {
                      if (i !== 1) {
                        return (
                          <div
                            className={s.articleItemSm}
                            onMouseEnter={() => showAdding(i)}
                            onMouseLeave={hideAdding}
                            key={uuid()}
                          >
                            {clickedPos !== i && (
                              <>
                                <div className={s.articleImgCnt}>
                                  <img src={article.images[0]} />
                                  {article.images.length > 1 && (
                                    <i class="far fa-images"></i>
                                  )}
                                </div>
                                <div className={s.articleTitles}>
                                  <h3>{article.subTitle}</h3>
                                  <h3>{article.title}</h3>
                                </div>
                                <div className={s.articleFooter}>
                                  <span>{article.timeDiff}</span>
                                  <span>
                                    <i class="fas fa-comment"></i>{' '}
                                    {article.comments.length === 1 &&
                                    article.comments[0] === ''
                                      ? 0
                                      : article.comments.length}
                                    <i class="fas fa-share-alt"></i>{' '}
                                    {article.shares.length === 1 &&
                                    article.shares[0] === ''
                                      ? 0
                                      : article.shares.length}
                                  </span>
                                </div>
                              </>
                            )}{' '}
                            {clickedPos === i && (
                              <div className={s.addArticle}>
                                <i
                                  class="fas fa-plus"
                                  onClick={() => setAdding(true)}
                                ></i>
                              </div>
                            )}
                          </div>
                        );
                      } else {
                        return (
                          <div
                            className={s.articleItemBg}
                            onMouseEnter={() => showAdding(i)}
                            onMouseLeave={hideAdding}
                            key={uuid()}
                          >
                            {clickedPos !== i && (
                              <>
                                <div className={s.articleImageCntBg}>
                                  <img src={article.images[0]} />
                                </div>
                                <div className={s.articleItemBgHeader}>
                                  <h3>{article.subTitle}</h3>
                                  <h3>{article.title}</h3>
                                </div>
                                <div className={s.articleItemBgFooter}>
                                  <span>{article.timeDiff}</span>
                                  <div className={s.articleItemBgFooterBundle}>
                                    <span>
                                      <i class="fas fa-comment"></i>{' '}
                                      {article.comments.length === 1 &&
                                      article.comments[0] === ''
                                        ? 0
                                        : article.comments.length}
                                    </span>
                                    <span>
                                      <i class="fas fa-share-alt"></i>{' '}
                                      {article.shares.length === 1 &&
                                      article.shares[0] === ''
                                        ? 0
                                        : article.shares.length}
                                    </span>
                                  </div>
                                </div>
                              </>
                            )}
                            {clickedPos === i && (
                              <div className={s.addArticle}>
                                <i
                                  class="fas fa-plus"
                                  onClick={() => setAdding(true)}
                                ></i>
                              </div>
                            )}
                          </div>
                        );
                      }
                    } else {
                      return (
                        <div
                          className={
                            i !== 1
                              ? s.addArticle
                              : `${s.addArticle} ${s.addArticleBg}`
                          }
                          onClick={(e) =>
                            handleAddFetchedArticle(e, 'mainContent')
                          }
                          onMouseEnter={() => showAdding(i)}
                          key={uuid()}
                        >
                          <i
                            class="fas fa-plus"
                            onClick={() => setAdding(true)}
                          ></i>
                        </div>
                      );
                    }
                  })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EditArticles;
