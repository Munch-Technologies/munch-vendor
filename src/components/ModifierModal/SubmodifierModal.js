import { CloseIcon, DeleteIcon, PlusIcon } from "assets/icons";
import Button from "components/Button/Button";
import AllergensDropdown from "components/FormElements/AllergernsDropdown";
import ModalInput from "components/FormElements/ModalInput";
import RadioGroup from "components/FormElements/RadioGroup";
import produce from "immer";
import React, { useReducer } from "react";

export default function SubmodifierModal({ initialSubmodifier, close, save }) {
  const submodifierReducer = (state, action) => {
    switch (action.type) {
      case "setData":
        return {
          ...state,
          [action.payload.data]: action.payload.value,
        };
      case "setOptional":
        return produce(state, (draft) => {
          draft.optional = action.payload === "optional";
        });
      case "changeItem": {
        return produce(state, (draft) => {
          draft.items[action.payload.index][action.payload.property] =
            action.payload.value;
        });
      }
      case "deleteItem":
        return produce(state, (draft) => {
          draft.items.splice(action.payload, 1);
        });
      case "addItem":
        return {
          ...state,
          items: [...(state.items ? state.items : []), { name: "", price: "" }],
        };
      default:
        return state;
    }
  };

  const [submodifier, dispatch] = useReducer(submodifierReducer, {
    ...(initialSubmodifier || {}),
  });
  return (
    <div className="submodifierModal">
      <div className="submodifierModal__header">
        <h3 className="submodifierModal__header-title">Sub-Modifier</h3>
        <CloseIcon className="submodifierModal__header-close" onClick={close} />
      </div>
      <div className="submodifierModal__form">
        <ModalInput
          label="Submodifier Title"
          placeholder="e.g size"
          value={submodifier.title}
          onChange={(e) =>
            dispatch({
              type: "setData",
              payload: {
                data: "title",
                value: e.target.value,
              },
            })
          }
          className="submodifierModal__form-sidedishName"
        />
        <RadioGroup
          value={submodifier.optional ? "optional" : "mandatory"}
          options={["optional", "mandatory"]}
          name="isSubModifierOptional"
          onChange={(option) =>
            dispatch({
              type: "setOptional",
              payload: option,
            })
          }
        />
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Price (£)</th>
            </tr>
          </thead>
          <tbody>
            {submodifier.items?.map((item, index) => (
              <tr key={index}>
                <td>
                  <ModalInput
                    placeholder="item name"
                    value={item.name}
                    onChange={(e) =>
                      dispatch({
                        type: "changeItem",
                        payload: {
                          index,
                          property: "name",
                          value: e.target.value,
                        },
                      })
                    }
                    className="submodifierModal__form-sidedish-itemName"
                  />
                </td>
                <td>
                  <ModalInput
                    placeholder="item price"
                    value={item.price}
                    onChange={(e) =>
                      dispatch({
                        type: "changeItem",
                        payload: {
                          index,
                          property: "price",
                          value: e.target.value,
                        },
                      })
                    }
                    className="submodifierModal__form-sidedish-itemPrice"
                  />
                  <DeleteIcon
                    onClick={() =>
                      dispatch({
                        type: "deleteItem",
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
          onClick={() => dispatch({ type: "addItem" })}
          title="Add Item"
          iconLeft={<PlusIcon />}
          className="submodifierModal__form-sidedishAddItem"
        />
        <div className="long">
          <ModalInput
            label="What is the maximum amount of item a customer can have?"
            value={submodifier.max_items_per_customer}
            placeholder="e.g 1"
            onChange={(e) =>
              dispatch({
                type: "setData",
                payload: {
                  data: "max_items_per_customer",
                  value: e.target.value,
                },
              })
            }
            className="long-input"
            labelClassName="long-label"
          />
        </div>
        <div className="long">
          <ModalInput
            label="How many times can customers select a single item?"
            value={submodifier.max_selection_per_item}
            placeholder="e.g 1"
            onChange={(e) =>
              dispatch({
                type: "setData",
                payload: {
                  data: "max_selection_per_item",
                  value: e.target.value,
                },
              })
            }
            className="long-input"
            labelClassName="long-label"
          />
        </div>

        <AllergensDropdown
          allergens={submodifier.allergens ? submodifier.allergens : []}
          setAllergens={(value) =>
            dispatch({
              type: "setData",
              payload: { data: "allergens", value },
            })
          }
          className="submodifierModal__form-allergens"
        />
        <div className="submodifierModal__actions">
          <Button className="cancel" title="Cancel" onClick={close} />
          <Button
            className="save"
            title="Save"
            onClick={() => {
              save(submodifier);
              close();
            }}
          />
        </div>
      </div>
    </div>
  );
}
