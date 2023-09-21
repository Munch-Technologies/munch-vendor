import { CloseIcon, LoadingSpinner, LocationIcon } from "assets/icons";
import Button from "components/Button/Button";
import Card from "components/Card/Card";
import ErrorButton from "components/ErrorButton";
import Image from "components/Image";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { useClient } from "utils/apiClient";
import { capitalizeFirstLetter } from "utils/capitalize";
import formatAMPM from "utils/formatAMPM";

const OrderDetailsModal = ({ list, closeModal, onAcceptOrReject }) => {
  let navigate = useNavigate();
  const date = new Date(list.timeline.created_at).toLocaleDateString("en-us", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  // const items = [];
  const modifiers = [];
  const allergens = new Set();
  

  const client = useClient();
  const queryClient = useQueryClient();

  const { mutate, isLoading, isSuccess, isError, error } = useMutation(
    (data) => {
      // accepting an order
      if (data === "accept") {
        return client(
          `admin/restaurant/${list.restaurant.id}/orders/${list.id}/accept`,
          { method: "PATCH" }
        );
      } else if (data === "reject") {
        return client(
          `admin/restaurant/${list.restaurant.id}/orders/${list.id}/reject`,
          { method: "PATCH" }
        );
      }
    },
    {
      onSuccess: () => {
        onAcceptOrReject && onAcceptOrReject();
        queryClient.invalidateQueries(["orders"]);
      },
    }
  );

  const acceptOrder = () => {
    mutate("accept");
  };
  const rejectOrder = () => {
    mutate("reject");
  };

  return (
    <Card className={"orders__modal"}>
      <div className="orders__modal-header">
        <div className="bodytext">Order Details</div>
        <CloseIcon className="close" onClick={() => closeModal()} />
      </div>
      <div className="orders__modal-user">
        <div className="orders__modal-user-orderid">
          <div className="subtext idtext">Order #{list.id}</div>
          {list.timeline.created_at && <div className="infotext">{date}</div>}
        </div>

        <div
          className="orders__modal-user-profile"
          onClick={() => navigate(`/customers/${list.customer.id}`)}
        >
          <div
            className="table__item-pic"
            role="img"
            aria-label={list.user_name}
            title={list.user_name}
            style={{
              backgroundImage: `url(${list.customer.image})`,
            }}
          ></div>
          <div>
            <div className="infotext name">{`${list.customer.firstname} ${list.customer.lastname}`}</div>
            <div className="infotext">{list.customer.customer_type}</div>
          </div>
        </div>
      </div>

      <div className="orders__modal-restaurant">
        <div>
          <div className="infotext">Restaurant</div>
          <div
            className="subtext"
            onClick={() => navigate(`/restaurants/${list.restaurant.id}`)}
          >
            {list.restaurant.name}
          </div>
        </div>
        <div>
          <div className="infotext">Delivery address</div>
          <div className="subtext address">
            <LocationIcon /> <div>{list.delivery.address}</div>
          </div>
        </div>
      </div>

      <div className="orders__modal-delivery">
        <div>
          <div className="estimate">
            <div className="infotext">Estimated time for delivery</div>
            <div className="subtext">{list.delivery.estimated_duration}</div>
          </div>
          <div className="distance">
            <div className="infotext">Distance</div>
            <div className="subtext">{list.delivery.distance}</div>
          </div>
        </div>

        <div>
          <div className="payment">
            <div className="infotext">Payment</div>
            <div className="subtext">{list.payment.method}</div>
          </div>
          <div className="status">
            <div className="infotext">Payment Status</div>
            <div className="subtext">{list.payment.status}</div>
          </div>
        </div>
      </div>

      <div className="orders__modal-timeline">
        <div className="orders__modal-timeline-item">
          <span className="bullet"></span>
          <span className="time">
            {formatAMPM(new Date(list.timeline.created_at))}
          </span>
          <span className="context">Order placed by customer</span>
        </div>
        {list.timeline.restaurant_accepted_at && (
          <div className="orders__modal-timeline-itemN">
            <span className="bullet"></span>
            <span className="time">
              {formatAMPM(new Date(list.timeline.restaurant_accepted_at))}
            </span>
            <span className="context">Order accepted by restaurant</span>
          </div>
        )}
        {list.timeline.restaurant_rejected_at && (
          <div className="orders__modal-timeline-itemN">
            <span className="bulletR"></span>
            <span className="time">
              {formatAMPM(new Date(list.timeline.restaurant_rejected_at))}
            </span>
            <span className="context">Order rejected by restaurant</span>
          </div>
        )}
        {list.rider && list.timeline.rider_picked_up_at && (
          <div className="orders__modal-timeline-itemN">
            <span className="bullet"></span>
            <span className="time">
              {formatAMPM(new Date(list.timeline.rider_picked_up_at))}
            </span>
            <span className="context">
              Order picked up by{" "}
              <span
                className="rider"
                onClick={() => navigate(`/riders/${list.rider.id}`)}
              >
                {list.rider?.name}
              </span>
            </span>
          </div>
        )}
        {list.timeline.completed_at && (
          <div className="orders__modal-timeline-itemN">
            <span className="bullet"></span>
            <span className="time">
              {formatAMPM(new Date(list.timeline.completed_at))}
            </span>
            <span className="context">Order delivered</span>
          </div>
        )}
        {list.timeline.cancelled_at && (
          <div className="orders__modal-timeline-itemN">
            <span className="bulletR"></span>
            <span className="time">
              {formatAMPM(new Date(list.timeline.cancelled_at))}
            </span>
            <span className="context">Order cancelled by customer</span>
          </div>
        )}
      </div>
      {list.items && (
        <div className="orders__modal-orderitems">
          {list.items.map((item) => (
            <div key={item.id} className="orders__modal-orderitems-item">
              <Image src={item.image} alt={item.name} />
              {/* <div
                className="table__item-pic"
                role="img"
                aria-label={item.name}
                title={item.name}
                style={{
                  backgroundImage: `url(${item.image})`,
                }}
              ></div> */}
              <div className="context">
                <div className="name">{item.name}</div>
                <div className="quantity">x{item.quantity}</div>
              </div>
              <div className="amount">
                {item.price ? `£${item.price.toFixed(2)}` : "Free"}
              </div>
            </div>
          ))}
        </div>
      )}
      {modifiers.length > 0 && (
        <div className="orders__modal-modifier">
          <div className="subtext">Modifiers</div>
          <div className="orders__modal-modifier-list">
            {modifiers.map((item) => (
              <div key={item.id} className="orders__modal-orderitems-item">
                {item.image && <Image src={item.image} alt={item.name} />}
                <div className="context">
                  <div className="name">{`${item.option}`}</div>
                  <div className="quantity">{`${item.name} x${item?.quantity}`}</div>
                </div>
                <div className="amount">
                  {item.price ? `£${item.price.toFixed(2)}` : "Free"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="orders__modal-final">
        <div className="item">
          <div className="title">Subtotal</div>
          <div className="value">&#163;{list.price.sub_total.toFixed(2)}</div>
        </div>
        <div className="item">
          <div className="title">Tax</div>
          <div className="value">&#163;{list.price.tax.toFixed(2)}</div>
        </div>
        <div className="item">
          <div className="title">Total</div>
          <div className="value">&#163;{list.price.total.toFixed(2)}</div>
        </div>
      </div>
      {allergens.size ? (
        <div className="orders__modal-allergen">
          <div className="subtext title">Allergen Information</div>
          <ul>
            {[...allergens].map((allergen) => (
              <li className="subtext">{capitalizeFirstLetter(allergen)}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {list.notes && (
        <div className="orders__modal-note">Note: {list.notes}</div>
      )}
      {list.status === "pending" && !isSuccess && (
        <div className="orders__modal-buttons">
          {isError && (
            <p className="confirmationModal__error">
              <ErrorButton /> {error.message}
            </p>
          )}
          <div>
            <Button
              className={"reject"}
              title={"Reject"}
              onClick={rejectOrder}
              disabled={isLoading}
            />
            <Button
              className={"accept"}
              title={"Accept Order"}
              onClick={acceptOrder}
              disabled={isLoading}
              iconRight={isLoading ? <LoadingSpinner /> : null}
            />
          </div>
        </div>
      )}
    </Card>
  );
};
export default OrderDetailsModal;
