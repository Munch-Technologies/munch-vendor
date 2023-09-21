import { Button } from "components";
import React from "react";

const Detail = ({ customer }) => {
  const [current, setCurrent] = React.useState(1);

  function renderPersonalDetail() {
    return (
      <div className="rideraccount">
        <h3>Personal Details</h3>
        <div key={customer.id} className="rideraccount__content">
          <div>
            <div className="subtext">First Name</div>
            <h4>{customer.firstName}</h4>
          </div>
          <div>
            <div className="subtext">Last Name</div>
            <h4>{customer.lastName}</h4>
          </div>
          <div>
            <div className="subtext">Email</div>
            <h4>{customer.email}</h4>
          </div>
          <div>
            <div className="subtext">DOB</div>
            <h4>
              {new Date(customer.date_of_birth).toLocaleDateString("en-us", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </h4>
          </div>
          <div>
            <div className="subtext">Address</div>
            <h4>{customer.address}</h4>
          </div>
        </div>
      </div>
    );
  }
  function renderDeliveryOption() {
    return (
      <div className="rideraccount">
        <h3>Password and Delivery Option</h3>
        <div key={customer.id} className="rideraccount__content">
          <div>
            <div className="subtext">Password</div>
            <h4>{customer.password}</h4>
          </div>
          <div>
            <div className="subtext">Delivery Option</div>
            <h4>{customer.delivery_option}</h4>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className=" customerapplication">
        <div className=" customerapplication__progress">
          <div
            className={` customerapplication__progress-indicator  one ${
              current === 1 ? "green" : null
            }`}
            onClick={() => setCurrent(1)}
          >
            1
          </div>
          <div
            className={` customerapplication__progress-indicator two ${
              current === 2 ? "green" : null
            }`}
            onClick={() => setCurrent(2)}
          >
            2
          </div>
        </div>

        {/* menu cards */}
        <div className="customerapplication__content">
          {(() => {
            switch (current) {
              case 1:
                return renderPersonalDetail();
              case 2:
                return renderDeliveryOption();
              default:
                return null;
            }
          })()}

          <div className="application__content-buttons">
            <Button
              className={"next"}
              titleClass={"nextStyle"}
              onClick={
                current === 1
                  ? () => setCurrent(current + 1)
                  : () => setCurrent(1)
              }
              title={current === 1 ? "Next" : "Previous"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
