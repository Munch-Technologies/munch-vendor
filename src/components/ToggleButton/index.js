import React from "react";

export default function ToggleButton({ on, toggle, disabled = false }) {
  return (
    <div
      className={`toggleButton ${on && "active"} ${disabled && "disabled"}`}
      onClick={toggle}
    >
      <span className="toggleButton__switch"></span>
    </div>
  );
}
