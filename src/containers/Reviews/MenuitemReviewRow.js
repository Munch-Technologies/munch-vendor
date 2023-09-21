import { GreenThumb, RedThumb } from "assets/icons";
import { Button, Image, OrderDetailsModal } from "components";
import { useNavigate } from "react-router-dom";
import { useModal } from "utils/hooks";

const MenuitemReviewRow = ({ data }) => {
  let navigate = useNavigate();
  const { CustomModal, revealModal, closeModal } = useModal();

  const reviewDate = new Date(data.created_at).toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const deliveryDate = new Date(
    data.order.timeline.completed_at
  ).toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return (
    <>
      <CustomModal>
        <OrderDetailsModal closeModal={closeModal} list={data.order} />
      </CustomModal>
      <tr className="itemReviewRow">
        <td
          className="itemReviewRow__customer"
          onClick={() => navigate(`/customers/${data.customer.id}`)}
        >
          <div className="subtext customername">{data.customer.name}</div>
        </td>
        <td className="itemReviewRow__review">
          <div className="review">
            {data.review.value === "up" ? <GreenThumb /> : <RedThumb />}
            <span className="subtext">{data.review.reason}</span>
          </div>
        </td>
        <td className="itemReviewRow__item">
          <div className="subtext menu">
            <Image src={data.menuItem.image} alt={data.menuItem.name} />
            <span className="subtext">{data.menuItem.name}</span>
          </div>
        </td>
        <td
          className="itemReviewRow__restaurant"
          onClick={() => navigate(`/restaurants/${data.restaurant.id}`)}
        >
          {data.restaurant.name}
        </td>
        <td className="subtext">
          <div>Delivery date: {deliveryDate}</div>
          <div>Review date: {reviewDate}</div>
        </td>
        <td>
          <Button onClick={revealModal} className={"view"} title="View Order" />
        </td>
      </tr>
    </>
  );
};

export default MenuitemReviewRow;
