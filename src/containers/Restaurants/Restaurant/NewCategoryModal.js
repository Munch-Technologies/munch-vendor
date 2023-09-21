import { CloseIcon, LoadingSpinner } from "assets/icons";
import { Button, ModalInput, TextArea } from "components";
import AllergensDropdown from "components/FormElements/AllergernsDropdown";
import React, { memo, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

function NewCategoryModal({
  initialData,
  close,
  onAddCategory,
  isLoading,
  isSuccess,
  isError,
  error,
}) {
  const { restaurantId } = useParams();

  const [data, setData] = useState({
    name: "",
    description: "",
    position: 0,
    allergens: [],
    restaurant_id: restaurantId,
    ...(initialData || {}),
  });
  const setAllergens = (allergens) => setData({ ...data, allergens });

  const addCategory = () => {
    onAddCategory({ ...data });
  };

  const formRef = useRef();

  useEffect(() => {
    if (isSuccess) {
      close();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  return (
    <div className="newCategoryModal">
      <div className="newCategoryModal__header">
        <h3 className="newCategoryModal__header-title">
          {initialData ? "Edit Category" : "New Category"}
        </h3>
        <CloseIcon onClick={close} />
      </div>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="newCategoryModal__form"
        ref={formRef}
      >
        <div className="newCategoryModal__form-name">
          <ModalInput
            label="Name"
            placeholder="Eg Soft Drink"
            className="newCategoryModal__form-name-input"
            hint="The name of the item should help customers navigate through categories"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            disabled={isLoading}
          />
        </div>
        <div className="newCategoryModal__form-description">
          <TextArea
            label="Description"
            className="newCategoryModal__form-description-input"
            labelClassName="newCategoryModal__form-description-label"
            hint="This should give your customers an idea of what is present in the category"
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            disabled={isLoading}
          />
        </div>
        <div className="newCategoryModal__form-allergens">
          <p className="newCategoryModal__form-allergens-label">Allergens</p>
          <AllergensDropdown
            className="newCategoryModal__form-allergens"
            allergens={data.allergens || []}
            setAllergens={setAllergens}
            disabled={isLoading}
          />
        </div>
        <div className="newCategoryModal__form-position">
          <ModalInput
            type="number"
            label="Position"
            placeholder="123"
            className="newCategoryModal__form-position-input"
            value={data.position}
            onChange={(e) =>
              setData({ ...data, position: Number(e.target.value) })
            }
            disabled={isLoading}
          />
        </div>
        {isError && (
          <div className="newCategoryModal__form-error">{error.message}</div>
        )}
        <div className="newCategoryModal__form-action">
          <Button
            title="Close"
            className="close"
            onClick={close}
            disabled={isLoading}
          />
          <Button
            className={`add ${isError && "error"}`}
            onClick={addCategory}
            disabled={isLoading}
            title={isError ? "Retry" : initialData ? "Save" : "Add Category"}
            iconLeft={isLoading ? <LoadingSpinner /> : null}
          />
        </div>
      </form>
    </div>
  );
}

export default memo(NewCategoryModal);
