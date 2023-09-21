import { PasswordViewEyeIcon } from "assets/icons";
import React, { forwardRef, useId, useState } from "react";

const Input = forwardRef(
  ({ labelClassName, className, label, type, size, ...props }, ref) => {
    const id = useId();
    const isPassword = type === "password";
    const [inputType, setInputType] = useState(type ?? "text");
    const toggleInputShow = () => {
      inputType === "text" ? setInputType("password") : setInputType("text");
    };
    return (
      <>
        {label && (
          <label className={`formInputLabel ${labelClassName}`} htmlFor={id}>
            {label}
          </label>
        )}
        <div className={`formInputWrap ${size ?? ""}`}>
          <input
            className={`formInput ${size ?? ""} ${className}`}
            type={inputType}
            id={id}
            {...props}
            ref={ref}
          />
          {isPassword && (
            <PasswordViewEyeIcon
              show={inputType === "text"}
              onClick={toggleInputShow}
            />
          )}
        </div>
      </>
    );
  }
);

export default Input;
