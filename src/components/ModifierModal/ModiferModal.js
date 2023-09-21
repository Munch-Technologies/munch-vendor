import { CloseIcon, DeleteIcon, LoadingSpinner, PlusIcon } from "assets/icons";
import Button from "components/Button/Button";
// import ConfirmationModal from "components/ConfirmationModal";
import ErrorButton from "components/ErrorButton";
import AllergensDropdown from "components/FormElements/AllergernsDropdown";
import ModalInput from "components/FormElements/ModalInput";
import RadioGroup from "components/FormElements/RadioGroup";
// import SideDishDropdown from "components/FormElements/SideDishDropdown";
import produce from "immer";
import React, { useReducer } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useClient } from "utils/apiClient";
// import { useClient } from "utils/apiClient";
// import { useModal } from "utils/hooks";
// import SubmodifierModal from "./SubmodifierModal";

export default function ModiferModal({
  initialModifier,
  close,
  onItemSave,
  restaurantId,
}) {
  const queryClient = useQueryClient();
  const client = useClient();
  // const [status, setStatus] = useState("modifiers");

  const { mutate, isLoading, isError, error } = useMutation(
    (data) => {
      if (data.id) {
        // console.log("updating modifier", data);
        // update existing modifier
        const modifierCopy = produce(data, (draft) => {
          draft.choice.forEach(
            (choice) =>
              (choice.additional_price = parseFloat(choice.additional_price))
          );
        });
        return client(`/admin/restaurant/${restaurantId}/modifier/${data.id}`, {
          method: "PATCH",
          data: modifierCopy,
        });
      } else {
        // create new modifier
        // console.log(data);
        const modifierCopy = produce(modifier, (draft) => {
          draft.choice.forEach(
            (choice) =>
              (choice.additional_price = parseFloat(choice.additional_price))
          );
        });

        console.log("creating modifier", modifierCopy, modifier);
        return client(`/admin/restaurant/${restaurantId}/modifier`, {
          method: "POST",
          data: modifierCopy,
        });
      }
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries([
          "restaurantModifiers",
          { restaurantId },
        ]);
        close();
        onItemSave(data);
      },
    }
  );
  // const currentSubmodifier = useRef(0);

  const modifierReducer = (state, action) => {
    switch (action.type) {
      case "setModifierData":
        return {
          ...state,
          [action.payload.data]: action.payload.value,
        };
      // case "saveSubModifier":
      //   return produce(state, (draft) => {
      //     if (currentSubmodifier.current !== null) {
      //       draft.subModifiers[currentSubmodifier.current] = action.payload;
      //     } else {
      //       draft.subModifiers.push(action.payload);
      //     }
      //   });
      // case "setModifierAvailability": {
      //   let value = action.payload === "yes";
      //   return { ...state, available: value };
      // }
      case "setModifierOptional": {
        let value = action.payload === "optional";
        return { ...state, is_optional: value };
      }
      case "changeModifierItem": {
        // console.log(action.payload.value);
        return produce(state, (draft) => {
          draft.choice[action.payload.index][action.payload.property] =
            action.payload.value;
        });
      }
      case "deleteModifierItem":
        return produce(state, (draft) => {
          draft.choice.splice(action.payload, 1);
        });
      case "addModifierItem":
        return {
          ...state,
          choice: [
            ...(state.choice ? state.choice : []),
            { label: "", additional_price: "" },
          ],
        };
      // case "addSubModifier": {
      //   currentSubmodifier.current = null;
      //   setStatus("submodifiers");
      //   return state;
      // }
      // case "editSubModifier": {
      //   currentSubmodifier.current = action.payload;
      //   setStatus("submodifiers");
      //   return state;
      // }
      // case "addSubmodifier": {
      //   currentSubmodifier.current = null;
      //   setStatus("submodifiers");
      //   return state;
      // }
      // case "deleteSubModifier":
      //   return produce(state, (draft) => {
      //     draft.subModifiers.splice(action.payload, 1);
      //   });
      default:
        return state;
    }
  };

  const [modifier, dispatch] = useReducer(modifierReducer, {
    ...initialModifier,
    // subModifiers: [
    //   {
    //     name: "Side Dish",
    //     choice: [
    //       { label: "regular", additional_price: "0.50" },
    //       { label: "medium", additional_price: "0.50" },
    //     ],
    //     optional: false,
    //     max_items_per_customer: 1,
    //     max_selection_per_item: 1,
    //     allergens: [],
    //   },
    // ],
  });

  // const {
  //   CustomModal: DeleteConfirmationModal,
  //   revealModal: revealDeleteConfirmationModal,
  //   closeModal: closeDeleteConfirmationModal,
  // } = useModal();

  // if (status === "modifiers") {
  // }
  return (
    <>
      {/* <DeleteConfirmationModal>
        <ConfirmationModal
          header="Delete Submodifier"
          message="Deleting this sub-modifier will delete all items and information about it"
          onConfirm={() => {
            dispatch({
              type: "deleteSubModifier",
              payload: currentSubmodifier.current,
            });
          }}
          closeModal={closeDeleteConfirmationModal}
          confirmText="Delete"
          cancelText="Cancel"
          alert
          instantClose
        />
      </DeleteConfirmationModal> */}
      <div className="modfierModal">
        <div className="modfierModal__header">
          <h3 className="modfierModal__header-title">
            {initialModifier ? "Edit Modifier" : "Add Modifier"}
          </h3>
          <CloseIcon
            className="modfierModal__header-close"
            disabled={isLoading}
            onClick={close}
          />
        </div>
        <div className="modfierModal__form">
          <ModalInput
            label="Name of item"
            placeholder="Name of item"
            value={modifier.name}
            disabled={isLoading}
            onChange={(e) =>
              dispatch({
                type: "setModifierData",
                payload: {
                  data: "name",
                  value: e.target.value,
                },
              })
            }
            className="modfierModal__form-sidedishName"
          />
          <RadioGroup
            value={
              modifier.is_optional === undefined
                ? undefined
                : modifier.is_optional
                ? "optional"
                : "mandatory"
            }
            options={["optional", "mandatory"]}
            name="isModifierOptional"
            onChange={(option) =>
              dispatch({
                type: "setModifierOptional",
                payload: option,
              })
            }
            disabled={isLoading}
          />
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Price (£)</th>
              </tr>
            </thead>
            <tbody>
              {modifier.choice?.map((item, index) => (
                <tr key={index}>
                  <td>
                    <ModalInput
                      placeholder="item name"
                      value={item.label}
                      onChange={(e) =>
                        dispatch({
                          type: "changeModifierItem",
                          payload: {
                            index,
                            property: "label",
                            value: e.target.value,
                          },
                        })
                      }
                      disabled={isLoading}
                      className="modfierModal__form-sidedish-itemName"
                    />
                  </td>
                  <td>
                    <ModalInput
                      placeholder="item price"
                      value={item.additional_price}
                      onChange={(e) =>
                        dispatch({
                          type: "changeModifierItem",
                          payload: {
                            index,
                            property: "additional_price",
                            value: e.target.value,
                          },
                        })
                      }
                      disabled={isLoading}
                      className="modfierModal__form-sidedish-itemPrice"
                    />
                    <DeleteIcon
                      disabled={isLoading}
                      onClick={() =>
                        dispatch({
                          type: "deleteModifierItem",
                          payload: index,
                        })
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button
            onClick={() => dispatch({ type: "addModifierItem" })}
            title="Add Item"
            iconLeft={<PlusIcon />}
            className="modfierModal__form-sidedishAddItem"
            disabled={isLoading}
          />
          <div className="long">
            <ModalInput
              label="What is the maximum amount of item a customer can have?"
              value={modifier.max_item_per_customer}
              onChange={(e) =>
                dispatch({
                  type: "setModifierData",
                  payload: {
                    data: "max_item_per_customer",
                    value: Number(e.target.value),
                  },
                })
              }
              className="long-input"
              labelClassName="long-label"
              disabled={isLoading}
            />
          </div>
          <div className="long">
            <ModalInput
              label="How many times can customers select a single item?"
              value={modifier.max_selection_per_item}
              onChange={(e) =>
                dispatch({
                  type: "setModifierData",
                  payload: {
                    data: "max_selection_per_item",
                    value: Number(e.target.value),
                  },
                })
              }
              className="long-input"
              labelClassName="long-label"
              disabled={isLoading}
            />
          </div>

          <AllergensDropdown
            allergens={modifier.allergens ? modifier.allergens : []}
            setAllergens={(value) =>
              dispatch({
                type: "setModifierData",
                payload: { data: "allergens", value },
              })
            }
            className="modfierModal__form-allergens"
            disabled={isLoading}
          />
          {/* <div className="modfierModal__form-subModifiers">
            <h5>Sub -modifier</h5>
            {modifier.subModifiers?.map((item, index) => (
              <SideDishDropdown
                key={index}
                title={item.title}
                items={item.items}
                editAction={() =>
                  dispatch({
                    type: "editSubModifier",
                    payload: index,
                  })
                }
                deleteAction={() => {
                  currentSubmodifier.current = index;
                  revealDeleteConfirmationModal();
                }}
                disabled={isLoading}
              />
            ))}
            <Button
              onClick={() => dispatch({ type: "addSubmodifier" })}
              title="Add Submodifier"
              iconLeft={<PlusIcon />}
              className="modfierModal__form-sidedishAddItem"
              disabled={isLoading}
            />
          </div> */}
          {isError && (
            <div className="modfierModal__error">
              <ErrorButton />
              <p>{error.message}</p>
            </div>
          )}
          <div className="modfierModal__actions">
            <Button
              className="back"
              title="Back"
              disabled={isLoading}
              onClick={close}
            />
            <Button
              className="save"
              title="Save"
              iconLeft={isLoading ? <LoadingSpinner /> : null}
              disabled={isLoading}
              onClick={() => mutate(modifier)}
            />
          </div>
        </div>
      </div>
    </>
  );

  // else if (status === "submodifiers") {
  //   return (
  //     <SubmodifierModal
  //       initialSubmodifier={
  //         currentSubmodifier.current !== null
  //           ? modifier.subModifiers[currentSubmodifier.current]
  //           : null
  //       }
  //       close={() => setStatus("modifiers")}
  //       save={(data) =>
  //         dispatch({
  //           type: "saveSubModifier",
  //           payload: data,
  //         })
  //       }
  //     />
  //   );
  // }
}
