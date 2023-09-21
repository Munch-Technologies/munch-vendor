import debounceFn from "debounce-fn";
import React from "react";
import { SearchIcon } from "../../assets/icons";

const SearchInput = ({ onChange, value }) => {
  const debouncedFunction = debounceFn((e) => onChange(e.target.value), { wait: 300 })

  const processChange = (e) => {
    debouncedFunction(e);
  };

  return (
    <div className="search__input">
      <SearchIcon />
      <input
        placeholder="Search"
        type="text"
        defaultValue={value}
        onChange={processChange}
        autoFocus
      />
    </div>
  );
};

export default SearchInput;
