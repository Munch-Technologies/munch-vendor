import { ChevronDown } from "assets/icons";
import Button from "components/Button/Button";
import React, { useEffect, useState } from "react";
import { capitalizeFirstLetter } from "utils/capitalize";

export default function ActionsDropdown({
  status,
  setStatus,
  className,
  ...props
}) {
  const [isOpen, setIsOpen] = useState(false);

  const select = (value) => {
    setIsOpen(!isOpen);
    value && setStatus(value);
  };

  useEffect(() => {
    if (props.disabled) setIsOpen(false);
  }, [props.disabled]);

  return (
    <div
      className={`actionDropdown ${className}`}
      tabIndex={0}
      onBlur={() => setIsOpen(false)}
      {...props}
    >
      <Button
        onClick={() => setIsOpen((o) => !o)}
        titleClass={"actionDropdown-title"}
        className={`actionDropdown-button ${className}-button ${
          props.disabled ? "disabled" : ""
        }`}
        title={status ? capitalizeFirstLetter(status) : "Actions"}
        iconRight={<ChevronDown />}
      />
      {isOpen && (
        <ul>
          {status !== "rejected" && (
            <li className="infotext red" onMouseDown={() => select("rejected")}>
              Don't Approve
            </li>
          )}
          {status !== "approved" && (
            <li
              className="infotext green"
              onMouseDown={() => select("approved")}
            >
              Approve Picture
            </li>
          )}
          <li className="infotext grey" onMouseDown={() => select("delete")}>
            Delete Picture
          </li>
        </ul>
      )}
    </div>
  );
}
