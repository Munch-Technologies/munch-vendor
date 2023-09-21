import { RadioButton } from "components";
import React, { useId } from "react";
import { capitalizeFirstLetter } from "utils/capitalize";

export default function RadioGroup({
  label,
  labelClassName,
  radioClassName,
  radioTextClassName,
  options,
  name,
  value,
  onChange,
  disabled = false,
}) {
  const id = useId();
  return (
    <>
      {label && (
        <label className={`radioGroupLabel ${labelClassName}`} htmlFor={id}>
          {label}
        </label>
      )}
      <div className="radioGroupRadios">
        {options.map((option) => {
          if (typeof option !== "object") {
            return (
              <RadioButton
                key={option}
                label={capitalizeFirstLetter(option)}
                name={name}
                isChecked={value === option}
                setIsChecked={(state) => onChange(option)}
                className={radioClassName}
                labelClassName={radioTextClassName}
                disabled={disabled}
              />
            );
          }

          return (
            <RadioButton
              key={option.value}
              label={capitalizeFirstLetter(option.name)}
              name={name}
              isChecked={value === option.value}
              setIsChecked={(state) => onChange(option.value)}
              onChange={() => onChange(option.value)}
              className={radioClassName}
              labelClassName={radioTextClassName}
              disabled={disabled}
            />
          );
        })}
      </div>
    </>
  );
}
