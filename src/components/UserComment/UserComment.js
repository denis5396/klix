import React from 'react';
import s from './UserComment.module.css';

const UserComment = () => {
  return (
    <div className={s.commentContainer}>
      <div className={s.commentHeader}>
        <div className={s.commentHeaderFirst}>
          <i
            class="fas fa-user"
            style={{
              backgroundColor: '#c1c1c1',
              color: '#fff',
              padding: '1.5rem',
              borderRadius: '.3rem',
            }}
          ></i>
        </div>
        <div className={s.commentHeaderSecond}>
          <h4>gooUser1621584554</h4>
          <p>prije 30 minuta</p>
        </div>
      </div>
      <div className={s.commentBody}>
        <p>Komentar</p>
      </div>
      <div className={s.commentFooter}>
        <div className={s.commentFooterF}>
          <span className={s.like}>
            <i class="fas fa-long-arrow-alt-up"></i> 15
          </span>
          <span className={s.dislike}>
            <i class="fas fa-long-arrow-alt-down"></i> 0
          </span>
        </div>
        <div>
          <span className={s.report}>
            <i class="far fa-flag"></i> <p>Prijavi</p>
          </span>
          <span className={s.reply}>
            <i class="fas fa-pen"></i>
            <p>Odgovori</p>
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserComment;
