import { GreenThumb, RedThumb } from "assets/icons";
import { Button, OrderDetailsModal } from "components";
import { useNavigate } from "react-router-dom";
import { useModal } from "utils/hooks";

const RiderReviewRow = ({ data }) => {
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
      <tr className="riderReviewRow">
        <td
          className="riderReviewRow__customer"
          onClick={() => navigate(`/customers/${data.customer.id}`)}
        >
          <div className="subtext customername">{data.customer.name}</div>
        </td>
        <td className="riderReviewRow__review">
          <div>
            {data.review.value === "up" ? <GreenThumb /> : <RedThumb />}{" "}
            <span>{data.review.reason ?? ""}</span>
          </div>
        </td>
        <td
          className="riderReviewRow__rider"
          onClick={() => navigate(`/rider/${data.customer.id}`)}
        >
          <div className="subtext">{data.rider.name}</div>
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

export default RiderReviewRow;
