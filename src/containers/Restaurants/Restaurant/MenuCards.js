// import { dequal } from "dequal";
import produce from "immer";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useClient } from "utils/apiClient";
import { LoadingSpinner, PlusIcon, ThreeDot } from "../../../assets/icons";
import {
  Button,
  Card,
  CustomDropdown,
  EditableInput2,
  ErrorButton,
  FullPageSpinner,
} from "../../../components";
import { DisapprovingMascot } from "assets/icons/MunchMascots";
import { useMutation, useQuery, useQueryClient } from "react-query";
import data from "assets/dummyData/orderData";
import click from "utils/click";

const MenuCards = () => {
  const navigate = useNavigate();
  const client = useClient();

  const { restaurantId } = useParams();

  const {
    isIdle,
    isLoading,
    isError,
    error,
    data: restaurantMenuData,
  } = useQuery(["restaurantMenuData", { restaurantId }], () =>
    client(`/admin/restaurant/${restaurantId}/menu`)
  );

  const [newMenuList, setNewMenuList] = useState([]);
  const prevNewMenuListLength = useRef(0);
  const newMenuNameRef = useRef();

  useEffect(() => {
    if (prevNewMenuListLength.current < newMenuList.length) {
      prevNewMenuListLength.current = newMenuList.length;
      click(newMenuNameRef.current, { bubbles: true, cancelable: true });
    }
  }, [newMenuList.length]);

  const queryClient = useQueryClient();

  const {
    mutate,
    isLoading: savingChanges,
    isError: errorSavingChanges,
    isSuccess: changesSuccessful,
    error: changesError,
  } = useMutation(
    (data) => {
      if (data === "publish") {
        // publish all menu changes
        return client(`/admin/restaurant/${restaurantId}/menu/publish`, {
          method: "POST",
        });
      } else if (data.delete) {
        // delete menu

        return client(`/admin/restaurant/${restaurantId}/menu/${data.id}`, {
          method: "DELETE",
        });
      } else if (data.id) {
        // update menu
        return client(`/admin/restaurant/${restaurantId}/menu/${data.id}`, {
          data,
          method: "patch",
        });
      } else {
        // create menu
        console.log("creating menu");
        return client(`/admin/restaurant/${restaurantId}/menu`, {
          data,
          method: "post",
        });
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["restaurantMenuData", { restaurantId }]);
      },
      onMutate: (data) => {
        const previousItems = queryClient.getQueryData([
          "restaurantMenuData",
          { restaurantId },
        ]);

        if (data === "publish") {
          queryClient.setQueryData(
            ["restaurantMenuData", { restaurantId }],
            (old) => {
              return {
                ...old,
                has_unpublished_change: false,
              };
            }
          );
        } else if (data.delete) {
          queryClient.setQueryData(
            ["restaurantMenuData", { restaurantId }],
            (old) => {
              return produce(old, (draft) => {
                draft.menu_items = draft.menu_items.filter(
                  (item) => item.id !== data.id
                );
              });
            }
          );
        } else if (data.id) {
          queryClient.setQueryData(
            ["restaurantMenuData", { restaurantId }],
            (old) => {
              return produce(old, (draft) => {
                draft.menu_items = draft.menu_items.map((item) => {
                  if (item.id === data.id) {
                    return { ...item, ...data };
                  }
                  return item;
                });
              });
            }
          );
        } else {
          queryClient.setQueryData(
            ["restaurantMenuData", { restaurantId }],
            (old) => {
              return produce(old, (draft) => {
                draft.menu_items.unshift({ id: data.name, ...data });
              });
            }
          );

          setNewMenuList((prev) =>
            produce(prev, (draft) => {
              draft = draft.splice(data.index, 1);
            })
          );
        }

        return () =>
          queryClient.setQueryData(
            ["restaurantMenuData", { restaurantId }],
            previousItems
          );
      },
    }
  );

  const publishMenu = () => {
    recentlyChanged.current = "publish";
    mutate("publish");
  };

  const recentlyChanged = useRef();

  const saveMenu = (data) => {
    recentlyChanged.current = data.id;
    mutate(data);
  };
  const saveNewMenu = (index) => {
    recentlyChanged.current = index;
    let menu = newMenuList[index];
    mutate(menu);
    console.log("menu", menu);
  };

  const duplicateMenu = (id) => {
    let menu = restaurantMenuData.menu_items.find((menu) => menu.id === id);
    setNewMenuList((prev) => [
      {
        name: menu.name,
        categories: menu.categories,
        number_of_site: menu.number_of_site,
        has_unpublished_change: true,
      },
      ...prev,
    ]);
  };

  const deleteMenu = (id) => {
    recentlyChanged.current = data.id;
    mutate({ id, delete: true });
  };

  const createNewMenu = () => {
    setNewMenuList((prev) => [
      {
        name: "",
        categories: [],
        number_of_site: 0,
        has_unpublished_change: true,
      },
      ...prev,
    ]);
  };

  if (isIdle || isLoading) return <FullPageSpinner containerHeight="20rem" />;

  if (isError) throw error;

  return (
    <>
      <div className="restaurant__updateButton">
        <Button
          iconLeft={<PlusIcon />}
          title="Create Menu"
          className={"button restaurant__updateButton-create"}
          onClick={createNewMenu}
        />
        {restaurantMenuData.menu_items?.some(
          (menu) => menu.has_unpublished_change
        ) && (
          <Button
            title={"Publish All Menu"}
            className="restaurant__updateButton-save"
            onClick={publishMenu}
            iconRight={
              recentlyChanged.current !== "publish" ? null : savingChanges ? (
                <LoadingSpinner />
              ) : errorSavingChanges ? (
                <span>
                  <ErrorButton />
                </span>
              ) : null
            }
          />
        )}
      </div>
      {recentlyChanged.current === "publish" && errorSavingChanges && (
        <p className="restaurant__updateError">{changesError.message}</p>
      )}
      {restaurantMenuData.menu_items?.length > 0 || newMenuList.length > 0 ? (
        <div className="menucards">
          {newMenuList.map((menu, index) => (
            <Card className={"menucards__menucard"} key={index}>
              <div className="menucards__menucard-head">
                <div className="menucards__menucard-head-top">
                  <EditableInput2
                    className="menucards__menucard-head-top-titleText"
                    placeholder="Enter Menu Name"
                    autoClose
                    error={changesError}
                    save={(value) => {
                      setNewMenuList((prev) =>
                        produce(prev, (draft) => {
                          draft[index].name = value;
                        })
                      );
                    }}
                    ref={(ref) => {
                      if (index === 0) newMenuNameRef.current = ref;
                    }}
                  >
                    {menu.name}
                  </EditableInput2>
                </div>
              </div>
              <div className="menucards__menucard-buttons">
                <button
                  className="cancel"
                  onClick={() => {
                    setNewMenuList((prev) =>
                      produce(prev, (draft) => {
                        draft.splice(index, 1);
                      })
                    );
                  }}
                >
                  Cancel
                </button>
                <Button
                  onClick={() => saveNewMenu(index)}
                  className={"menucards__menucard-button"}
                  title={"Save"}
                />
              </div>
            </Card>
          ))}
          {restaurantMenuData.menu_items?.map((menu) => (
            <Card className={"menucards__menucard"} key={menu.id}>
              <div className="menucards__menucard-head">
                <div className="menucards__menucard-head-top">
                  <EditableInput2
                    className="menucards__menucard-head-top-titleText"
                    placeholder="Enter Menu Name"
                    isLoading={
                      recentlyChanged.current === menu.id && savingChanges
                    }
                    isError={
                      recentlyChanged.current === menu.id && errorSavingChanges
                    }
                    isSuccess={
                      recentlyChanged.current === menu.id && changesSuccessful
                    }
                    error={changesError}
                    save={(value) => {
                      saveMenu({ id: menu.id, name: value });
                    }}
                  >
                    {menu.name}
                  </EditableInput2>
                  <CustomDropdown
                    align="right"
                    header={
                      <Button
                        className={"button"}
                        iconRight={<ThreeDot fill={"#6C6C6C"} />}
                      />
                    }
                    className="menucards__menucard-head-top-menuaction"
                    list={[
                      {
                        text: "Duplicate Menu",
                        value: "duplicate",
                        available: true,
                      },
                      {
                        text: "Delete Menu",
                        value: "delete",
                        className: "delete",
                        available: true,
                      },
                    ]}
                    onSelect={(value) => {
                      if (value.value === "duplicate") {
                        duplicateMenu(menu.id);
                      } else if (value.value === "delete") {
                        deleteMenu(menu.id);
                      }
                    }}
                  />
                </div>
                <h4 className="subtext">({menu.number_of_site} sites)</h4>
              </div>
              <Button
                onClick={() => navigate(`${menu.id}`)}
                className={"menucards__menucard-button"}
                title={"Edit Menu"}
              />
            </Card>
          ))}
        </div>
      ) : (
        <div className="card emptyMenu">
          <DisapprovingMascot />
          <p className="emptyMenu__text">
            There is currently no menu available for this restaurant. Don’t keep
            your customers waiting, <br /> <strong>Give them choices.</strong>
          </p>
          <Button
            iconLeft={<PlusIcon />}
            title="Create Menu"
            className={"button restaurant__updateButton-create"}
            onClick={createNewMenu}
          />
        </div>
      )}
    </>
  );
};

export default MenuCards;
