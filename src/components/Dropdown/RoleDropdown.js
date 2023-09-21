import { ChevronDown } from "assets/icons";
import Button from "components/Button/Button";
import React, { useState } from "react";
import { capitalizeFirstLetter } from "utils/capitalize";

export default function RoleDropdown({
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

  return (
    <div
      className={`${className} roleDropdown`}
      tabIndex={0}
      onBlur={() => setIsOpen(false)}
      {...props}
    >
      <Button
        onClick={() => setIsOpen((o) => !o)}
        titleClass={`roleDropdown-title`}
        className={`roleDropdown-button`}
        title={capitalizeFirstLetter(status)}
        iconRight={<ChevronDown />}
      />
      {isOpen && (
        <ul>
          <li className="infotext" onMouseDown={() => select("admin")}>
            <div className="bodytext">Admin</div>
            <div className="subtext">Can access all features and controls</div>
          </li>
          <li className="infotext" onMouseDown={() => select("support")}>
            <div className="bodytext">Support</div>
            <div className="subtext">
              Can access specific features with controls
            </div>
          </li>
          <li className="infotext" onMouseDown={() => select("marketing")}>
            <div className="bodytext">Marketing</div>
            <div className="subtext">
              Can access all features with no controls
            </div>
          </li>
        </ul>
      )}
    </div>
  );
}
