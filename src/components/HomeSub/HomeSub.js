import React from "react";
import { useEffect, useState } from "react/cjs/react.development";
import s from "./HomeSub.module.css";

const HomeSub = () => {
  const [articles, setArticles] = useState([]);
  useEffect(() => {
    fetch(
      `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/viewContent/Sporedni sadržaj/Početna.json`
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
          let num = 0;
          for (let key in newArr[0]) {
            final.push({
              category: key,
              data: [data.slice(num, num + newArr[0][key].length)],
            });
            num = num + newArr[0][key].length;
          }
        });
      });
  }, []);

  return (
    <div id={s.sub}>
      <div id={s.subBodyHeader}>
        <span></span>
        <h3>Vijesti</h3>
      </div>
      <div id={s.subBody}>
        <div id={s.subBodyLeft}>
          <div className={s.subBodyItem}>
            <div className={s.itemImg}>
              <img src={require("../../assets/img/powerplant.jpg").default} />
            </div>
            <div className={s.itemText}>
              <h3>Neki Naslov</h3>
              <h3>
                Jedan dva nije jeste ovdje bio asda sdas dasd asd asdas dasd
                asda sdas dasd asd asd
              </h3>
            </div>
            <div className={s.itemBundle}>
              <span>22 min</span>
              <div className={s.itemBundleR}>
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
          <div className={s.subBodyItem}>
            <div className={s.itemImg}>
              <img src={require("../../assets/img/powerplant.jpg").default} />
            </div>
            <div className={s.itemText}>
              <h3>Neki Naslov</h3>
              <h3>Jedan dva nije jeste ovdje bio</h3>
            </div>
            <div className={s.itemBundle}>
              <span>22 min</span>
              <div className={s.itemBundleR}>
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
          <div className={s.subBodyItem}>
            <div className={s.itemImg}>
              <img src={require("../../assets/img/powerplant.jpg").default} />
            </div>
            <div className={s.itemText}>
              <h3>Neki Naslov</h3>
              <h3>Jedan dva nije jeste ovdje bio</h3>
            </div>
            <div className={s.itemBundle}>
              <span>22 min</span>
              <div className={s.itemBundleR}>
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
          <div className={s.subBodyItem}>
            <div className={s.itemImg}>
              <img src={require("../../assets/img/powerplant.jpg").default} />
            </div>
            <div className={s.itemText}>
              <h3>Neki Naslov</h3>
              <h3>Jedan dva nije jeste ovdje bio</h3>
            </div>
            <div className={s.itemBundle}>
              <span>22 min</span>
              <div className={s.itemBundleR}>
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
        <div className={s.subBodyItemsBundle}>
          <div className={s.subBodyBundleItem}>
            <div className={s.itemText}>
              <h3>Neki Naslov</h3>
              <h3>Jedan dva nije jeste ovdje bio asda</h3>
            </div>
            <div className={s.itemBundle}>
              <span>22 min</span>
              <div className={s.itemBundleRight}>
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
          <div className={s.subBodyBundleItem}>
            <div className={s.itemText}>
              <h3>Neki Naslov</h3>
              <h3>Jedan dva nije jeste ovdje bio</h3>
            </div>
            <div className={s.itemBundle}>
              <span>22 min</span>
              <div className={s.itemBundleRight}>
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

export default HomeSub;
