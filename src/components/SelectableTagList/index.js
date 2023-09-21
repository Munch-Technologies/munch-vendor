import React from "react";

export default function SelectableTagList({
  tags,
  selected,
  onClick,
  className,
  ...props
}) {
  return (
    <div className={`selectableTagList ${className}`} {...props}>
      {tags.map((tag, index) => (
        <span
          key={index}
          className={`selectableTagList__tag ${
            selected.includes(tag) ? "selected" : ""
          }`}
          onClick={() => onClick(tag)}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
