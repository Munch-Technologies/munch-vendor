import { LoadingSpinner, PlusIcon } from "assets/icons";
import {
  Button,
  Card,
  ConfirmationModal,
  FullPageSpinner,
  ModalInput,
  RadioGroup,
} from "components";
import { dequal } from "dequal";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useModal } from "utils/hooks";
import SubNavigation from "components/SubNavigation";
import produce from "immer";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useClient } from "utils/apiClient";
import { matchSorter } from "match-sorter";

export default function RestaurantsSettings() {
  const client = useClient();
  const queryClient = useQueryClient();

  const {
    data: initialRestaurantList,
    isLoading,
    isIdle,
    isError,
    error,
  } = useQuery(["settings", "restaurants"], () => {
    return client("/admin/settings/restaurantpriority");
  });

  const restaurantList = initialRestaurantList
    ? {
        high: [...initialRestaurantList?.high].sort(function (a, b) {
          return a.position - b.position;
        }),
        medium: [...initialRestaurantList?.medium].sort(function (a, b) {
          return a.position - b.position;
        }),
        low: [...initialRestaurantList?.low].sort(function (a, b) {
          return a.position - b.position;
        }),
      }
    : initialRestaurantList;

  const currentlyChanged = useRef();

  const {
    isLoading: mutationIsLoading,
    isError: mutationIsError,
    error: mutationError,
    isSuccess: mutationIsSuccess,
    mutate,
  } = useMutation(
    (data) => {
      // DELETE Restaurant priority
      return client(`/admin/settings/restaurantpriority/${data}`, {
        data,
        method: "DELETE",
      });
    },
    {
      onSuccess: (result, data) => {
        if (!data.id) {
          queryClient.setQueryData(["settings", "restaurants"], (old) =>
            produce(old, (draft) => {
              draft[priority] = draft[priority].filter(
                (item) => item.id !== data
              );
            })
          );
        }
        queryClient.invalidateQueries(["settings", "restaurants"]);

        currentlyChanged.current = null;
      },
    }
  );

  useEffect(() => {
    queryClient.prefetchQuery(["allRestaurantName"], () => {
      client("/admin/restaurant-info");
    });
  }, [client, queryClient]);

  const priorityList = [
    { title: "High Priority", value: "high" },
    { title: "Medium Priority", value: "medium" },
    { title: "Low Priority", value: "low" },
  ];
  const [priority, setPriority] = useState("high");

  const {
    CustomModal: EditRestaurantModalWrap,
    revealModal: revealEditRestaurantModal,
    closeModal: closeEditRestaurantModal,
  } = useModal();

  const {
    CustomModal: AddRestaurantModal,
    revealModal: revealAddRestaurantModal,
    closeModal: closeAddRestaurantModal,
  } = useModal();

  const {
    CustomModal: RemoveConfirmationModal,
    revealModal: revealRemoveConfirmationModal,
    closeModal: closeRemoveConfirmationModal,
  } = useModal();

  const removeRestaurant = (item) => {
    currentlyChanged.current = item;
    revealRemoveConfirmationModal();
  };
  const confirmRemoveRestaurant = () => {
    mutate(currentlyChanged.current.id);
  };
  const editRestaurant = (item) => {
    currentlyChanged.current = item;
    revealEditRestaurantModal();
  };

  if (isError) throw error;

  return (
    <div className="card restaurantSettings">
      {restaurantList && (
        <>
          <AddRestaurantModal>
            <RestaurantModal
              priority={priority}
              close={closeAddRestaurantModal}
              data={restaurantList}
            />
          </AddRestaurantModal>
          <RemoveConfirmationModal>
            <ConfirmationModal
              header="Remove Restaurant from Priority List"
              message={`Removing "${currentlyChanged.current?.restaurant.name}" will send it to the low priority list. Are you sure you want to remove this restaurant?`}
              onConfirm={() => {
                confirmRemoveRestaurant();
              }}
              closeModal={closeRemoveConfirmationModal}
              confirmText="Remove"
              cancelText="Cancel"
              alert
              isLoading={mutationIsLoading}
              isError={mutationIsError}
              isSuccess={mutationIsSuccess}
              error={mutationError}
            />
          </RemoveConfirmationModal>
          <EditRestaurantModalWrap>
            <EditRestaurantModal
              initialData={currentlyChanged.current}
              close={closeEditRestaurantModal}
            />
          </EditRestaurantModalWrap>
        </>
      )}
      <div className="restaurantSettings__header">
        <h3 className="restaurantSettings__header-title">
          Restaurant Priority
        </h3>
        <div className="restaurantSettings__header-actions">
          {priority !== "low" &&
            restaurantList &&
            restaurantList[priority]?.length < 10 && (
              <Button
                title="Add Restaurant"
                onClick={revealAddRestaurantModal}
                iconLeft={<PlusIcon />}
                className="restaurantSettings__header-actions-add"
              />
            )}
        </div>
      </div>

      <SubNavigation
        navList={priorityList}
        selected={priority}
        onSelect={(priority) => setPriority(priority.value)}
      />
      {isIdle || isLoading ? (
        <Card style={{ margin: "4rem 0" }}>
          <FullPageSpinner containerHeight="35rem" />
        </Card>
      ) : (
        <div className="restaurantSettings__list">
          <p className="restaurantSettings__list-description">
            {priority === "high"
              ? "These are the top 10 restaurant that will appear on search"
              : priority === "medium"
              ? "These Restaurants will appear in the First 20 restaurants"
              : "All other restaurants according to rating"}
          </p>

          <div className="restaurantSettings__list-table">
            <table>
              <thead>
                <tr>
                  <th>Restaurant Name</th>
                  <th>Priority</th>
                  <th>Position</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {restaurantList[priority]?.map((item) => (
                  <tr key={item.id}>
                    <td>{item.restaurant.name}</td>
                    <td>{item.priority}</td>
                    <td>{item.position}</td>
                    <td>
                      {priority !== "low" && (
                        <Button
                          title="Remove"
                          className="remove"
                          onClick={() => removeRestaurant(item)}
                        />
                      )}
                      <Button
                        title="Edit"
                        className="edit"
                        onClick={() => editRestaurant(item)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function RestaurantModal({ onSubmit, close, priority, data: restaurantData }) {
  const client = useClient();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState({
    restaurant: null,
    position: 0,
    priority,
  });

  const { data: allRestaurantName, isLoading: loadingRestaurantNames } =
    useQuery(["allRestaurantName"], () => {
      return client("/admin/restaurant-info");
    });

  const validAdditions = useMemo(() => {
    if (!loadingRestaurantNames && allRestaurantName) {
      const finalArray = [];
      const invalidSuggestions = restaurantData[priority].map(
        (item) => item.restaurant.id
      );
      let sIndex = 0;
      for (let i = 0; i < allRestaurantName.length; i++) {
        if (invalidSuggestions[sIndex] === allRestaurantName[i].id) {
          sIndex++;
        } else {
          finalArray.push(allRestaurantName[i]);
        }
      }

      return finalArray;
    } else {
      return [];
    }
  }, [allRestaurantName, loadingRestaurantNames, priority, restaurantData]);

  const filterredRestaurants = name
    ? matchSorter(validAdditions, name.toLowerCase(), {
        keys: ["name"],
      })
    : validAdditions;

  const selectRestaurant = (restauarant) => {
    setIsOpen(false);
    setName(restauarant.name);
    setData((data) => ({
      ...data,
      restaurant: { id: restauarant.id, name: restauarant.name },
    }));
  };

  const setSelectedRestaurant = (input) => {
    setName(input);
    if (!input) {
      setData((data) => ({ ...data, restaurant: null }));
      return;
    }
    let choosen = restaurantData[priority].find(
      (restauarant) => restauarant.name === input
    );
    if (choosen) {
      setData((data) => ({
        ...data,
        restaurant: { id: choosen.id, name: choosen.name },
      }));
    } else {
      setData((data) => ({ ...data, restaurant: null }));
    }
  };

  const { isLoading, isError, error, mutate } = useMutation(
    () => {
      return client(`/admin/settings/restaurantpriority`, {
        data,
      });
    },
    {
      onSuccess: () => {
        queryClient.setQueryData(["settings", "restaurants"], (old) =>
          produce(old, (draft) => {
            draft[priority].push(data);
          })
        );
        queryClient.invalidateQueries(["settings", "restaurants"]);
        close();
        onSubmit?.();
      },
    }
  );

  return (
    <div className="card restaurantSettings__modal">
      <h4 className="restaurantSettings__modal-header">Add Restaurant</h4>
      <div className="categorySelector">
        <ModalInput
          label="Restaurant Name"
          className={`restaurantSettings__modal-input ${
            data.restaurant ? "" : "error"
          }`}
          value={name}
          placeholder="Enter restaurant name"
          onChange={(e) => {
            setSelectedRestaurant(e.target.value);
            setIsOpen(true);
          }}
          onBlur={() => setIsOpen(false)}
        />
        {isOpen && filterredRestaurants?.length > 0 ? (
          <div className="categorySelector__list">
            <>
              {filterredRestaurants.map((restauarant) => (
                <div
                  key={restauarant.id}
                  className="categorySelector__list-item"
                  onMouseDown={() => selectRestaurant(restauarant)}
                >
                  {restauarant.name}
                </div>
              ))}
            </>
          </div>
        ) : null}
      </div>
      <ModalInput
        label="Position"
        className="restaurantSettings__modal-input"
        type="number"
        value={data.position}
        onChange={(e) => setData({ ...data, position: Number(e.target.value) })}
      />
      <RadioGroup
        label="Priority"
        options={["high", "medium", "low"]}
        value={priority}
        name="restauarant priority selector"
        // disabled
      />

      <div className="cta-warp">
        {isError && (
          <span className="error-message">Error: {error.message}</span>
        )}
        <Button
          title={isError ? "Retry" : "Add Restaurant"}
          iconRight={isLoading ? <LoadingSpinner /> : null}
          onClick={mutate}
          disabled={data.restaurant === "" || data.position === "" || isLoading}
        />
      </div>
    </div>
  );
}

function EditRestaurantModal({ initialData, onSubmit, close }) {
  const client = useClient();
  const queryClient = useQueryClient();
  const [data, setData] = useState({
    ...initialData,
  });

  const { isLoading, isError, error, mutate } = useMutation(
    () => {
      return client(`/admin/settings/restaurantpriority`, {
        data,
        method: "PATCH",
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["settings", "restaurants"]);
        close();
        onSubmit?.();
      },
    }
  );

  return (
    <div className="card restaurantSettings__modal">
      <h4 className="restaurantSettings__modal-header">
        Edit Restaurant Priority
      </h4>
      <div className="categorySelector">
        <ModalInput
          label="Restaurant Name"
          className={`restaurantSettings__modal-input ${
            data.restaurant ? "" : "error"
          }`}
          value={data.restaurant?.name ?? ""}
          disabled
        />
      </div>
      <ModalInput
        label="Position"
        className="restaurantSettings__modal-input"
        type="number"
        value={data.position}
        onChange={(e) => setData({ ...data, position: Number(e.target.value) })}
      />
      <RadioGroup
        label="Priority"
        options={["high", "medium", "low"]}
        value={data.priority}
        name="restauarant priority selector"
        onChange={(value) => {
          setData({
            ...data,
            priority: value,
          });
        }}
      />

      <div className="cta-warp">
        {isError && (
          <span className="error-message">Error: {error.message}</span>
        )}
        <Button
          title={isError ? "Retry" : "Save Changes"}
          iconRight={isLoading ? <LoadingSpinner /> : null}
          onClick={mutate}
          disabled={dequal(initialData, data) || isLoading}
        />
      </div>
    </div>
  );
}
