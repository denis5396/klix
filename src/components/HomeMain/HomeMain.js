import React, { useEffect, useState } from 'react';
import s from './HomeMain.module.css';
import { timeDifference } from '../AdminPanel/EditArticle/EditArticle';
import { v1 as uuid } from 'uuid';
import { auth, db } from '../../firebase';

const HomeMain = () => {
  const [articlesMain, setArticlesMain] = useState([]);

  useEffect(() => {
    const dbRef = db.ref('viewContent/Glavni sadržaj/Početna');
    dbRef.get().then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log(data);
        const articlePaths = [];
        for (let key in data) {
          data[key].forEach((item) => {
            if (item[1] !== 'undefined/undefined' && item[1] !== '/') {
              articlePaths.push(`${item[1]}/-${item[0]}`);
            }
          });
        }
        console.log(articlePaths);
        const placeHolderArray = [];
        articlePaths.forEach((path, i) => {
          fetch(
            `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/articles/${path}.json`
          )
            .then((response) => response.json())
            .then((data) => {
              console.log(data);
              placeHolderArray.push(data);
              placeHolderArray[i].timeDiff = timeDifference(data.date);
              if (i === articlePaths.length - 1) {
                console.log(placeHolderArray);
                setArticlesMain([...placeHolderArray]);
              }
            });
        });
      }
    });
  }, []);

  useEffect(() => {}, [articlesMain]);

  return (
    <div id={s.homeMain}>
      <div id={s.main}>
        {articlesMain.length > 1 &&
          articlesMain.map((article, i) => {
            if (i !== 1) {
              return (
                <div className={s.mainBox} key={uuid()}>
                  <div className={s.mainBoxImg}>
                    <img src={article.images[0]} alt="" />
                  </div>
                  <div className={s.mainBoxHeader}>
                    <h3>{article.subTitle}</h3>
                    <h3>{article.title}</h3>
                  </div>
                  <div className={s.mainBoxFooter}>
                    <span>{article.timeDiff}</span>
                    <div className={s.mainBoxFooterBundle}>
                      <span>
                        <i class="fas fa-comments"></i>
                        {article.comments.length === 1 &&
                        article.comments[0] === ''
                          ? 0
                          : article.comments.length}
                      </span>
                      <span>
                        <i class="fas fa-share-alt"></i>{' '}
                        {article.shares.length === 1 && article.shares[0] === ''
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
                    <img src={article.images[0]} alt="" />
                  </div>
                  <div className={s.mainBoxHeader}>
                    <h3>{article.subTitle}</h3>
                    <h3>{article.title}</h3>
                  </div>
                  <div className={s.mainBoxFooter}>
                    <span>{article.timeDiff}</span>
                    <div className={s.mainBoxFooterBundle}>
                      <span>
                        <i class="fas fa-comments"></i>
                        {article.comments.length === 1 &&
                        article.comments[0] === ''
                          ? 0
                          : article.comments.length}
                      </span>
                      <span>
                        <i class="fas fa-share-alt"></i>{' '}
                        {article.shares.length === 1 && article.shares[0] === ''
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
