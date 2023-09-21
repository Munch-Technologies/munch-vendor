import React, { useEffect, useRef, useState } from "react";
import { capitalizeFirstLetter } from "utils/capitalize";

export default function CustomDropdown({
  header,
  list,
  onSelect,
  align = "left",
  className = "",
  small,
  onOpenClose,
}) {
  const [isOpen, setIsOpenHandler] = useState(false);
  const firstRender = useRef(true);
  useEffect(() => {
    if (!firstRender.current) {
      onOpenClose && onOpenClose(isOpen);
    }
    firstRender.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <div className={`dropdown ${className}`} tabIndex={0}>
      <div
        onClick={() => setIsOpenHandler((o) => !o)}
        onBlur={() => setIsOpenHandler(false)}
        style={{ cursor: "pointer" }}
        tabIndex={0}
      >
        {header}
      </div>
      {isOpen && (
        <ul
          className="dropdown__list"
          style={{
            left: align === "left" ? "0" : "auto",
            right: align === "left" ? "auto" : "0",
          }}
        >
          {list.map((listItem) => {
            let isObject = typeof listItem === "object";

            return (
              <li
                key={isObject ? listItem.value : listItem}
                className={`dropdown__list-item ${small && "small"} ${
                  isObject && !listItem.available && "disabled"
                } ${isObject && listItem.className && listItem.className}`}
                onMouseDown={() => {
                  setIsOpenHandler(false);
                  if (isObject && !listItem.available) return;
                  onSelect(listItem);
                }}
              >
                {capitalizeFirstLetter(isObject ? listItem.text : listItem)}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
