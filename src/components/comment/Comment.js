import React from 'react';
import s from './Comment.module.css';

const Comment = () => {
  return (
    <div className={s.postComment}>
      <div className={s.postCommentBundle}>
        <textarea
          name="komentar"
          className={s.postCommentTextarea}
          placeholder="upiši komentar"
        ></textarea>
        <button>
          <span>
            <i class="fas fa-pen"></i> Objavi komentar
          </span>
        </button>
      </div>
    </div>
  );
};

export default Comment;
