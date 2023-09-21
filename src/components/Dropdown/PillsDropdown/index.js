import React, { useState } from "react";
import { ChevronDown } from "assets/icons";
import Pill from "components/Pill";

export default function PillsDropdown({ list, onSelect, value }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="dropdown" tabIndex={0} onBlur={() => setIsOpen(false)}>
      <Pill onClick={() => setIsOpen((o) => !o)} style={{ cursor: "pointer" }}>
        <div className="pills__text">{value}</div>
        <ChevronDown />
      </Pill>
      {isOpen && (
        <ul className="dropdown__list">
          {list.map((listItem) => {
            let isObject = typeof listItem === "object";

            return (
              <li
                key={isObject ? listItem.value : listItem}
                className={`dropdown__list-item ${
                  isObject && !listItem.available && "disabled"
                }`}
                onClick={() => {
                  setIsOpen(false);
                  if (isObject && !listItem.available) return;
                  onSelect(listItem);
                }}
              >
                {isObject ? listItem.text : listItem}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
