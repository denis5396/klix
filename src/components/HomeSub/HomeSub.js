import React from 'react';
import s from './HomeSub.module.css';

const HomeSub = (props) => {
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
              <img src={require('../../assets/img/powerplant.jpg').default} />
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
              <img src={require('../../assets/img/powerplant.jpg').default} />
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
              <img src={require('../../assets/img/powerplant.jpg').default} />
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
              <img src={require('../../assets/img/powerplant.jpg').default} />
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
