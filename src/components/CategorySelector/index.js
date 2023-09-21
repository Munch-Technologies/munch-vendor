import { LoadingSpinner } from "assets/icons";
import ModalInput from "components/FormElements/ModalInput";
import { matchSorter } from "match-sorter";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { useClient } from "utils/apiClient";

export default function CategorySelector({
  value,
  setValue,
  restaurantId,
  ...props
}) {
  const [isOpen, setIsOpen] = useState(false);

  const client = useClient();

  const {
    isIdle,
    isLoading,
    data: categories,
  } = useQuery(
    ["restaurantCategories", { restaurantId }],
    () => client(`/admin/restaurant/${restaurantId}/category`)
    // client(`/admin/restaurant/cl3hlzll90000khdmgk1n5c0x/category`)
  );

  // console.log("categories", categories);

  const filterredCategories = value?.name
    ? matchSorter(categories ?? [], value?.name.toLowerCase(), {
        keys: ["name"],
      })
    : categories;

  // categories?.filter((category) => {
  //       return category.name.toLowerCase().includes(value.name.toLowerCase());
  //     })

  const selectCategory = (category) => {
    setIsOpen(false);
    setValue({ name: category.name, id: category.id });
  };

  const setSelectedCategory = (input) => {
    if (!input) {
      setValue({ name: "" });
      return;
    }
    let choosen = categories.find((category) => category.name === input);
    if (choosen) {
      setValue({ name: choosen.name, id: choosen.id });
    } else {
      setValue({ name: input });
    }
  };

  return (
    <div className="categorySelector">
      <ModalInput
        label="Category"
        placeholder="Enter item category"
        value={value?.name ?? ""}
        onChange={(e) => {
          setSelectedCategory(e.target.value);
          setIsOpen(true);
        }}
        {...props}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setSelectedCategory(e.target.value);
            setIsOpen(false);
          }
        }}
        onBlur={() => setIsOpen(false)}
      />
      {isOpen &&
        (isLoading || isIdle ? (
          <div className="spinner">
            <LoadingSpinner />
          </div>
        ) : filterredCategories?.length > 0 ? (
          <div className="categorySelector__list">
            <>
              {filterredCategories.map((category) => (
                <div
                  key={category.id}
                  className="categorySelector__list-item"
                  onMouseDown={() => selectCategory(category)}
                >
                  {category.name}
                </div>
              ))}
            </>
          </div>
        ) : null)}
    </div>
  );
}
