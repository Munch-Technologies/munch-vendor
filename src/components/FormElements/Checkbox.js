import React, { useId } from "react";

export default function Checkbox({
  isChecked,
  setIsChecked,
  label,
  labelClassName,
  className,
  ...props
}) {
  const id = useId();
  return (
    <div htmlFor={id} className="formCheckbox">
      <label>
        <input
          type="checkbox"
          onChange={() => {
            setIsChecked(!isChecked);
          }}
          id={id}
          {...props}
        />
        <span
          className={`formCheckbox__checkbox ${
            isChecked ? "checkbox--active" : ""
          } ${className}`}
          aria-hidden="true"
          style={{
            backgroundColor: isChecked ? "#fff" : "",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M1.76423 0H18.196C19.1663 0 19.9602 0.805238 19.9602 1.78963V18.1103C19.9602 19.0947 19.1666 19.9003 18.196 19.9003H1.76423C0.793862 19.9003 0 19.0947 0 18.1103V1.78963C0 0.805238 0.79365 0 1.76423 0ZM3.16365 10.4619L4.63312 8.57492L8.55857 11.8122L15.0099 4.7381L16.7965 6.33947L8.80862 15.1628L3.16365 10.4619Z"
              fill="#00A642"
            />
          </svg>
        </span>
        {label && (
          <span className={`formCheckbox__label ${labelClassName}`}>
            {label}
          </span>
        )}
      </label>
    </div>
  );
}
