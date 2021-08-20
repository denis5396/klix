import React from 'react';
import s from './LinkedPromo.module.css';

const LinkedPromo = () => {
  return (
    <div className={s.promoItem}>
      <div className={s.promoImageCnt}>
        <img src="https://firebasestorage.googleapis.com/v0/b/klix-74c29.appspot.com/o/images%2FPromo%2F-MgFb1HqkOYF1RAojD6v%2FHearthstone%20Screenshot%2003-25-21%2021.19.39.png?alt=media&token=3215a9d9-a7b6-4b2a-a5c6-7219538a0206" />
      </div>
      <div className={s.promoBody}>
        <div className={s.promoTitles}>
          <h3>NASTAVAK SARADNJE</h3>
          <h3>BBI bank uz mjkl i u novoj takmicarskoj sezoni</h3>
        </div>
        <div className={s.promoFooter}>
          <span>1 sat</span>
          <span>
            <i class="fas fa-comments"></i> 29
            <i class="fas fa-share-alt"></i> 0
          </span>
        </div>
      </div>
    </div>
  );
};

export default LinkedPromo;
