import { CameraIcon, CloseIcon } from "assets/icons";
import { Button, ModalInput, TextArea } from "components";
import AllergensDropdown from "components/FormElements/AllergernsDropdown";
import React, { useState } from "react";

export default function NewItemModal({ close, onAddItem }) {
  const [imageUrl, setImageUrl] = useState();
  const [allergens, setAllergens] = useState([]);

  const changeImage = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="newCategoryModal">
      <div className="newCategoryModal__header">
        <h3 className="newCategoryModal__header-title">New Item</h3>
        <CloseIcon onClick={close} />
      </div>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="newCategoryModal__form"
      >
        <div className="newCategoryModal__form-imageInput">
          <div
            className="placeholder"
            {...(imageUrl
              ? {
                  role: "img",
                  ariaLabel: "category image",
                  title: "category image",
                  style: {
                    backgroundImage: `url(${imageUrl})`,
                  },
                }
              : {})}
          >
            {!imageUrl && (
              <>
                <CameraIcon />
                <p className="placeholder-title">No Photo</p>
                <p>size; min 1200 by 800pixels (.jpg .Png-18MB)</p>
              </>
            )}
          </div>
          <div className="instructions">
            <p className="instructions-header">Make sure the picture is:</p>
            <p>Ready to serve</p>
            <p>Brightly lit and in focus</p>
            <p>Large and centered</p>

            <p className="instructions-example">
              <a href="/">See examples</a>
            </p>
            <label className="instructions-action">
              <Button
                title={imageUrl ? "Change Photo" : "Add Photo"}
                className="instructions-action-button"
              />
              <input type="file" accept="image/*" onChange={changeImage} />
            </label>
          </div>
        </div>
        <div className="newCategoryModal__form-name">
          <ModalInput
            label="Name"
            placeholder="E.g Plantain Fritata"
            className="newCategoryModal__form-name-input"
            hint="The name of the item should help customer find the item in the
            category"
          />
        </div>
        <div className="newCategoryModal__form-description">
          <TextArea
            label="Description"
            placeholder="E.g Plantain Fritata"
            className="newCategoryModal__form-description-input"
            labelClassName="newCategoryModal__form-description-label"
            hint="This should give your customers an idea of what the Item entails"
          />
        </div>
        <div className="newCategoryModal__form-inputWrap">
          <div className="newCategoryModal__form-price">
            <ModalInput
              label="Price"
              placeholder="£ 0.00"
              className="newCategoryModal__form-price-input"
            />
          </div>
          <div className="newCategoryModal__form-tax">
            <ModalInput
              label="Tax"
              placeholder="www"
              className="newCategoryModal__form-tax-input"
            />
          </div>
        </div>
        <div className="newCategoryModal__form-allergens">
          <p className="newCategoryModal__form-allergens-label">Allergens</p>
          <AllergensDropdown
            className="newCategoryModal__form-allergens"
            allergens={allergens}
            setAllergens={setAllergens}
          />
        </div>
        <div className="newCategoryModal__form-position">
          <ModalInput
            label="Position"
            placeholder="123"
            className="newCategoryModal__form-position-input"
          />
        </div>

        <div className="newCategoryModal__form-action">
          <Button title="Close" className="close" onClick={close} />
          <button className="add">Add Item</button>
        </div>
      </form>
    </div>
  );
}
