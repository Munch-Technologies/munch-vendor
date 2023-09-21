import { ChevronDown, LoadingSpinner, PlusIcon } from "assets/icons";
import {
  Button,
  Card,
  Checkbox,
  ErrorButton,
  FullPageSpinner,
  Input,
  ModalInput,
  RadioButton,
  RadioGroup,
} from "components";
import React, {
  memo,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useClient } from "utils/apiClient";
import { useModal } from "utils/hooks";
import { matchSorter } from "match-sorter";
import { capitalizeFirstLetter } from "utils/capitalize";

const ViewPromotions = () => {
  const { promoId: discountId } = useParams();

  console.log("discountId", discountId);
  const client = useClient();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isIdle, isLoading, isError, error } = useQuery(
    ["discounts"],
    () => {
      return client("admin/promotions/discount");
    }
  );

  const {
    mutate,
    isLoading: mutateIsLoading,
    isError: mutateIsError,
    error: mutateError,
  } = useMutation(
    () => {
      if (discountId !== "view") {
        return client(`admin/promotions/discount/${discountId}`, {
          method: "PATCH",
          data: promotion,
        });
      } else {
        return client(`admin/promotions/discount`, {
          data: promotion,
        });
      }
    },
    {
      onSuccess: (data) => {
        if (discountId !== "view") {
          queryClient.setQueryData(["discounts"], (old) => {
            return old.map((item) => {
              if (item.id === discountId) {
                return data;
              } else {
                return item;
              }
            });
          });
        } else {
          queryClient.setQueryData(["discounts"], (old) =>
            old ? [data, ...old] : [data]
          );
        }

        queryClient.invalidateQueries(["discounts"]);
        navigate("/promotions/create");
      },
    }
  );

  const discountReducer = (state, action) => {
    switch (action.type) {
      case "setRestaurant":
        return { ...state, restaurant: action.payload };
      case "setData":
        return {
          ...state,
          ...action.payload,
        };
      default:
        return state;
    }
  };

  let item = data?.find((item) => item.id === discountId);
  const [promotion, dispatch] = useReducer(discountReducer, {
    ...(discountId !== "view"
      ? { ...item, minSubTotal: item.min_sub_total }
      : {
          // restaurant: {
          //   id: 1,
          //   name: "Bee’s Place",
          //   sites: [
          //     {
          //       id: 1,
          //       address: "Manchester, London",
          //       manager: {
          //         name: "John Doe",
          //       },
          //     },
          //     {
          //       id: 1,
          //       address: "Manchester, London",
          //       manager: {
          //         name: "John Doe",
          //       },
          //     },
          //   ],
          //   menuItems: [
          //     {
          //       id: 1,
          //       name: "Burger",
          //       image: MenuItemImage,
          //       description: "",
          //       price: 10,
          //     },
          //     {
          //       id: 2,
          //       name: "Pizza",
          //       image: MenuItemImage,
          //       description: "",
          //       price: 10,
          //     },
          //   ],
          // },
          // audience: "everyone" || "frequentCustomers" || "newCustomers",
          // type: "fixed" || "percentage",
          // value: NUMBER,
          // minSubTotal: NUMBER,
          // launch: "immediate" || "schedule",
        }),
  });
  const { CustomModal, revealModal, closeModal } = useModal();

  const today = new Date().toISOString().split("T");
  const currentDate = today[0];
  const currentTime = today[1].slice(0, 5);

  const startTimeIsError =
    promotion.start_date &&
    promotion.start_date === currentDate &&
    promotion.start_time &&
    Number(promotion.start_time.slice(0, 2)) <=
      Number(currentTime.slice(0, 2)) + 2 &&
    Number(promotion.start_time.slice(3, 5)) <= Number(currentTime.slice(3, 5));

  const endDateIsError =
    promotion.start_date &&
    promotion.end_date &&
    new Date(promotion.start_date) > new Date(promotion.end_date);

  const endTimeIsError =
    promotion.start_date &&
    promotion.end_date &&
    promotion.start_date === promotion.end_date &&
    promotion.start_time &&
    promotion.end_time &&
    Number(promotion.start_time.slice(0, 2)) >=
      Number(promotion.end_time.slice(0, 2)) &&
    Number(promotion.start_time.slice(3, 5)) <=
      Number(promotion.end_time.slice(3, 5));

  const completed =
    promotion.restaurant &&
    promotion.audience &&
    promotion.type &&
    promotion.value &&
    promotion.minSubTotal &&
    promotion.launch &&
    promotion.end_date &&
    promotion.end_time &&
    (promotion.launch === "immediate" ||
      (promotion.start_time && promotion.start_date)) &&
    !startTimeIsError &&
    !endTimeIsError &&
    !endDateIsError;

  const submitPromotion = () => {
    mutate();
  };

  useEffect(() => {
    // prefetching restaurants
    queryClient.prefetchQuery(["allRestaurantName"], () => {
      client("/admin/restaurant-info");
    });
  }, [client, queryClient]);

  if (isError) throw error;

  if (isIdle || isLoading) {
    return (
      <Card style={{ margin: "2rem 0" }}>
        <FullPageSpinner containerHeight="20rem" />
      </Card>
    );
  }
  return (
    <>
      <CustomModal>
        <RestaurantModal
          initialData={promotion.restaurant}
          closeModal={closeModal}
          submit={(data) => {
            dispatch({ type: "setRestaurant", payload: data });
            closeModal();
          }}
        />
      </CustomModal>
      <div className="promotions__view">
        <h1 className="title">Craft your Offer</h1>
        <div className="bodytext">
          Define the details of your offer and set your audience
        </div>
        <div className="promotions__view-content">
          <Card className="promotions__view-content-restaurant">
            <h4>Select a restaurant you want to apply this offer to</h4>
            <div className="infotext">
              You can choose to apply to one or more food items at a restaurant
            </div>
            {promotion.restaurant && (
              <div>
                <h4 className="title">Restaurant Name</h4>
                <div className="value">{promotion.restaurant.name}</div>
                <h4 className="title">Restaurant Site</h4>
                <p className="value">
                  {promotion.isAllSite
                    ? "All locations"
                    : typeof promotion.restaurant.sites === "string"
                    ? capitalizeFirstLetter(promotion.restaurant.sites)
                    : promotion.restaurant.sites.length > 2
                    ? promotion.restaurant.sites.length
                    : promotion.restaurant.sites.reduce(
                        (pre, curr) =>
                          pre ? `${pre};   ${curr.address}` : curr.address,
                        ""
                      )}
                </p>
                <h4 className="title">Menu Item</h4>
                {promotion.isAllMenuItems ? (
                  <p className="value">All locations</p>
                ) : typeof promotion.restaurant.menuItems === "string" ? (
                  <p className="value">
                    {capitalizeFirstLetter(promotion.restaurant.menuItems)}
                  </p>
                ) : (
                  <p className="value">
                    {promotion.restaurant.menuItems?.reduce(
                      (p, c) => (p ? `${p}, ${c.name}` : c.name),
                      ""
                    )}
                  </p>
                )}
              </div>
            )}
            <Button
              className={promotion.restaurant ? "edit" : "add"}
              title={promotion.restaurant ? "Edit" : "Add Restaurant"}
              iconLeft={promotion.restaurant ? null : <PlusIcon />}
              onClick={revealModal}
            />
          </Card>

          <Card className="promotions__view-content-audience">
            <h4 className="audience-title">Restaurant Target Audience</h4>

            <ul>
              <li>
                <RadioButton
                  name="audience"
                  isChecked={promotion.audience === "everyone"}
                  setIsChecked={() =>
                    dispatch({
                      type: "setData",
                      payload: { audience: "everyone" },
                    })
                  }
                  label={
                    <div className="audience-radioLabel">
                      <div className="audience-radioLabel-name">Everyone</div>
                      <div className="audience-radioLabel-description">
                        All customers, new and old are eligible for this offer
                      </div>
                    </div>
                  }
                />
              </li>
              <li>
                <RadioButton
                  name="audience"
                  isChecked={promotion.audience === "frequentCustomers"}
                  setIsChecked={() =>
                    dispatch({
                      type: "setData",
                      payload: { audience: "frequentCustomers" },
                    })
                  }
                  label={
                    <div className="audience-radioLabel">
                      <div className="audience-radioLabel-name">
                        Frequent Customers
                      </div>
                      <div className="audience-radioLabel-description">
                        Only customers who have ordered from Munch at least
                        5times are eligible
                      </div>
                    </div>
                  }
                />
              </li>
              <li>
                <RadioButton
                  name="audience"
                  isChecked={promotion.audience === "newCustomers"}
                  setIsChecked={() =>
                    dispatch({
                      type: "setData",
                      payload: { audience: "newCustomers" },
                    })
                  }
                  label={
                    <div className="audience-radioLabel">
                      <div className="audience-radioLabel-name">
                        New Customers
                      </div>
                      <div className="audience-radioLabel-description">
                        Anyone ordering from Munch for the first time
                      </div>
                    </div>
                  }
                />
              </li>
            </ul>
          </Card>

          <Card className="promotions__view-content-discount">
            <h4 className="title">Add a Discount</h4>
            <div className="subtitle">
              Select a discount and a minimum subtotal amount that makes
              customers eligible
            </div>

            <RadioGroup
              value={promotion.type}
              options={["fixed", "percentage"]}
              label="Value Type"
              name="isModifierAvailable"
              onChange={(option) =>
                dispatch({
                  type: "setData",
                  payload: { type: option },
                })
              }
            />
            <div className="inputgroup">
              <div>
                <DiscountValueInput
                  value={promotion.value}
                  type={promotion.type}
                  dispatch={dispatch}
                />
              </div>
              <div>
                <MinimumValueInput
                  minSubTotal={promotion.minSubTotal}
                  dispatch={dispatch}
                />
              </div>
            </div>
            <div className="promotions__view-content-time">
              <p className="time-title">Select a time to make offer live</p>
              <ul>
                <li>
                  <RadioButton
                    name="launch"
                    isChecked={promotion.launch === "immediate"}
                    setIsChecked={() =>
                      dispatch({
                        type: "setData",
                        payload: {
                          launch: "immediate",
                          start_time: undefined,
                          start_date: currentDate,
                        },
                      })
                    }
                    label={
                      <div className="time-radioLabel">
                        <div className="time-radioLabel-name">
                          Start right now
                        </div>
                        <div className="time-radioLabel-description">
                          Choose when it ends
                        </div>
                      </div>
                    }
                  />
                </li>
                <li>
                  <RadioButton
                    name="launch"
                    isChecked={promotion.launch === "schedule"}
                    setIsChecked={() =>
                      dispatch({
                        type: "setData",
                        payload: { launch: "schedule" },
                      })
                    }
                    label={
                      <div className="time-radioLabel">
                        <div className="time-radioLabel-name">
                          Schedule for later
                        </div>
                        <div className="time-radioLabel-description">
                          Choose when it starts and ends
                        </div>
                      </div>
                    }
                  />
                </li>
              </ul>
            </div>

            {promotion.launch === "schedule" && (
              <div className="inputgroup">
                <div>
                  <Input
                    min={currentDate}
                    className={"input"}
                    label={"Start Date"}
                    type="date"
                    value={promotion.start_date ?? ""}
                    onChange={(e) => {
                      dispatch({
                        type: "setData",
                        payload: { start_date: e.target.value },
                      });
                    }}
                  />
                </div>
                <div>
                  <Input
                    min={currentTime}
                    className={`input ${startTimeIsError && "error"}`}
                    label={"Start Time"}
                    type="time"
                    value={promotion.start_time ?? ""}
                    onChange={(e) => {
                      dispatch({
                        type: "setData",
                        payload: { start_time: e.target.value },
                      });
                    }}
                  />
                  {startTimeIsError && (
                    <p className="errrorMessage">
                      Time must be at least an hour from now
                    </p>
                  )}
                </div>
              </div>
            )}
            <div className="inputgroup">
              <div>
                <Input
                  min={promotion.start_date ?? currentDate}
                  className={`input ${endDateIsError && "error"}`}
                  label={"End Date"}
                  type="date"
                  value={promotion.end_date ?? ""}
                  onChange={(e) => {
                    dispatch({
                      type: "setData",
                      payload: { end_date: e.target.value },
                    });
                  }}
                />
                {endDateIsError && (
                  <p className="errrorMessage">
                    End date cannot be before the Start date
                  </p>
                )}
              </div>
              <div>
                <Input
                  className={`input ${endTimeIsError && "error"}`}
                  label={"End Time"}
                  type="time"
                  value={promotion.end_time ?? ""}
                  onChange={(e) => {
                    dispatch({
                      type: "setData",
                      payload: { end_time: e.target.value },
                    });
                  }}
                />
                {endTimeIsError && (
                  <p className="errrorMessage">
                    End time must come after the Start time
                  </p>
                )}
              </div>
            </div>
          </Card>
        </div>
        <div className="applybtn">
          <Button
            title={"Apply"}
            titleClass="titleText"
            className="btn"
            disabled={(discountId === "view" && !completed) || mutateIsLoading}
            onClick={submitPromotion}
            iconRight={mutateIsLoading ? <LoadingSpinner /> : null}
          />
          {mutateIsError && (
            <div className="errorMessage">
              <ErrorButton /> {mutateError.message}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewPromotions;

const RestaurantModal = ({ initialData, submit }) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState(
    initialData
      ? {
          id: initialData.id,
          name: initialData.name,
        }
      : null
  );

  const [sites, setSites] = useState(initialData ? initialData.sites : []);
  const [menuItems, setMenuItems] = useState(
    initialData ? initialData.menuItems : []
  );
  const [isAllSite, setIsAllSite] = useState(
    initialData ? initialData.isAllSite : false
  );
  const [isAllMenuItems, setIsAllMenuItems] = useState(
    initialData ? initialData.isAllMenuItems : false
  );

  return (
    <Card className={"addrestaurant"}>
      <div className="addrestaurant__title">Add Restaurant</div>
      <ModalRestaurants
        data={selectedRestaurant}
        setData={(data) => setSelectedRestaurant(data)}
      />

      {selectedRestaurant ? (
        <ModalSites
          data={sites}
          setData={setSites}
          selectedRestaurant={selectedRestaurant}
          all={isAllSite}
          setAll={setIsAllSite}
        />
      ) : (
        <div>
          <ModalInput
            className="allergensDropdown"
            label="Sites"
            value="Select a restaurant first"
            disabled
          />
        </div>
      )}

      {selectedRestaurant ? (
        <ModalMenuItems
          data={menuItems}
          setData={setMenuItems}
          selectedRestaurant={selectedRestaurant}
          all={isAllMenuItems}
          setAll={setIsAllMenuItems}
        />
      ) : (
        <div>
          <ModalInput
            className="allergensDropdown"
            label="Menu Items"
            value="Select a restaurant first"
            disabled
          />
        </div>
      )}

      <div className="addrestaurant__button">
        <Button
          className={"btn"}
          onMouseDown={() => {
            submit({
              ...selectedRestaurant,
              sites: isAllSite ? [] : sites,
              menuItems: isAllMenuItems ? [] : menuItems,
              isAllMenuItems,
              isAllSite,
            });
          }}
          title={"Add"}
          disabled={
            !selectedRestaurant ||
            sites?.length === 0 ||
            menuItems?.length === 0
          }
        />
      </div>
    </Card>
  );
};

const ModalRestaurants = ({ data, setData }) => {
  const [name, setName] = useState(data?.name ?? "");
  const [isRestaurantOpen, setIsRestaurantOpen] = useState(false);
  const client = useClient();

  const { data: allRestaurants, isLoading } = useQuery(
    ["allRestaurantName"],
    () => {
      return client("/admin/restaurant-info");
    }
  );
  const filterredRestaurants =
    name && allRestaurants
      ? matchSorter(allRestaurants, name.toLowerCase(), {
          keys: ["name"],
        })
      : allRestaurants;

  // console.log("allRestaurants", allRestaurants);

  // console.log("filteredRestaurants", filterredRestaurants);

  const selectRestaurant = (restaurant) => {
    setName(restaurant.name);
    setIsRestaurantOpen(false);
    setData({ id: restaurant.id, name: restaurant.name });
  };

  const setRestaurant = (input) => {
    setName(input);
    let choosen = allRestaurants?.find(
      (restauarant) => restauarant.name.toLowerCase() === input.toLowerCase()
    );
    if (choosen && input) {
      setData({
        id: choosen.id,
        name: choosen.name,
      });
    } else {
      setData(null);
    }
  };

  const inputRef = useRef();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  if (isLoading) return <ModalInput value="loading" disabled />;

  return (
    <div className="categorySelector">
      <ModalInput
        label="Restaurant Name"
        placeholder="Enter Restaurant Name"
        value={name}
        className={`addrestaurant__name ${data?.id ? "" : "error"}`}
        onChange={(e) => {
          setRestaurant(e.target.value);
          setIsRestaurantOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setRestaurant(e.target.value);
            setIsRestaurantOpen(false);
          }
        }}
        onBlur={() => setIsRestaurantOpen(false)}
        ref={inputRef}
      />
      {isRestaurantOpen && allRestaurants && filterredRestaurants?.length > 0 && (
        <div className="categorySelector__list">
          <>
            {filterredRestaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="categorySelector__list-item"
                onMouseDown={() => selectRestaurant(restaurant)}
              >
                {restaurant.name}
              </div>
            ))}
          </>
        </div>
      )}
    </div>
  );
};

const ModalSites = ({ data, setData, selectedRestaurant, all, setAll }) => {
  const [isSitesOpen, setIsSitesOpen] = useState(false);
  const client = useClient();

  const {
    isIdle,
    isLoading,
    data: menuStores,
    refetch,
  } = useQuery(
    ["allMenuStores", { restaurantId: selectedRestaurant?.id }],
    () => client(`admin/promotions/restaurant/${selectedRestaurant?.id}/store`)
  );

  useEffect(() => {
    refetch();
  }, [refetch, selectedRestaurant]);

  console.log("sites", data);

  const toggleSite = (add, site) => {
    if (!data || typeof data === "string") {
      if (add) {
        setData([site]);
      } else {
        setData(menuStores.filter((i) => i.id !== site.id));
      }
      setAll(false);
    } else {
      if (add) {
        if (data.length === menuStores.length - 1) {
          setAll(true);
          setData("all locations");
        } else {
          setData((d) => [...d, site]);
          setAll(false);
        }
      } else {
        setData((d) => d.filter((i) => i.id !== site.id));
        setAll(false);
      }
    }
  };

  const sitesList = useRef();

  if (isIdle || isLoading) {
    return (
      <div>
        <ModalInput
          className="allergensDropdown"
          label="Sites"
          value="loading"
          disabled
        />
      </div>
    );
  }
  return (
    <div
      className={` allergensDropdown`}
      tabIndex={0}
      onBlur={(e) => {
        if (
          e.relatedTarget === sitesList.current ||
          sitesList.current?.contains(e.relatedTarget)
        )
          return;
        setIsSitesOpen(false);
      }}
    >
      <label className={`modalInputLabel `}>
        Sites
        <button
          className={`allergensDropdown-button ${
            !selectedRestaurant ? "disabled" : ""
          }`}
          onMouseDown={() => selectedRestaurant && setIsSitesOpen((o) => !o)}
        >
          <span>
            {all
              ? "All locations"
              : !menuStores?.length
              ? "Selected restaurant has no site"
              : !data || data.length === 0
              ? "Select Restaurant Sites"
              : typeof data === "string"
              ? capitalizeFirstLetter(data)
              : data.length > 2
              ? data.length
              : data.reduce(
                  (pre, curr) => (pre ? `${pre};   ${curr.name}` : curr.name),
                  ""
                )}
          </span>
          <ChevronDown />
        </button>
      </label>
      {isSitesOpen && menuStores.length && (
        <ul ref={sitesList} className={`card allergensDropdown-list`}>
          <li tabIndex={0}>
            <Checkbox
              label="All Locations"
              isChecked={
                all ||
                (typeof data === "string" &&
                  data.toLowerCase() === "all locations")
              }
              setIsChecked={(add) => {
                if (add) {
                  setData("all locations");
                  setAll(true);
                } else {
                  setData([]);
                  setAll(false);
                }
              }}
            />
          </li>
          {menuStores.map((site) => (
            <li tabIndex={0} key={site.id}>
              <Checkbox
                label={capitalizeFirstLetter(site.name)}
                isChecked={
                  (typeof data === "string" &&
                    data.toLowerCase() === "all locations") ||
                  (data.length &&
                    data.find((selected) => selected.id === site.id))
                }
                setIsChecked={(add) => toggleSite(add, site)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const ModalMenuItems = ({ data, setData, selectedRestaurant, all, setAll }) => {
  const [isMenuListOpen, setIsMenuListOpen] = useState(false);

  const client = useClient();

  const {
    isIdle,
    isLoading,
    data: menuItems,
    refetch,
  } = useQuery(["allMenuItems", { restaurantId: selectedRestaurant?.id }], () =>
    client(`admin/promotions/restaurant/${selectedRestaurant?.id}/menu-items`)
  );

  useEffect(() => {
    refetch();
  }, [refetch, selectedRestaurant]);

  const toggleMenuItem = (add, item) => {
    if (!data || typeof data === "string") {
      if (add) {
        setData([item]);
      } else {
        setData(menuItems.filter((i) => i.id !== item.id));
      }
      setAll(false);
    } else {
      if (add) {
        if (data.length === menuItems.length - 1) {
          setAll(true);
          setData("all menu items");
        } else {
          setData((d) => [...d, item]);
        }
      } else {
        setData((d) => d.filter((i) => i.id !== item.id));
        setAll(false);
      }
    }
  };

  const menuItemsList = useRef();

  if (isIdle || isLoading)
    return (
      <div>
        <ModalInput
          className="allergensDropdown"
          label="Menu Items"
          value="loading"
          disabled
        />
      </div>
    );
  return (
    <div
      className={` allergensDropdown`}
      tabIndex={0}
      onBlur={(e) => {
        if (
          e.relatedTarget === menuItemsList.current ||
          menuItemsList.current?.contains(e.relatedTarget)
        )
          return;
        setIsMenuListOpen(false);
      }}
    >
      <label className={`modalInputLabel `}>
        Menu Items
        <button
          className={`allergensDropdown-button ${
            !selectedRestaurant ? "disabled" : ""
          }`}
          onMouseDown={() => selectedRestaurant && setIsMenuListOpen((o) => !o)}
        >
          <span>
            {all
              ? "All items"
              : !data || data.length === 0
              ? "Select Menu Items"
              : typeof data === "string"
              ? capitalizeFirstLetter(data)
              : data.length > 2
              ? data.length
              : data.reduce(
                  (pre, curr) => (pre ? `${pre};   ${curr.name}` : curr.name),
                  ""
                )}
          </span>
          <ChevronDown />
        </button>
      </label>
      {isMenuListOpen && (
        <ul ref={menuItemsList} className={`card allergensDropdown-list`}>
          <li tabIndex={0}>
            <Checkbox
              label="All Menu Items"
              isChecked={
                all ||
                (typeof data === "string" &&
                  data.toLowerCase() === "all menu items")
              }
              setIsChecked={() => {
                if (all) {
                  setData([]);
                  setAll(false);
                } else {
                  setData("all menu items");
                  setAll(true);
                }
              }}
            />
          </li>
          {menuItems.map((item) => (
            <li tabIndex={0} key={item.id}>
              <Checkbox
                label={capitalizeFirstLetter(item.name)}
                isChecked={
                  (typeof data === "string" &&
                    data.toLowerCase() === "all menu items") ||
                  (data?.length &&
                    data?.find((selected) => selected.id === item.id))
                }
                setIsChecked={(add) => toggleMenuItem(add, item)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const DiscountValueInput = memo(({ value, type, dispatch }) => {
  const valueInputRef = useRef();
  useLayoutEffect(() => {
    if (type === "percentage") {
      valueInputRef.current.value = value ? `${value}%` : "";
    } else if (type === "fixed") {
      valueInputRef.current.value = value ? `£${value}` : "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  return (
    <>
      <Input
        className={`input ${type === "percentage" && value > 100 && "error"}`}
        value={value ?? ""}
        onChange={(e) =>
          dispatch({
            type: "setData",
            payload: { value: e.target.value },
          })
        }
        label={"Discount"}
        onBlur={(e) => {
          if (type === "percentage") {
            e.target.value = e.target.value ? `${e.target.value}%` : "";
          } else if (type === "fixed") {
            e.target.value = e.target.value ? `£${e.target.value}` : "";
          }
        }}
        onFocus={(e) => {
          e.target.value = value ?? "";
        }}
        ref={valueInputRef}
      />
      {value && ((type === "percentage" && value > 100) || isNaN(value)) && (
        <p className="errrorMessage">
          {isNaN(value)
            ? "value must be a number"
            : "percentage cannot be greater than 100"}
        </p>
      )}
    </>
  );
});

const MinimumValueInput = memo(({ minSubTotal, dispatch }) => {
  return (
    <>
      <Input
        className={`input ${minSubTotal && isNaN(minSubTotal) && "error"}`}
        value={minSubTotal ?? ""}
        onChange={(e) =>
          dispatch({
            type: "setData",
            payload: { minSubTotal: e.target.value },
          })
        }
        label={"Minimum Eligible Subtotal"}
        onBlur={(e) => {
          e.target.value = e.target.value ? `£${e.target.value}` : "";
        }}
        onFocus={(e) => {
          e.target.value = minSubTotal ?? "";
        }}
      />
      {minSubTotal && isNaN(minSubTotal) && (
        <p className="errrorMessage">value must be a number</p>
      )}
    </>
  );
});
