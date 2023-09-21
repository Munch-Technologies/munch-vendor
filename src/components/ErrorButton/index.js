import { CloseIcon } from "assets/icons";
import React from "react";

export default function ErrorButton({ retry, className, ...props }) {
  return (
    <div
      className={`errorButton ${className}`}
      style={{ cursor: retry ? "pointer" : "default" }}
      onClick={() => retry?.()}
      {...props}
    >
      <CloseIcon />
    </div>
  );
}
