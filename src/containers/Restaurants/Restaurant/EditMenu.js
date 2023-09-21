import { LoadingSpinner, PlusIcon } from "assets/icons";
import { Button, ErrorContent } from "components";
import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useModal } from "utils/hooks";
import NewCategoryModal from "./NewCategoryModal";
import produce from "immer";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useClient } from "utils/apiClient";
import CategoryCard from "./CategoryCard";
// import apiAxios from "apis/apiAxios";

const EditMenu = () => {
  const { restaurantId, menuId } = useParams();
  const client = useClient();

  const {
    isIdle,
    isLoading,
    isError,
    error,
    data: categories,
    refetch,
  } = useQuery(["restaurantCategories", { restaurantId }], () =>
    // get restaurant categories
    client(`/admin/restaurant/${restaurantId}/category`)
  );

  const { data: restaurantMenuData } = useQuery(
    ["restaurantMenuData", { restaurantId }],
    () => client(`/admin/restaurant/${restaurantId}/menu`)
  );

  // menu data
  const menu = restaurantMenuData?.menu_items?.find(
    (menu) => menu.id === menuId
  );

  const recentlyChanged = useRef();

  const queryClient = useQueryClient();
  const {
    mutate,
    isLoading: savingChanges,
    isError: errorSavingChanges,
    isSuccess: changesSuccessful,
    error: changesError,
  } = useMutation(
    (data) => {
      console.log("calling mutate");
      if (recentlyChanged.current === "categoryModal") {
        // create new category
        return client(`/admin/restaurant/${restaurantId}/category`, {
          method: "POST",
          data: { ...data, menu_id: menuId },
        });
      } else if (recentlyChanged.current === "publish") {
        console.log("publishing request sent");
        // publish menu
        return client(
          `/admin/restaurant/${restaurantId}/menu/${menuId}/publish`,
          {
            method: "POST",
          }
        );
      }
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries([
          "restaurantCategories",
          { restaurantId },
        ]);

        queryClient.invalidateQueries(["restaurantMenuData", { restaurantId }]);
        if (recentlyChanged.current === "categoryModal") {
          // create new category
          queryClient.setQueryData(
            ["restaurantCategories", { restaurantId }],
            (old) =>
              produce(old, (draft) => {
                draft = [data, ...draft];
              })
          );
        } else if (recentlyChanged.current === "publish") {
          // set menu to published
          queryClient.setQueryData(
            ["restaurantMenuData", { restaurantId }],
            (old) =>
              produce(old, (draft) => {
                draft.menu_items = draft.menuItems.map((menu) =>
                  menu.id === menuId
                    ? { ...menu, has_unpublished_change: false }
                    : menu
                );
              })
          );
        }
      },
    }
  );

  useEffect(() => {
    // prefetching modifiers
    queryClient.prefetchQuery(["restaurantModifiers", { restaurantId }], () =>
      client(`/admin/restaurant/${restaurantId}/modifier`)
    );
  }, [client, queryClient, restaurantId]);

  // useEffect(() => {
  //   async function addCat() {
  //     let res = await apiAxios.post(
  //       `/admin/restaurant/${restaurantId}/category`,
  //       {
  //         name: "Water",
  //         description: "description of the water category",
  //         allergens: ["top", "right", "bottom", "left"],
  //         position: 5,
  //         restaurant_id: restaurantId,
  //       }
  //     );
  //     console.log(res.data);
  //   }
  //   addCat();
  // }, [restaurantId]);

  const {
    CustomModal: NewCategoryModalWrap,
    revealModal: revealNewCategoryModal,
    closeModal: closeCategoryModal,
  } = useModal();

  const closeNewCategoryModal = () => {
    closeCategoryModal();
  };

  const publishMenu = () => {
    recentlyChanged.current = "publish";
    mutate();
  };

  if (isError) {
    return (
      <ErrorContent
        title="Error loading Menu items!"
        retry={refetch}
        error={error}
      />
    );
  }

  return (
    <div className="menuCategories">
      <NewCategoryModalWrap>
        <NewCategoryModal
          close={closeNewCategoryModal}
          onAddCategory={(item) => {
            recentlyChanged.current = "categoryModal";
            mutate(item);
          }}
          isLoading={
            recentlyChanged.current === "categoryModal" && savingChanges
          }
          isError={
            recentlyChanged.current === "categoryModal" && errorSavingChanges
          }
          isSuccess={
            recentlyChanged.current === "categoryModal" && changesSuccessful
          }
          error={changesError}
        />
      </NewCategoryModalWrap>

      <div className="menuCategories__header">
        <h3>Categories</h3>
        <div className="menuCategories__header-buttons">
          <Button
            iconLeft={<PlusIcon />}
            title="Add new category"
            className="add"
            onClick={revealNewCategoryModal}
          />
          {menu?.has_unpublished_change && (
            <Button
              title="Publish Menu Changes"
              className="save"
              onClick={publishMenu}
              iconRight={
                savingChanges && recentlyChanged.current === "publish" ? (
                  <LoadingSpinner />
                ) : null
              }
              disabled={savingChanges && recentlyChanged.current === "publish"}
            />
          )}
        </div>
      </div>

      {isIdle || isLoading ? (
        <div className="menuItems__loading">
          <LoadingSpinner />
        </div>
      ) : (
        categories
          ?.filter((category) => menu?.categories?.includes(category.id))
          ?.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))
      )}
    </div>
  );
};

export default EditMenu;
