import { ChevronDown } from "assets/icons";
import React, { useState } from "react";

export default function NumberDropdown({
  list,
  onSelect,
  value,
  min,
  max,
  className,
  ...props
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState(value);

  const setValue = () => {
    if (displayValue < min) {
      setDisplayValue(min);
      onSelect(min);

      return;
    }

    if (displayValue > max) {
      setDisplayValue(max);
      onSelect(max);

      return;
    }

    onSelect(displayValue);
  };

  const selectItem = (listItem) => {
    setIsOpen(false);
    if (!(typeof listItem === "object")) {
      setDisplayValue(listItem);
      onSelect(listItem);
      return;
    }
    if (listItem.available) {
      setDisplayValue(listItem.value);
      onSelect(listItem.value);
    }
  };

  return (
    <div
      className={`${className} dropdown`}
      tabIndex={0}
      onBlur={() => {
        setIsOpen(false);
        setValue();
      }}
      {...props}
    >
      <form
        className="number-input"
        onSubmit={(e) => {
          e.preventDefault();
          setValue();
        }}
      >
        <input
          type="text"
          value={displayValue}
          onChange={(e) => setDisplayValue(e.target.value)}
        />
        <div className="dropdownButton" onClick={() => setIsOpen((o) => !o)}>
          <ChevronDown />
        </div>
      </form>
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
                onClick={() => selectItem(listItem)}
              >
                {isObject ? listItem.value : listItem}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
