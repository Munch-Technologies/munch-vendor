import React from "react";
import { ArrowUpGreen, QuestionIcon } from "assets/icons";
import { Card } from "components";

const DashboardCustomer = ({ data }) => {
  const { new: newCustomer, returning: returningCustomer } = data;
  let total = newCustomer + returningCustomer;
  let increment = (newCustomer / total) * 100;

  return (
    <Card className={"customer"}>
      <div className="customer__header">
        <h2 className="customer__header-title">Total Customer</h2>
        <div className="customer__header-icon">
          <QuestionIcon />
        </div>
      </div>
      <div className="customer__increment">
        <h3 className="customer__increment-total">{total}</h3>
        <span className="customer__increment-percentage">
          <ArrowUpGreen />
          {total !== 0 && returningCustomer !== 0 ? (
            <h4>{increment.toFixed(2)}%</h4>
          ) : (
            <h4>0%</h4>
          )}
        </span>
      </div>
      {/* new and returning customer increment bar */}
      <div
        style={{
          backgroundColor: "#C8E3FF",
          height: "8px",
          display: "flex",
          flexDirection: "row",
          borderRadius: "5px",
        }}
      >
        <div
          style={{
            backgroundColor: "#238FFF",
            height: "8px",
            width: `${newCustomer}%`,
            borderRadius: "5px",
          }}
        />
        <div
          style={{
            backgroundColor: "#C8E3FF",
            height: "8px",
            width: `${returningCustomer}%`,
            borderTopRightRadius: "5px",
            borderBottomRightRadius: "5px",
          }}
        />
      </div>

      <div className="customer__new">
        <div className="customer__new-right">
          <div className="customer__new-right-dot" />
          <h2>New Customers</h2>
        </div>
        {newCustomer}
      </div>

      <div className="customer__return">
        <div className="customer__return-right">
          <div className="customer__return-right-dot" />
          <h2>Returning Customers</h2>
        </div>
        {returningCustomer}
      </div>
    </Card>
  );
};

export default DashboardCustomer;
