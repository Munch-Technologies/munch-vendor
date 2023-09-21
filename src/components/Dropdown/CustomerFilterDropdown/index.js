import { ChevronDown, FilterIcon } from "assets/icons";
import React, { useState } from "react";

export default function CustomerFilterDropdown({ list, onSelect, value }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      className="filterDropdown"
      tabIndex={0}
      onBlur={() => setIsOpen(false)}
    >
      <div className="filterDropdown__wrap">
        <div>
          <FilterIcon />
        </div>
        <h4 className="filterDropdown__text">Filter by:</h4>
        <div className="filterDropdown__wrapper">
          <div
            className="filterDropdown__input"
            onClick={() => setIsOpen((o) => !o)}
            style={{ cursor: "pointer" }}
          >
            <span>{value ?? "All"}</span>
            <ChevronDown />
          </div>
          {isOpen && (
            <ul className="filterDropdown__list">
              <li
                key="default"
                className="dropdown__list-item"
                onClick={() => {
                  setIsOpen(false);
                  onSelect(null);
                }}
              >
                All
              </li>
              {list.map((listItem) => {
                let isObject = typeof listItem === "object";

                return (
                  <li
                    key={
                      isObject
                        ? `${listItem.value.key}${listItem.value.filter}`
                        : listItem
                    }
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
      </div>
    </div>
  );
}
