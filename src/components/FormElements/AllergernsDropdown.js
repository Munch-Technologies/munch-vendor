import { ChevronDown } from "assets/icons";
import React, { useEffect, useRef, useState } from "react";
import { capitalizeFirstLetter } from "utils/capitalize";
import Checkbox from "./Checkbox";

const allAllergens = [
  "egg",
  "milk",
  "gluten",
  "lupin",
  "fish",
  "crustacean",
  "nuts",
];
export default function AllergensDropdown({
  allergens,
  setAllergens,
  className,
  ...props
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [noAllergens, setNoAllergens] = useState(!Boolean(allergens?.length));
  const toggleAllergen = (add, item) => {
    if (add) {
      setAllergens([...allergens, item]);
      setNoAllergens(false);
    } else {
      setAllergens(allergens.filter((i) => i === "item"));
    }
  };

  const toggleNoAllergen = (add) => {
    if (add) {
      setAllergens([]);
    }
    setNoAllergens((o) => !o);
  };

  const allergenList = useRef();

  useEffect(() => {
    if (props.disabled) setIsOpen(false);
  }, [props.disabled]);

  return (
    <div
      className={`${className} allergensDropdown`}
      tabIndex={0}
      onBlur={(e) => {
        if (
          e.relatedTarget === allergenList.current ||
          allergenList.current.contains(e.relatedTarget)
        )
          return;
        setIsOpen(false);
      }}
      {...props}
    >
      <button
        className={`allergensDropdown-button ${className}-button ${
          props.disabled ? "disabled" : ""
        }`}
        onClick={() => !props.disabled && setIsOpen((o) => !o)}
      >
        <span>Select allergens</span>
        <ChevronDown />
      </button>
      {isOpen && (
        <ul
          ref={allergenList}
          className={`card allergensDropdown-list ${className}-list`}
        >
          {allAllergens.map((allergen) => (
            <li key={allergen} tabIndex={0}>
              <Checkbox
                label={capitalizeFirstLetter(allergen)}
                isChecked={allergens.includes(allergen)}
                setIsChecked={(add) => toggleAllergen(add, allergen)}
              />
            </li>
          ))}
          <li tabIndex={0}>
            <Checkbox
              label="This item contains no known allergen"
              isChecked={noAllergens}
              setIsChecked={toggleNoAllergen}
            />
          </li>
        </ul>
      )}
    </div>
  );
}
