import React, { useState } from "react";
import { ChevronDown, FilterIcon } from "../../assets/icons";

const FilterInput = () => {
  const [value, setValue] = useState("");

  return (
    <div className="filter">
      <div>
        <FilterIcon />
      </div>
      <h4 className="filter__text">Filter by:</h4>
      <div className="filter__input">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <ChevronDown />
      </div>
    </div>
  );
};

export default FilterInput;
