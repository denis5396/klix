import React from 'react';
import AddArticle from './AddArticle';
import s from './AdminPanelContainer.module.css';
import Articles from './Articles';

const AdminPanelContainer = () => {
  return (
    <div id={s.border}>
      <AddArticle />
      {/* <div id={s.itemContainer}>
        <div id={s.addArticle}>
          <i class="fas fa-plus"></i>
        </div>
        <div id={s.articles}>
          <Articles />
          <Articles /> */}
      {/* <Articles />
          <Articles />
          <Articles />
          <Articles />
          <Articles />
          <Articles />
          <Articles /> */}
      {/* </div> */}
      {/* </div> */}
    </div>
  );
};

export default AdminPanelContainer;
