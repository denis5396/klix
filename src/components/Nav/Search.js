import React, { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import s from "./Search.module.css";

const Search = () => {
  const searchInputRef = useRef();
  const history = useHistory();
  useEffect(() => {
    searchInputRef.current.focus();
  }, []);

  const handleEnter = (e) => {
    const { value } = e.target;
    if (e.keyCode === 13) {
      if (value.length >= 3) {
        history.push(`/pretraga?q=${value}`);
      }
    }
  };

  return (
    <div id={s.searchCnt}>
      <i class="fas fa-search"></i>
      <input
        onKeyDown={handleEnter}
        ref={searchInputRef}
        placeholder="pretraži"
      />
    </div>
  );
};

export default Search;
