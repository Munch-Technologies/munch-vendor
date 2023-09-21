import { SearchIcon } from "assets/icons";
import React from "react";
import { forwardRef } from "react";

const ModalSearchInput = forwardRef(
  ({ inputClassName, className, ...props }, ref) => {
    return (
      <div className={`modalSearchInput ${className}`} tabIndex={0}>
        <SearchIcon />
        <input
          type="text"
          className={`modalSearchInput__input ${inputClassName}`}
          placeholder="Search"
          {...props}
        />
      </div>
    );
  }
);

export default ModalSearchInput;
