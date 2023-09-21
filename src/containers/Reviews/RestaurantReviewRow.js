import { RatingStar } from "components";
import React from "react";
import { useNavigate } from "react-router-dom";
import getTimeAgo from "utils/timeAgo";

const RestaurantReviewRow = ({ data }) => {
  let navigate = useNavigate();
  return (
    <tr className="restaurantReviewRow">
      <td
        className="restaurantReviewRow__customer"
        onClick={() => navigate(`/customers/${data.customer.id}`)}
      >
        <div className="subtext customername">{data.customer.name}</div>
        <div className="textsm customertype">
          {data.customer.order_count > 1
            ? "Returning customer"
            : "New customer"}
        </div>
      </td>
      <td className="restaurantReviewRow__comment">
        <div className="textxm comment">{data.comment}</div>
      </td>
      <td
        className="restaurantReviewRow__restaurant"
        onClick={() => navigate(`/restaurants/${data.restaurant.id}`)}
      >
        <div className="subtext">{data.restaurant.name}</div>
      </td>
      <td>
        <RatingStar star={data.rating} />
      </td>
      <td>{getTimeAgo(new Date(data.created_at))}</td>
    </tr>
  );
};

export default RestaurantReviewRow;
