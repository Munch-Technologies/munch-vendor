import { ChevronDown } from "assets/icons";
import Button from "components/Button/Button";
import React, { useState } from "react";
import { capitalizeFirstLetter } from "utils/capitalize";

export default function ApproveDropdown({
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
      className={`${className} approveDropdown`}
      tabIndex={0}
      onBlur={() => setIsOpen(false)}
      {...props}
    >
      <Button
        onClick={() => setIsOpen((o) => !o)}
        titleClass={`approveDropdown-${status}-title`}
        className={`approveDropdown-${status}-button`}
        title={capitalizeFirstLetter(status)}
        iconRight={<ChevronDown />}
      />
      {isOpen && (
        <ul>
          <li className="infotext" onMouseDown={() => select("pending")}>
            Pending
          </li>
          <li className="infotext" onMouseDown={() => select("suspended")}>
            Suspended
          </li>
          <li className="infotext" onMouseDown={() => select("approved")}>
            Approved
          </li>
          <li className="infotext" onMouseDown={() => select("rejected")}>
            Rejected
          </li>
        </ul>
      )}
    </div>
  );
}
