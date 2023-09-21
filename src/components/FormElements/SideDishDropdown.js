import React, { useState } from "react";
import { ChevronDown, DeleteIcon, EditIcon } from "assets/icons";
import { capitalizeFirstLetter } from "utils/capitalize";
export default function SideDishDropdown({
  title,
  items,
  editAction,
  deleteAction,
  className,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`sideDishDropdown ${className}`}
      tabIndex={0}
      onBlur={() => setIsOpen(false)}
    >
      <div className="topWrap">
        <button
          className={`sideDishDropdown-button ${className}-button`}
          onClick={() => setIsOpen((o) => !o)}
        >
          <span>{title}</span>
          <ChevronDown />
        </button>
        <EditIcon onClick={editAction} fill="#6C6C6C" />
        <DeleteIcon onClick={deleteAction} />
      </div>
      {isOpen && (
        <div className={`sideDishDropdown-list ${className}-list`}>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Price (£)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((listItem) => (
                <tr key={listItem.name}>
                  <td>{capitalizeFirstLetter(listItem.name)}</td>
                  <td>{listItem.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
