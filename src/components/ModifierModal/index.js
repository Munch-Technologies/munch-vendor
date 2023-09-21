import { CloseIcon, EditIcon, LoadingSpinner, PlusIcon } from "assets/icons";
import BinIcon from "assets/icons/BinIcon";
import Button from "components/Button/Button";
import ConfirmationModal from "components/ConfirmationModal";
import Checkbox from "components/FormElements/Checkbox";
import ModalSearchInput from "components/FormElements/ModalSearchInput";
import Pill from "components/Pill";
import produce from "immer";
import { matchSorter } from "match-sorter";
import React, { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useClient } from "utils/apiClient";
import { useModal } from "utils/hooks";
import ModiferModal from "./ModiferModal";

// {
//   "id":"some_id",
//   "name":"some_name",
//   "is_optional":true,
//   "slug":"some_slug",
//   "choice": [
//     {
//       "label":"dried chicken",
//       "additional_price": 4.5
//     },
//     {
//       "label":"roasted chicken",
//       "additional_price": 3.2
//     }
//     {
//       "label":"stressed chicken",
//       "additional_price": 3.5
//     }
//     ],
//   "max_item_per_customer": 2,
//   "max_selection_per_item":3,
//   "allergens":["some", "fucking", "allergen"],
// }

export default function ModifierModal({
  initialModifiers,
  onSave,
  onCancel,
  saveAction,
  cancelAction,
  restaurantId,
}) {
  const [selectedModifiers, setSelectedModifiers] = useState([
    ...(initialModifiers || []),
  ]);
  const [query, setQuery] = useState("");
  const client = useClient();
  const queryClient = useQueryClient();

  const [status, setStatus] = useState("initial");
  const editModifier = (modifier) => {
    if (modifier) {
      selectedModifier.current = modifiers.find(
        (item) => item.id === modifier.id
      );
    } else {
      selectedModifier.current = null;
    }
    setStatus("modifier");
  };
  const closeModifier = () => {
    setStatus("initial");
  };

  const {
    data: modifiers,
    isLoading,
    isIdle,
  } = useQuery(["restaurantModifiers", { restaurantId }], () =>
    client(`/admin/restaurant/${restaurantId}/modifier`)
  );

  console.log("modifiers", modifiers);

  const {
    mutate,
    isError: isMutationError,
    isLoading: isMutationLoading,
    isSuccess: isMutationSuccess,
    error: mutationError,
  } = useMutation(
    (data) => {
      // Delete modifier
      return client(`/admin/restaurant/${restaurantId}/modifier/${data.id}`, {
        method: "DELETE",
      });
    },
    {
      onSuccess: (data, variables) => {
        removeModifier(variables.id);

        queryClient.setQueryData(
          ["restaurantModifiers", { restaurantId }],
          (old) =>
            produce(old, (draft) => {
              draft = draft.filter((doc) => doc.id !== variables.id);
            })
        );
        queryClient.invalidateQueries([
          "restaurantModifiers",
          { restaurantId },
        ]);
      },
    }
  );

  const filterredModifiers = query
    ? matchSorter(modifiers ?? [], query.toLowerCase(), {
        keys: ["name", "choice.*.label"],
      })
    : modifiers;

  const removeModifier = (id) => {
    setSelectedModifiers((modifiers) =>
      modifiers.filter((item) => item.id !== id)
    );
  };

  const deleteModifier = () => {
    // console.log("selectedModifier", selectedModifier);
    mutate({ id: selectedModifier.current.id });
  };

  const selectedModifier = useRef(null);

  const {
    CustomModal: DeleteModifierConfirmationModal,
    revealModal: revealDeleteModifierConfirmationModal,
    closeModal: closeDeleteModifierConfirmationModal,
  } = useModal();

  if (status === "modifier") {
    return (
      <ModiferModal
        initialModifier={selectedModifier.current}
        close={closeModifier}
        onItemSave={(modifier) => {
          console.log("onItemSave", modifier);
          if (!selectedModifier.current) {
            queryClient.setQueryData(
              ["restaurantModifiers", { restaurantId }],
              (old) =>
                produce(old, (draft) => {
                  draft = draft.unshift(modifier);
                })
            );

            setSelectedModifiers([...selectedModifiers, modifier]);
          } else {
            let newSelectedModifiers = selectedModifiers.map((item) => {
              if (item.id === modifier.id) {
                return modifier;
              }
              return item;
            });
            setSelectedModifiers(newSelectedModifiers);
          }
        }}
        restaurantId={restaurantId}
      />
    );
  }

  return (
    <>
      <DeleteModifierConfirmationModal>
        <ConfirmationModal
          header="Delete Modifier"
          message="Deleting this modifier will delete all items and information about it"
          onConfirm={deleteModifier}
          closeModal={closeDeleteModifierConfirmationModal}
          confirmText="Delete"
          cancelText="Don't Delete"
          alert
          isLoading={isMutationLoading}
          isError={isMutationError}
          isSuccess={isMutationSuccess}
          error={mutationError}
        />
      </DeleteModifierConfirmationModal>
      <div className="modifierGroupModal">
        <div className="modifierGroupModal__header">
          <h3 className="modifierGroupModal__header-title">Modifier Group</h3>
          <CloseIcon
            onClick={onCancel}
            className="modifierGroupModal__header-close"
          />
        </div>
        {selectedModifiers.length > 0 && (
          <div className="modifierGroupModal__selected">
            <h4 className="modifierGroupModal__selected-title">Selected</h4>
            <div className="modifierGroupModal__selected-list">
              {selectedModifiers.map((modifier, index) => (
                <Pill className="modifierItem">
                  {modifier.name}{" "}
                  <span
                    className="modifierItem-close"
                    onClick={() => removeModifier(modifier.id)}
                  >
                    <CloseIcon />
                  </span>
                </Pill>
              ))}
            </div>
          </div>
        )}
        <Button
          className="modifierGroupModal__create"
          title="Create New Modifier"
          iconLeft={<PlusIcon />}
          onClick={() => editModifier(null)}
        />
        <div className="modifierGroupModal__modifiers">
          <h4 className="modifierGroupModal__modifiers-title">Modifiers</h4>
          <ModalSearchInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {(!query || filterredModifiers.length) && (
          <div className="modifierGroupModal__modifiers-list">
            {isIdle || isLoading ? (
              <LoadingSpinner />
            ) : (
              filterredModifiers?.map((modifier) => (
                <div key={modifier.id} className="modifierListItem">
                  <Checkbox
                    isChecked={selectedModifiers.find(
                      (selected) => selected.id === modifier.id
                    )}
                    setIsChecked={(value) => {
                      if (value) {
                        setSelectedModifiers([...selectedModifiers, modifier]);
                      } else {
                        removeModifier(modifier.id);
                      }
                    }}
                  />
                  <div className="modifierListItem-details">
                    <p className="name">{modifier.name}</p>
                    <p className="items">
                      {modifier.choice?.reduce(
                        (string, item) =>
                          string ? `${string}, ${item.label}` : item.label,
                        ""
                      )}
                    </p>
                  </div>
                  <div className="modifierListItem-actions">
                    <span
                      className="edit"
                      onClick={() => editModifier(modifier)}
                    >
                      <EditIcon />
                    </span>
                    <span
                      className="delete"
                      onClick={() => {
                        selectedModifier.current = modifier;
                        revealDeleteModifierConfirmationModal();
                      }}
                    >
                      <BinIcon />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        <div className="modifierGroupModal__actions">
          <button onClick={onCancel} className="cancel">
            {cancelAction}
          </button>
          <button onClick={() => onSave(selectedModifiers)} className="save">
            {saveAction}
          </button>
        </div>
      </div>
    </>
  );
}
