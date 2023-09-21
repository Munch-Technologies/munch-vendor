import React, { forwardRef, useId } from "react";

const ModalInput = forwardRef(
  ({ labelClassName, className, label, type, hint, ...props }, ref) => {
    const id = useId();
    return (
      <>
        {label && (
          <label className={`modalInputLabel ${labelClassName}`} htmlFor={id}>
            {label}
          </label>
        )}
        <input
          className={`modalInput ${className}`}
          type={type ?? "text"}
          id={id}
          {...props}
          ref={ref}
        />
        {hint && <p className="modalInputHint">{hint}</p>}
      </>
    );
  }
);
export default ModalInput;
