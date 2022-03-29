import React from "react";
import { useHistory } from "react-router-dom";
import { v1 as uuid } from "uuid";
import s from "./ProgressBar.module.css";

const ProgressBar = (props, ref) => {
  return (
    <div id={s.progressParent} ref={ref}>
      {!props.articleAdded &&
        props.progress.map((item) => {
          return (
            <div className={s.progressItem} key={uuid()}>
              <div>
                <h3>{item.imageName}</h3>
              </div>
              <div className={s.progressBar}>
                <div
                  className={s.currentProgress}
                  // style={{ width: `${item.percent}%` }}
                ></div>
              </div>
              <div className={s.done}>
                <i class="fas fa-check"></i>
              </div>
            </div>
          );
        })}
      {props.articleAdded && (
        <div id={s.finished}>
          <h3>Članak je uspješno postavljen u bazu podataka.</h3>
          <button>Ok</button>
        </div>
      )}

      {/* <div className={s.progressItem}>
        <div>
          <h3>TITLE</h3>
        </div>
        <div className={s.progressBar}>
          <div className={s.currentProgress}></div>
        </div>
      </div> */}
    </div>
  );
};

export default React.forwardRef(ProgressBar);
