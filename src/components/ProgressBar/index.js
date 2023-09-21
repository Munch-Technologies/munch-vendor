import React from "react";

export default function ProgressBar({
  progress,
  className = "",
  thumbClassName = "",
  ...props
}) {
  return (
    <div className={`progressBar ${className}`} {...props}>
      <span
        className={`progressBar__thumb ${thumbClassName}`}
        style={{
          width: `${progress}%`,
        }}
      ></span>
    </div>
  );
}
