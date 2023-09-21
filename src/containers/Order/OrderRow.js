import { LoadingSpinner } from "assets/icons";
import { Button, ErrorButton, Image, OrderDetailsModal } from "components";
import React from "react";
import { useModal } from "utils/hooks";
import { capitalizeFirstLetter } from "utils/capitalize";
import { useMutation, useQueryClient } from "react-query";
import { useClient } from "utils/apiClient";

const OrderRow = ({ index, list }) => {
  // const data = {
  //   id: list.id,
  //   status: list.status,
  //   note: "Do not add cutlery to this order",
  //   // could be null if no rider has accepted yet
  //   rider: {
  //     id: "cl3hrrnkj00003xdm9htscyge",
  //     name: "Justin Chau",
  //   },
  //   restaurant: {
  //     id: "cl3hlzll90000khdmgk1n5c0x",
  //     name: "Bee's Place",
  //     image: DummyImage,
  //   },
  //   customer: {
  //     id: "cl3hrrnkj00003xdm9htscyge",
  //     name: "Michael Chandler",
  //     order_count: 1,
  //     image: UserImage,
  //   },
  //   timeline: {
  //     created_at: list.created_at,
  //     restaurant_accepted_at: "2022-06-06T21:10:10.884Z",
  //     restaurant_rejected_at: null,
  //     rider_accepted_at: "2022-06-06T21:10:10.884Z",
  //     rider_picked_up_at: "2022-06-06T21:10:10.884Z",
  //     completed_at: "2022-06-06T21:10:10.884Z",
  //     cancelled_at: null,
  //   },
  //   price: {
  //     total: 72.5,
  //     sub_total: 70,
  //     tax: 2.5,
  //   },
  //   payment: {
  //     method: "card transaction",
  //     status: "incomplete",
  //   },
  //   delivery: {
  //     address: "2, Kings Place, Manchester",
  //     distance: "20km",
  //     estimated_duration: "45min",
  //   },
  //   items: [
  //     {
  //       type: "item",
  //       id: "1",
  //       name: "Fried Plantain Fritata",
  //       quantity: 1,
  //       price: 30,
  //       image: Item1,
  //       allergens: ["nuts"],
  //     },
  //     {
  //       type: "item",
  //       id: "2",
  //       name: "Butter Pancake",
  //       quantity: 1,
  //       price: 30,
  //       image: Item2,
  //       allergens: ["gluten"],
  //     },
  //     {
  //       type: "modifier",
  //       id: "3",
  //       name: "Rice",
  //       quantity: 1,
  //       price: 10,
  //       image: Modifier1,
  //       allergens: ["gluten"],
  //       option: "Large Bowl",
  //     },
  //     {
  //       type: "modifier",
  //       id: "4",
  //       name: "Drinks",
  //       quantity: 1,
  //       price: 0,
  //       image: Modifier2,
  //       allergens: [],
  //       option: "water",
  //     },
  //   ],
  // };
  // console.log(list);
  const { CustomModal, revealModal, closeModal } = useModal();

  const date = new Date(list.timeline.created_at).toLocaleDateString("en-us", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return (
    <>
      <CustomModal>
        <OrderDetailsModal closeModal={closeModal} list={list} />
      </CustomModal>
      <tr className="order__row">
        <td className="order__row-index">{index + 1}</td>
        <td className="order__row-order">
          <div
            className="order"
            style={{
              maxWidth: "20rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            Order #{list.id}
          </div>{" "}
          <div className="date">{date}</div>{" "}
        </td>
        <td className="order__row-restaurant">
          <Image alt={list.restaurant.name} src={list.restaurant.image} />
          <span>{list.restaurant.name}</span>
        </td>
        <td className="order__row-customer">
          <div className="name">{`${list.customer.firstname} ${list.customer.lastname}`}</div>
          <div className="type">{list.customer.customer_type}</div>
        </td>
        <td className="order__row-price">
          &#163;{list.price.total.toFixed(2)}
        </td>
        <td className="order__row-status">
          <div className={`pill ${list.status.toLowerCase()}`}>
            {capitalizeFirstLetter(list.status)}
          </div>
        </td>
        <td className="order__row-view">
          <button className="reveal" onClick={revealModal}>
            View Details
          </button>
        </td>
      </tr>
    </>
  );
};
export const IncomingOrderRow = ({ index, list }) => {
  // const data = {
  //   id: list.id,
  //   status: list.status,
  //   note: "Do not add cutlery to this order",
  //   // could be null if no rider has accepted yet
  //   rider: {
  //     id: "cl3hrrnkj00003xdm9htscyge",
  //     name: "Justin Chau",
  //   },
  //   restaurant: {
  //     id: "cl3hlzll90000khdmgk1n5c0x",
  //     name: "Bee's Place",
  //     image: DummyImage,
  //   },
  //   customer: {
  //     id: "cl3hrrnkj00003xdm9htscyge",
  //     name: "Michael Chandler",
  //     order_count: 3,
  //     image: UserImage,
  //   },
  //   timeline: {
  //     created_at: list.created_at,
  //     restaurant_accepted_at: "2022-06-06T21:10:10.884Z",
  //     restaurant_rejected_at: null,
  //     rider_accepted_at: "2022-06-06T21:10:10.884Z",
  //     rider_picked_up_at: "2022-06-06T21:10:10.884Z",
  //     completed_at: "2022-06-06T21:10:10.884Z",
  //     cancelled_at: null,
  //   },
  //   price: {
  //     total: 72.5,
  //     sub_total: 70,
  //     tax: 2.5,
  //   },
  //   payment: {
  //     method: "card transaction",
  //     status: "incomplete",
  //   },
  //   delivery: {
  //     address: "2, Kings Place, Manchester",
  //     distance: "20km",
  //     estimated_duration: "45min",
  //   },
  //   items: [
  //     {
  //       type: "item",
  //       id: "",
  //       name: "Fried Plantain Fritata",
  //       quantity: 1,
  //       price: 30,
  //       image: Item1,
  //       allergens: ["nuts"],
  //     },
  //     {
  //       type: "item",
  //       id: "",
  //       name: "Butter Pancake",
  //       quantity: 1,
  //       price: 30,
  //       image: Item2,
  //       allergens: ["gluten"],
  //     },
  //     {
  //       type: "modifier",
  //       id: "",
  //       name: "Rice",
  //       quantity: 1,
  //       price: 10,
  //       image: Modifier1,
  //       allergens: ["gluten"],
  //       option: "Large Bowl",
  //       submodifiers: [
  //         {
  //           title: "type",
  //           item: "jollof",
  //           price: 0,
  //           quantity: 1,
  //           allergens: [],
  //         },
  //       ],
  //     },
  //     {
  //       type: "modifier",
  //       id: "",
  //       name: "Drinks",
  //       quantity: 1,
  //       price: 0,
  //       image: Modifier2,
  //       allergens: [],
  //       option: "water",
  //     },
  //   ],
  // };

  const { CustomModal, revealModal, closeModal } = useModal();
  const client = useClient();
  const queryClient = useQueryClient();

  const { mutate, isLoading, isSuccess, isError } = useMutation(
    () => {
      // accepting an order
      return client(
        `admin/restaurant/${list.restaurant.id}/orders/${list.id}/accept`,
        { method: "PATCH" }
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["orders"]);
      },
    }
  );

  const acceptOrder = () => {
    mutate();
  };

  const date = new Date(list.timeline.created_at).toLocaleDateString("en-us", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return (
    <>
      <CustomModal>
        <OrderDetailsModal closeModal={closeModal} list={list} />
      </CustomModal>
      <tr className="order__row">
        <td className="order__row-index">{index + 1}</td>
        <td className="order__row-order">
          <div
            className="order"
            style={{
              maxWidth: "20rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            Order #{list.id}
          </div>{" "}
          <div className="date">{date}</div>{" "}
        </td>
        <td className="order__row-restaurant">
          <Image alt={list.restaurant.name} src={list.restaurant.image} />
          <span>{list.restaurant.name}</span>
        </td>
        <td className="order__row-customer">
          <div className="name">{`${list.customer.firstname} ${list.customer.lastname}`}</div>
          <div className="type">
            {list.customer.total_order > 1
              ? "Returning customer"
              : "New customer"}
          </div>
        </td>
        <td className="order__row-price">
          &#163;{list.price.total.toFixed(2)}
        </td>
        <td className="order__row-view">
          <button className="reveal" onClick={revealModal}>
            View Details
          </button>
          {!isSuccess && (
            <Button
              title="Accept"
              className="accept"
              onClick={acceptOrder}
              disabled={isLoading}
              iconRight={
                isLoading ? (
                  <LoadingSpinner />
                ) : isError ? (
                  <ErrorButton />
                ) : null
              }
            />
          )}
        </td>
      </tr>
    </>
  );
};

export default OrderRow;
