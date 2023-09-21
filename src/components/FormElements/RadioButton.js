import React, { useId } from "react";

export default function RadioButton({
  isChecked,
  setIsChecked,
  label,
  labelClassName,
  className,
  name,
  ...props
}) {
  const id = useId();
  return (
    <div htmlFor={id} className="formRadioButton">
      <label>
        <input
          type="radio"
          onChange={() => {
            setIsChecked(!isChecked);
          }}
          name={name}
          id={id}
          {...props}
        />
        <span
          className={`formRadioButton__radio ${
            isChecked ? "radio--active" : ""
          } ${className} ${props.disabled ? "disabled" : ""}`}
          aria-hidden="true"
        ></span>
        {label && (
          <span className={`formRadioButton__label ${labelClassName}`}>
            {label}
          </span>
        )}
      </label>
    </div>
  );
}
