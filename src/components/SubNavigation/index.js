import Button from "components/Button/Button";
import React, { useLayoutEffect, useRef } from "react";
import { capitalizeFirstLetter } from "utils/capitalize";

export default function SubNavigation({
  className,
  navList,
  onSelect,
  selected,
  variant,
}) {
  const selectItem = (e, item) => {
    const itemElement = e.currentTarget;
    onSelect(item);
    let left =
      itemElement.getBoundingClientRect().left -
      navWrapRef.current.getBoundingClientRect().left;
    let width = itemElement.offsetWidth;

    activeNavBacground.current.style.left = `${left}px`;
    activeNavBacground.current.style.width = `${width}px`;
  };

  const navItemRefs = useRef([]);
  const activeNavBacground = useRef();
  const navWrapRef = useRef();

  useLayoutEffect(() => {
    const itemElement = navItemRefs.current.find((element) =>
      element.querySelector("button").classList.contains("active")
    );
    let left =
      itemElement.getBoundingClientRect().left -
      navWrapRef.current.getBoundingClientRect().left;
    let width = itemElement.offsetWidth;

    activeNavBacground.current.style.left = `${left}px`;
    activeNavBacground.current.style.width = `${width}px`;
  }, []);

  return (
    <div
      ref={navWrapRef}
      className={`subNavigation ${
        variant === "underlined" ? "underlined" : null
      } ${className}`}
    >
      <span ref={activeNavBacground} className="subNavigation-highlight"></span>
      {navList.map((item, index) => (
        <span key={index} ref={(ref) => (navItemRefs.current[index] = ref)}>
          <Button
            title={capitalizeFirstLetter(item.title ?? item)}
            onClick={(e) => selectItem(e, item)}
            className={`subNavigation-button ${className}-button ${
              selected === item ||
              selected === item.value ||
              selected === item.title
                ? "active"
                : ""
            }`}
          />
        </span>
      ))}
    </div>
  );
}
