import {
  AddImageIcon,
  CameraIcon,
  CircleCheck,
  CloseIcon,
  LoadingSpinner,
} from "assets/icons";
import { ToggleButtton } from "components";
import Button from "components/Button/Button";
import ActionsDropdown from "components/Dropdown/ActionsDropdown";
import AllergensDropdown from "components/FormElements/AllergernsDropdown";
import ModalInput from "components/FormElements/ModalInput";
import RadioGroup from "components/FormElements/RadioGroup";
import TextArea from "components/FormElements/TextArea";
import ErrorButton from "components/ErrorButton";
import ModifierModal from "components/ModifierModal";
import CategorySelector from "components/CategorySelector";
import Pill from "components/Pill";
import { useEffect, useReducer, useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useClient } from "utils/apiClient";
import { memo } from "react";
import apiAxios from "apis/apiAxios";

export default function MenuItemModal({
  item,
  close,
  onItemSave,
  saveAction,
  restaurantId,
  newItem,
  fromCategory,
}) {
  const [status, setStatus] = useState("initial");

  const [itemImage, setItemImage] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [newImage, setNewImage] = useState();

  // console.log("image", image);

  const change = useRef();
  const queryClient = useQueryClient();
  const client = useClient();

  useEffect(() => {
    //prefetch restaurant categories and modifiers
    queryClient.prefetchQuery(["restaurantCategories", { restaurantId }], () =>
      client(`/admin/restaurant/${restaurantId}/category`)
    );
    queryClient.prefetchQuery(["restaurantModifiers", { restaurantId }], () =>
      client(`/admin/restaurant/${restaurantId}/modifier`)
    );
  }, [client, queryClient, restaurantId]);

  const { mutate, isLoading, isError, error, reset } = useMutation(
    (data) => {
      if (change.current === "availability") {
        return client(
          `/admin/restaurant/${restaurantId}/menuitem/${item.id}/availability`,
          {
            data,
          }
        );
      } else {
        if (newItem) {
          // Create new item
          const formdata = new FormData();
          formdata.append("media", itemImage);
          // for (const [key, value] of Object.entries(data)) {
          //   formdata.append(key, value);
          // }
          // console.log("formdata", data);
          // return client(`/admin/restaurant/${restaurantId}/menu-item`, {
          //   method: "POST",
          //   data: formdata,
          // });

          return apiAxios.post(`/admin/upload-media`, formdata).then((res) => {
            console.log("response", res.data.payload);

            return client(`/admin/restaurant/${restaurantId}/menu-item`, {
              method: "POST",
              data: {
                ...data,
                image: res.data.payload,
                minimum_price: data.minimum_price
                  ? parseFloat(data.minimum_price)
                  : 0.0,
              },
            });
          });

          // return new Promise((resolve1, reject) => {
          //   resolve1("image path");
          // }).then((data) => {
          //   return new Promise((resolve2, reject) => {
          //     console.log("promise 1 resolved", data);
          //     setTimeout(() => {
          //       console.log("promise 2 resolved");
          //       resolve2("promise 2 resolved");
          //     }, 3000);
          //   });
          // });
        } else {
          // Update existing item

          let a = client(
            `/admin/restaurant/${item.restaurant_id}/menu-items/${item.id}`,
            {
              method: "PATCH",
              data: {
                ...data,
                minimum_price: data.minimum_price
                  ? parseFloat(data.minimum_price)
                  : 0.0,
              },
            }
          );

          if (newImage) {
            console.log("uploading image");

            const formData = new FormData();
            formData.append("media", newImage);
            let b = apiAxios.patch(
              `/admin/restaurant/${item.restaurant_id}/menu-items/${item.id}/image`,
              formData
            );

            return Promise.all([a, b]);
          }
          return a;
        }
      }
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["restaurantMenuData", { restaurantId }]);
        if (change.current === "item") {
          // console.log("running on success");
          close();
          if (onItemSave) {
            if (!data.image && newImage) {
              console.log("Image upload success");
              onItemSave({ ...data, image: URL.createObjectURL(newImage) });
            } else {
              onItemSave(data);
            }
          }
        }
        change.current = null;
      },
      onError: (error, data) => {
        if (change.current === "availability") {
          dispatch({ type: "revertAvailability", payload: !data.availability });
        }
      },
    }
  );

  const reducer = (state, action) => {
    switch (action.type) {
      case "toggleAvailability": {
        change.current = "availability";
        mutate({ availability: !state.is_available });
        return {
          ...state,
          is_available: !state.is_available,
        };
      }
      case "revertAvailability": {
        return {
          ...state,
          is_available: action.payload,
        };
      }
      case "setImageStatus": {
        if (action.payload === "delete") {
          return {
            ...state,
            image: null,
            image_status: null,
          };
        }
        return {
          ...state,
          image_status: action.payload,
        };
      }
      case "setInputData":
        return {
          ...state,
          [action.payload.data]: action.payload.value,
        };
      case "setModifierAvailability": {
        let value = action.payload === "yes";
        return { ...state, has_modifiers: value };
      }
      default:
        return state;
    }
  };

  const saveChanges = () => {
    change.current = "item";
    mutate(itemData);
  };

  const closeModifierModal = () => {
    setStatus("initial");
  };

  const onModifierSave = (modifiers) => {
    setStatus("initial");
    dispatch({
      type: "setInputData",
      payload: { data: "modifiers", value: modifiers },
    });
  };

  const [itemData, dispatch] = useReducer(reducer, {
    available: false,
    tax: "",
    has_modifiers: true,
    pos_id: "",
    position: 0,
    allergens: [],
    modifiers: [],
    ...item,
  });

  const changeImage = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageUrl(URL.createObjectURL(e.target.files[0]));
      // dispatch({
      //   type: "changeImage",
      // });
      setNewImage(e.target.files[0]);
    }
  };

  // const setAllergens = (allergens) => setData({ ...data, allergens });

  if (status === "initial") {
    return (
      <div className="itemModal">
        <div className="itemModal__close" onClick={close}>
          <CloseIcon />
        </div>
        <>
          <h4 className="itemModal__header">
            {newItem ? "New Item" : "Edit Item"}
          </h4>
          {!newItem && (
            <div className="itemModal__status">
              {isLoading && change.current === "availability" ? (
                <LoadingSpinner />
              ) : isError && change.current === "availability" ? (
                <>
                  <ErrorButton
                    className="itemModal__status-error"
                    onClick={reset}
                  />
                  <p className="itemModal__status-error" onClick={reset}>
                    {error.message}
                  </p>
                </>
              ) : null}
              {itemData?.is_available ? "Available" : "Unavailable"}
              <ToggleButtton
                on={itemData?.is_available ?? false}
                toggle={() => dispatch({ type: "toggleAvailability" })}
                disabled={isLoading && change.current === "availability"}
              />
            </div>
          )}
          {newItem && <MemoizedItemImageSelector setImage={setItemImage} />}
          {!newItem && (
            <div className="card itemModal__picture">
              <div
                className="image itemModal__picture-pic"
                role="img"
                aria-label={item.title}
                title={item.title}
                style={{
                  backgroundImage: `url("${imageUrl ?? itemData.image}")`,
                  width: "8rem",
                }}
              >
                <label className="restaurantimage-pic-button" role={"button"}>
                  <AddImageIcon />
                  <input type="file" accept="image/*" onChange={changeImage} />
                </label>
              </div>
              {/* <h5 className="itemModal__picture-title">{item?.title}</h5> */}
              {itemData?.image_status && (
                <div
                  className={`itemModal__picture-status ${itemData?.image_status}`}
                >
                  {itemData?.image_status === "approved" && <CircleCheck />}
                  {itemData?.image_status === "approved"
                    ? "Image approved"
                    : "Image suspended"}
                </div>
              )}
              <ActionsDropdown
                className="itemModal__picture-dropdown"
                status={itemData?.image_status}
                setStatus={(status) =>
                  dispatch({ type: "setImageStatus", payload: status })
                }
                disabled={isLoading && change.current === "item"}
              />
            </div>
          )}
          <div className="itemModal__form">
            <div className="itemModal__form-name">
              <ModalInput
                label="Name"
                placeholder="Enter item name"
                value={itemData.name ?? ""}
                onChange={(e) =>
                  dispatch({
                    type: "setInputData",
                    payload: { data: "name", value: e.target.value },
                  })
                }
                className="itemModal__form-name"
                style={{ marginBottom: 0 }}
                disabled={isLoading && change.current === "item"}
                hint="The name of the item should help customer find the item in the
            category"
              />
            </div>
            <CategorySelector
              value={itemData?.menu_category}
              setValue={(value) =>
                dispatch({
                  type: "setInputData",
                  payload: { data: "menu_category", value },
                })
              }
              restaurantId={restaurantId}
              className="itemModal__form-category"
              disabled={
                (isLoading && change.current === "item") || fromCategory
              }
            />
            <div className="itemModal__form-description">
              <TextArea
                label="Description"
                value={itemData?.description ?? ""}
                onChange={(e) =>
                  dispatch({
                    type: "setInputData",
                    payload: { data: "description", value: e.target.value },
                  })
                }
                className="itemModal__form-description"
                disabled={isLoading && change.current === "item"}
                style={{ marginBottom: 0 }}
                hint="This should give your customers an idea of what the Item entails"
              />
            </div>
            <div className="inputWrap">
              <div>
                <ModalInput
                  label="Price"
                  placeholder="£ 0.00"
                  value={itemData?.minimum_price ?? ""}
                  onChange={(e) =>
                    dispatch({
                      type: "setInputData",
                      payload: { data: "minimum_price", value: e.target.value },
                    })
                  }
                  className="itemModal__form-price"
                  disabled={isLoading && change.current === "item"}
                />
              </div>
              <div>
                <ModalInput
                  label="Tax"
                  placeholder="WWW"
                  value={itemData?.tax ?? ""}
                  onChange={(e) =>
                    dispatch({
                      type: "setInputData",
                      payload: { data: "tax", value: e.target.value },
                    })
                  }
                  className="itemModal__form-tax"
                  disabled={isLoading && change.current === "item"}
                />
              </div>
            </div>

            <div className="inputWrap">
              <div>
                <ModalInput
                  label="Point of Sale ID"
                  placeholder="www"
                  value={itemData?.pos_id ?? ""}
                  onChange={(e) =>
                    dispatch({
                      type: "setInputData",
                      payload: { data: "pos_id", value: e.target.value },
                    })
                  }
                  className="itemModal__form-posId"
                  disabled={isLoading && change.current === "item"}
                />
              </div>
              <div>
                <ModalInput
                  label="Position"
                  placeholder="0"
                  value={itemData?.position ?? ""}
                  onChange={(e) =>
                    dispatch({
                      type: "setInputData",
                      payload: {
                        data: "position",
                        value: Number(e.target.value),
                      },
                    })
                  }
                  className="itemModal__form-position"
                  disabled={isLoading && change.current === "item"}
                />
              </div>
            </div>
            <AllergensDropdown
              allergens={itemData.allergens ? itemData.allergens : []}
              setAllergens={(value) =>
                dispatch({
                  type: "setInputData",
                  payload: { data: "allergens", value },
                })
              }
              className="itemModal__form-allergens"
              disabled={isLoading && change.current === "item"}
            />

            <RadioGroup
              value={itemData?.has_modifiers ? "yes" : "no"}
              options={["yes", "no"]}
              label="Modifiers"
              name="isModifierAvailable"
              onChange={(option) =>
                dispatch({
                  type: "setModifierAvailability",
                  payload: option,
                })
              }
              disabled={isLoading && change.current === "item"}
            />

            {itemData?.has_modifiers &&
              (itemData.modifiers && itemData.modifiers.length) > 0 && (
                <div className="itemModal__form-modifiers">
                  {itemData.modifiers.map((modifier) => (
                    <Pill key={modifier.id}>{modifier.name}</Pill>
                  ))}
                </div>
              )}
            {itemData?.has_modifiers && (
              <Button
                title={
                  itemData.modifiers?.length > 0
                    ? "Edit Modifiers"
                    : "Add Modifiers"
                }
                onClick={() => setStatus("modifiers")}
                className="itemModal__form-viewModifiers"
                disabled={isLoading && change.current === "item"}
              />
            )}
          </div>
          {isError && change.current === "item" && (
            <div className="itemModal__error">
              <ErrorButton />
              <p>{error.message}</p>
            </div>
          )}
          <div className="itemModal__actions">
            <Button
              className="delete"
              title="Cancel"
              onClick={close}
              disabled={isLoading && change.current === "item"}
            />
            <Button
              className="save"
              title={saveAction ?? "Save"}
              iconLeft={
                isLoading && change.current === "item" ? (
                  <LoadingSpinner />
                ) : null
              }
              onClick={saveChanges}
              disabled={isLoading && change.current === "item"}
            />
          </div>
        </>
      </div>
    );
  } else if (status === "modifiers") {
    return (
      <ModifierModal
        initialModifiers={itemData?.modifiers}
        onSave={onModifierSave}
        onCancel={closeModifierModal}
        saveAction="Save"
        cancelAction="Cancel"
        restaurantId={restaurantId}
      />
    );
  }
}

const ItemImageSelector = ({ setImage }) => {
  const [itemImage, setItemImage] = useState();
  const changeImage = (e) => {
    if (e.target.files && e.target.files[0]) {
      setItemImage(e.target.files[0]);
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className="newCategoryModal__form-imageInput">
      <div
        className="placeholder"
        {...(itemImage
          ? {
              role: "img",
              ariaLabel: "category image",
              title: "category image",
              style: {
                backgroundImage: `url(${URL.createObjectURL(itemImage)})`,
              },
            }
          : {})}
      >
        {!itemImage && (
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
            title={itemImage ? "Change Photo" : "Add Photo"}
            className="instructions-action-button"
          />
          <input type="file" accept="image/*" onChange={changeImage} />
        </label>
      </div>
    </div>
  );
};

const MemoizedItemImageSelector = memo(ItemImageSelector);
