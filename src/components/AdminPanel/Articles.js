import React, { useEffect, useRef, useState } from 'react';
import s from './Articles.module.css';

const Articles = () => {
  const [clicked, setClicked] = useState(false);
  const optionsRef = useRef();
  const optionsBundle = useRef();

  const handleClick = (e) => {
    //check if bundle is there if yes when clicked on dots remove it
    //this will run for every mapped item and only in the comp that has the etarget it will be true and u will not get to the false it will return rest will be false
    if (optionsBundle.current && optionsRef.current.contains(e.target)) {
      setClicked(false);
      return;
    }
    if (
      optionsRef.current.contains(e.target) ||
      (optionsBundle.current && optionsBundle.current.contains(e.target))
    ) {
      setClicked(true);

      return;
    }
    setClicked(false);
  };
  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className={s.article}>
      <img src={require('../../assets/img/powerplant.jpg').default} />
      <div className={s.textBundle}>
        <h4>title2</h4>
        <h3>title</h3>
      </div>
      <div
        className={s.articleOptionsBundle}
        // onClick={handleClick}
        ref={optionsRef}
      >
        <span className={s.articleOptions} />
        <span className={s.articleOptions} />
        <span className={s.articleOptions} />
      </div>
      {clicked && (
        <div className={s.editArticle} ref={optionsBundle}>
          <div className={s.editArticleItem}>
            <span>
              <i class="fas fa-edit"></i>
            </span>
            <span>Edituj članak</span>
          </div>
          <div className={s.editArticleItem}>
            <span>
              <i class="fas fa-trash"></i>
            </span>
            <span>Izbriši članak</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Articles;
