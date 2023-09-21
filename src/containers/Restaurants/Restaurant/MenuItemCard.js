import { ThreeDot } from "assets/icons";
import { ConfirmationModal, CustomDropdown, MenuItemModal } from "components";
import produce from "immer";
import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { useClient } from "utils/apiClient";
import { useModal } from "utils/hooks";

export default function MenuItemCard({ item }) {
  const { restaurantId } = useParams();
  const client = useClient();
  const queryClient = useQueryClient();

  const { mutate, isLoading, isError, isSuccess, error } = useMutation(
    (data) => {
      // delete item
      // /restaurant/rID/menu-items/mID
      return client(`/admin/restaurant/${restaurantId}/menu-items/${item.id}`, {
        method: "DELETE",
      });
    },
    {
      onSuccess: () => {
        queryClient.setQueryData(
          ["restaurantCategories", { restaurantId }],
          (old) =>
            produce(old, (draft) => {
              draft = draft.map((category) =>
                category.id === item.id
                  ? {
                      ...category,
                      menuItems: category.menuItems.filter(
                        (menu) => menu.id !== item.id
                      ),
                    }
                  : category
              );
            })
        );

        queryClient.invalidateQueries([
          "restaurantCategories",
          { restaurantId },
        ]);
      },
    }
  );

  const {
    CustomModal: DeleteItemConfirmationModal,
    revealModal: revealDeleteItemConfirmationModal,
    closeModal: closeDeleteItemConfirmationModal,
  } = useModal();

  const {
    CustomModal: EditItemModal,
    revealModal: revealEditItemModal,
    closeModal: closeEditItemModal,
  } = useModal();

  return (
    <div className="menuCategories__categoryItem">
      <div
        className="menuCategories__categoryItem-pic"
        role="img"
        aria-label={item.name}
        title={item.name}
        style={{
          backgroundImage: `url("${item.image}")`,
        }}
      ></div>
      <div className="menuCategories__categoryItem-header">
        <h5>{item.name}</h5>
        {/* <Button iconLeft={<ThreeDot />} className="more" /> */}
        <CustomDropdown
          align="right"
          header={
            <button className="more">
              <ThreeDot fill="#00A642" />
            </button>
          }
          list={[
            {
              text: "Edit Item",
              value: "edit",
              available: true,
            },
            {
              text: "Delete Item",
              value: "delete",
              className: "delete",
              available: true,
            },
          ]}
          onSelect={(value) => {
            if (value.value === "edit") {
              revealEditItemModal();
            } else if (value.value === "delete") {
              revealDeleteItemConfirmationModal();
            }
          }}
        />
      </div>
      <div className="menuCategories__categoryItem-description">
        {item.description}
      </div>
      <div className="menuCategories__categoryItem-price">
        &#163;{item.minimum_price.toLocaleString()}
      </div>
      <DeleteItemConfirmationModal>
        <ConfirmationModal
          header={`Delete ${item.name}`}
          message="Deleting this item will delete all items and information about it"
          onConfirm={mutate}
          closeModal={closeDeleteItemConfirmationModal}
          confirmText="Delete"
          cancelText="Cancel"
          alert
          isLoading={isLoading}
          isError={isError}
          isSuccess={isSuccess}
          error={error}
        />
      </DeleteItemConfirmationModal>
      <EditItemModal>
        <MenuItemModal
          close={closeEditItemModal}
          item={item}
          restaurantId={restaurantId}
          saveAction={"Save"}
          fromCategory
          onItemSave={(item) => {
            queryClient.setQueryData(
              ["restaurantCategories", { restaurantId }],
              (old) =>
                produce(old, (draft) => {
                  const categoryIndex = draft.findIndex(
                    (category) => category.id === item.menu_category.id
                  );
                  const itemIndex = draft[categoryIndex].menuItems.findIndex(
                    (menu) => menu.id === item.id
                  );
                  draft[categoryIndex].menuItems[itemIndex] = item;
                })
            );

            queryClient.invalidateQueries([
              "restaurantCategories",
              { restaurantId },
            ]);
          }}
        />
      </EditItemModal>
    </div>
  );
}
