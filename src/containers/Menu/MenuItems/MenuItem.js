import { LoadingSpinner } from "assets/icons";
import {
  Button,
  ConfirmationModal,
  ErrorButton,
  MenuItemModal,
  RatingStar,
} from "components";
import produce from "immer";
import React from "react";
import { memo } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useClient } from "utils/apiClient";
import { capitalizeFirstLetter } from "utils/capitalize";
import { useModal } from "utils/hooks";

function MenuItem({ item, params }) {
  const { CustomModal, revealModal, closeModal } = useModal();
  console.log(item);
  const {
    CustomModal: DeleteConfirmationModal,
    revealModal: revelDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();
  const queryClient = useQueryClient();
  const client = useClient();

  const {
    mutate: deleteMenuItem,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useMutation(
    (id) => {
      return client(
        `/admin/restaurant/${item.restaurant_id}/menu-items/${id}`,
        {
          method: "DELETE",
        }
      );
    },
    {
      onSuccess: (data, variables) => {
        queryClient.setQueryData(["menuItems", params], (old) =>
          produce(old, (draft) => {
            draft.menu_item = draft.menu_item.filter(
              (doc) => doc.id !== variables
            );
          })
        );
        queryClient.invalidateQueries(["menuItems"]);
      },
    }
  );
  return (
    <>
      <tr className="menuItem">
        <td className="menuItem__item">
          <div>
            <div
              className="menuItem__item-pic"
              role="img"
              aria-label={item.title}
              title={item.title}
              style={{
                backgroundImage: `url("${item.image}")`,
              }}
            ></div>
            <p>{item.name}</p>
          </div>
        </td>
        <td className="menuItem__category">{item.menu_category.name}</td>
        <td className="menuItem__restaurant">{item.restaurant_name}</td>
        <td className="menuItem__rating">
          <div>
            <span>
              <RatingStar star={item.rating} />
            </span>
            {item.rating_count}
          </div>
        </td>
        <td className="menuItem__status">
          {capitalizeFirstLetter(item.status)}
        </td>
        <td className="menuItem__actions">
          <div>
            <Button
              title="Delete"
              className="menuItem__delete"
              onClick={revelDeleteModal}
              iconLeft={
                isLoading ? (
                  <LoadingSpinner />
                ) : isError ? (
                  <ErrorButton />
                ) : null
              }
            />
            <Button
              title="View"
              className="menuItem__view"
              onClick={revealModal}
            />
          </div>
        </td>
      </tr>
      <CustomModal>
        <MenuItemModal
          close={closeModal}
          onItemSave={(newItem) => {
            console.log(
              "saving item",
              newItem,
              params,
              queryClient.getQueryData(["menuItems", params || {}])
            );
            queryClient.setQueryData(["menuItems", params || {}], (old) => {
              return produce(old, (draft) => {
                const index = draft.menu_item.findIndex(
                  (doc) => doc.id === newItem.id
                );
                draft.menu_item[index] = {
                  ...draft.menu_item[index],
                  ...newItem,
                };
              });
            });
            queryClient.invalidateQueries(["menuItems", params || {}]);
            closeModal();
          }}
          item={item}
          restaurantId={item?.restaurant_id}
        />
      </CustomModal>
      <DeleteConfirmationModal>
        <ConfirmationModal
          header="Delete Menu Item"
          message="Deleting this menuitem will delete all information about it and is irreversible. Are you sure you want to delete this menuitem?"
          onConfirm={() => deleteMenuItem(item.id)}
          closeModal={closeDeleteModal}
          confirmText="Delete"
          cancelText="Cancel"
          alert
          isLoading={isLoading}
          isError={isError}
          isSuccess={isSuccess}
          error={error}
        />
      </DeleteConfirmationModal>
    </>
  );
}

export default memo(MenuItem);
