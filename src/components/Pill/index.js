import React from "react";
import { capitalizeFirstLetter } from "utils/capitalize";

const Pill = ({ className, ...props }) => {
  return <div className={`pill ${className}`} {...props} />;
};
export const StatusPill = ({ value, textOnly, ...props }) => {
  if (value) {
    return (
      <span
        className={`statusPill ${value.toLowerCase()} ${
          textOnly && "textOnly"
        }`}
        {...props}
      >
        {capitalizeFirstLetter(value)}
      </span>
    );
  }
};

export default Pill;
