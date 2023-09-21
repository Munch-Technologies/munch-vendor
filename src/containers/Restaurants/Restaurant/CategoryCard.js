import { PlusIcon, ThreeDot } from "assets/icons";
import {
  ConfirmationModal,
  CustomDropdown,
  EditableInput2,
  MenuItemModal,
} from "components";
import produce from "immer";
import React, { useRef } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { useClient } from "utils/apiClient";
import { useModal } from "utils/hooks";
import MenuItemCard from "./MenuItemCard";
import NewCategoryModal from "./NewCategoryModal";

export default function CategoryCard({ category }) {
  const { restaurantId, menuId } = useParams();
  const {
    CustomModal: AddItemModal,
    revealModal: revealAddItemModal,
    closeModal: closeAddItemModal,
  } = useModal();

  const {
    CustomModal: DeleteCategoryConfirmationModal,
    revealModal: revealDeleteCategoryConfirmationModal,
    closeModal: closeDeleteCategoryConfirmationModal,
  } = useModal();

  const {
    CustomModal: EditCategoryModal,
    revealModal: revealEditCategoryModal,
    closeModal: closeEditCategoryModal,
  } = useModal();

  const queryClient = useQueryClient();
  const client = useClient();

  const {
    mutate,
    isLoading: savingChanges,
    isError: errorSavingChanges,
    isSuccess: changesSuccessful,
    error: changesError,
  } = useMutation(
    (data) => {
      if (recentlyChanged.current === "updateCategory") {
        // update category
        return client(`/admin/restaurant/${restaurantId}/category/${data.id}`, {
          method: "PATCH",
          data,
        });
      } else if (recentlyChanged.current === "delete") {
        // delete category
        return client(
          `/admin/restaurant/${restaurantId}/category/${category.id}`,
          {
            method: "DELETE",
          }
        );
      }
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(["restaurantMenuData", { restaurantId }]);
        if (recentlyChanged.current === "updateCategory") {
          queryClient.setQueryData(
            ["restaurantCategories", { restaurantId }],
            (oldData) => {
              produce(oldData, (draft) => {
                const categoryIndex = draft.findIndex(
                  (category) => category.id === variables.id
                );
                draft[categoryIndex] = {
                  ...draft[categoryIndex],
                  ...variables,
                };
              });
            }
          );
        }
        queryClient.invalidateQueries([
          "restaurantCategories",
          { restaurantId },
        ]);
      },
      onMutate: (data) => {
        const previousItems = queryClient.getQueryData([
          "restaurantCategories",
          { restaurantId },
        ]);

        if (recentlyChanged.current === "updateCategory") {
          queryClient.setQueryData(
            ["restaurantCategories", { restaurantId }],
            (old) =>
              produce(old, (draft) => {
                draft = draft.map((category) =>
                  category.id === data.id ? { ...category, ...data } : category
                );
              })
          );
        } else if (recentlyChanged.current === "delete") {
          queryClient.setQueryData(
            ["restaurantCategories", { restaurantId }],
            (old) =>
              produce(old, (draft) => {
                draft = draft.filter(
                  (anyCategory) => anyCategory.id !== category.id
                );
              })
          );
        }

        return () =>
          queryClient.setQueryData(
            ["restaurantCategories", { restaurantId }],
            previousItems
          );
      },
    }
  );

  const recentlyChanged = useRef();

  const deleteCategory = () => {
    recentlyChanged.current = "delete";
    mutate(category.id);
  };

  const closeDeleteModal = () => {
    recentlyChanged.current = null;
    closeDeleteCategoryConfirmationModal();
  };

  return (
    <>
      <DeleteCategoryConfirmationModal>
        <ConfirmationModal
          header="Delete Category"
          message="Deleting this category will delete all items and information about it"
          onConfirm={deleteCategory}
          closeModal={closeDeleteModal}
          confirmText="Delete"
          cancelText="Don't Delete"
          alert
          isLoading={recentlyChanged.current === "delete" && savingChanges}
          isError={recentlyChanged.current === "delete" && errorSavingChanges}
          isSuccess={recentlyChanged.current === "delete" && changesSuccessful}
          error={changesError}
        />
      </DeleteCategoryConfirmationModal>

      <EditCategoryModal>
        <NewCategoryModal
          close={closeEditCategoryModal}
          onAddCategory={(item) => {
            recentlyChanged.current = "updateCategory";
            mutate(item);
          }}
          initialData={category}
          isLoading={
            recentlyChanged.current === "updateCategory" && savingChanges
          }
          isError={
            recentlyChanged.current === "updateCategory" && errorSavingChanges
          }
          isSuccess={
            recentlyChanged.current === "updateCategory" && changesSuccessful
          }
          error={changesError}
        />
      </EditCategoryModal>
      <AddItemModal>
        <MenuItemModal
          close={closeAddItemModal}
          item={{
            menu_category: {
              id: category.id,
              name: category.name,
            },
            menu_id: menuId,
            allergens: [...(category.allergens || [])],
          }}
          newItem={true}
          restaurantId={restaurantId}
          saveAction={"Add Item"}
          fromCategory
          onItemSave={(item) => {
            queryClient.setQueryData(
              ["restaurantCategories", { restaurantId }],
              (old) =>
                produce(old, (draft) => {
                  const categoryIndex = draft.findIndex(
                    (category) => category.id === item.menu_category.id
                  );
                  if (draft[categoryIndex].menuItems) {
                    draft[categoryIndex].menuItems.push(item);
                  } else {
                    draft[categoryIndex].menuItems = [item];
                  }
                })
            );

            queryClient.invalidateQueries([
              "restaurantCategories",
              { restaurantId },
            ]);
          }}
        />
      </AddItemModal>
      <div className="menuCategories__category">
        <div className="menuCategories__category-header">
          <EditableInput2
            className="menuCategories__category-header-title"
            placeholder="Enter a Category Name"
            isLoading={
              recentlyChanged.current === "updateCategory" && savingChanges
            }
            isError={
              recentlyChanged.current === "updateCategory" && errorSavingChanges
            }
            isSuccess={
              recentlyChanged.current === "updateCategory" && changesSuccessful
            }
            error={changesError}
            save={(newValue) => {
              recentlyChanged.current = "updateCategory";
              mutate({
                id: category.id,
                name: newValue,
              });
            }}
          >
            {category.name}
          </EditableInput2>
          <EditableInput2
            className="menuCategories__category-header-description"
            textarea
            placeholder="Enter a Category Description"
            isLoading={
              recentlyChanged.current === "updateCategory" && savingChanges
            }
            isError={
              recentlyChanged.current === "updateCategory" && errorSavingChanges
            }
            isSuccess={
              recentlyChanged.current === "updateCategory" && changesSuccessful
            }
            error={changesError}
            save={(newValue) => {
              recentlyChanged.current = "updateCategory";
              mutate({
                id: category.id,
                description: newValue,
              });
            }}
          >
            {category.description}
          </EditableInput2>
          <div className="menuCategories__category-header-actions">
            <CustomDropdown
              align="right"
              header={
                <button className="options">
                  <ThreeDot fill="#00A642" />
                </button>
              }
              list={[
                {
                  text: "Edit Category",
                  value: "edit",
                  available: true,
                },
                {
                  text: "Delete Category",
                  value: "delete",
                  className: "delete",
                  available: true,
                },
              ]}
              onSelect={(value) => {
                if (value.value === "edit") {
                  revealEditCategoryModal();
                } else if (value.value === "delete") {
                  revealDeleteCategoryConfirmationModal();
                }
              }}
            />
          </div>
        </div>
        <div className="menuCategories__category-items">
          {category.menuItems?.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
          <div
            className="menuCategories__categoryItemAddButton"
            onClick={() => {
              revealAddItemModal();
            }}
          >
            <PlusIcon /> Add Item
          </div>
        </div>
      </div>
    </>
  );
}

// const AddModifierModal = ({ category, close, restaurantId }) => {
//   const [status, setStatus] = useState("modifier");
//   const [modifiers, setModifiers] = useState([]);
//   const [selectedItems, setSelectedItems] = useState([]);
//   const client = useClient();
//   const queryClient = useQueryClient();

//   const { mutate, isLoading, isError, error } = useMutation(
//     () => {
//       return Promise.all(
//         selectedItems.map((item) => {
//           let newModifiers = [...(item.modifiers ? item.modifiers : [])];
//           for (const { id, name } of modifiers) {
//             if (!item.modifiers?.find((modifier) => modifier.id === id)) {
//               newModifiers.push({ id, name });
//             }
//           }

//           // update the item modifiers
//           return client(`/admin/${item.restaurant_id}/menuitem/${item.id}`, {
//             method: "PATCH",
//             data: { modifiers: newModifiers },
//           });
//         })
//       );
//     },
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries([
//           "restaurantCategories",
//           { restaurantId },
//         ]);
//         close();
//       },
//     }
//   );

//   if (status === "modifier") {
//     return (
//       <ModifierModal
//         onSave={(value) => {
//           if (value.length === 0) {
//             close();
//             return;
//           }
//           setModifiers(value);
//           setStatus("apply");
//         }}
//         onCancel={close}
//         saveAction="Add to"
//         cancelAction="Cancel"
//         restaurantId={restaurantId}
//       />
//     );
//   } else if (status === "apply") {
//     return (
//       <div className="addModifiers">
//         <h2 className="addModifiers__header">Add to</h2>
//         <div className="addModifiers__list">
//           <div key="all" className="addModifiers__list-item">
//             <Checkbox
//               isChecked={selectedItems.length === category.menuItems.length}
//               setIsChecked={(value) => {
//                 if (value) {
//                   setSelectedItems(() =>
//                     category.menuItems.map((item) => item.id)
//                   );
//                 } else {
//                   setSelectedItems([]);
//                 }
//               }}
//               label="All Items in Category"
//               labelClassName="addModifiers__list-item-label"
//             />
//           </div>
//           {category.menuItems.map((item) => (
//             <div key={item.id} className="addModifiers__list-item">
//               <Checkbox
//                 isChecked={selectedItems.includes(item.id)}
//                 setIsChecked={(value) => {
//                   if (value) {
//                     setSelectedItems((prev) => [...prev, item.id]);
//                   } else {
//                     setSelectedItems((prev) =>
//                       prev.filter((id) => id !== item.id)
//                     );
//                   }
//                 }}
//                 label={item.name}
//                 labelClassName="addModifiers__list-item-label"
//               />
//             </div>
//           ))}
//         </div>
//         {isError && (
//           <div className="addModifiers__error">
//             <ErrorButton /> {error?.message}
//           </div>
//         )}
//         <Button
//           title="Apply"
//           className="addModifiers__apply"
//           onClick={mutate}
//           disabled={isLoading || selectedItems.length === 0}
//           iconRight={isLoading ? <LoadingSpinner /> : null}
//         />
//       </div>
//     );
//   }
// };
