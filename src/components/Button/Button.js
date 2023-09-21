import React from "react";

const Button = ({
  title,
  iconLeft,
  iconRight,
  className,
  titleClass,
  onClick,
  ...props
}) => {
  return (
    <button className={`button ${className}`} onClick={onClick} {...props}>
      {iconLeft && <div className="button__iconL">{iconLeft}</div>}
      <div className={`button__text ${titleClass}`}>{title}</div>
      {iconRight && <div className="button__iconR">{iconRight}</div>}
    </button>
  );
};

export default Button;
