import React, { useState } from "react";
import { ChevronDown } from "assets/icons";
import Button from "components/Button/Button";

export default function DropdownInput({
  list,
  onSelect,
  value,
  placeholder,
  label,
  className,
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="dropdownInput" tabIndex={0} onBlur={() => setIsOpen(false)}>
      {label && <p className="dropdownInput__label">{label}</p>}
      <Button
        className={`dropdownInput__button ${className}`}
        title={value ?? placeholder}
        iconRight={<ChevronDown />}
        onClick={() => {
          if (!disabled) setIsOpen((o) => !o);
        }}
      />
      {isOpen && (
        <ul className="card dropdownInput__list">
          {list.map((listItem) => {
            let isObject = typeof listItem === "object";

            return (
              <li
                key={isObject ? listItem.value : listItem}
                className={`dropdown__list-item ${
                  isObject && !listItem.available && "disabled"
                }`}
                onMouseDown={() => {
                  setIsOpen(false);
                  if (!isObject) {
                    onSelect(listItem);
                    return;
                  }
                  if (listItem.available) onSelect(listItem.value);
                }}
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
