import React, { forwardRef, useId } from "react";

const TextArea = forwardRef(
  ({ labelClassName, className, label, hint, ...props }, ref) => {
    const id = useId();
    return (
      <>
        {label && (
          <label className={`formInputLabel ${labelClassName}`} htmlFor={id}>
            {label}
          </label>
        )}
        <textarea
          className={`formTextArea ${className}`}
          id={id}
          cols="30"
          rows="10"
          {...props}
          ref={ref}
        ></textarea>
        {hint && <p className="modalInputHint">{hint}</p>}
      </>
    );
  }
);

export default TextArea;
