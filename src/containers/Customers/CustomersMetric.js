import { ArrowDownRed, ArrowUpGreen } from "assets/icons";
import { Card } from "components";
import React from "react";

const CustomersMetric = ({ customerData }) => {
  const { total, new: new_cust, returning } = customerData.metric;

  const data = [
    {
      id: 1,
      title: "Total Customer",
      number: total,
      status: total,
    },
    {
      id: 2,
      title: "New Customer",
      number: new_cust,
      status: new_cust,
    },
    {
      id: 3,
      title: "Repeat Customer",
      number: returning,
      status: returning,
    },
  ];
  return (
    <div className="customers__metric">
      {data.map((customer) => (
        <Card key={customer.id} className={"customers__metric-card"}>
          <div className="bodytext">{customer.title}</div>
          <h2 className="customers__metric-card-number">{customer.number}</h2>
          <div className="customers__metric-card-increment">
            {customer.status > 0.12 * total ? (
              <ArrowUpGreen />
            ) : (
              <ArrowDownRed />
            )}
            <div className="subtext customers__metric-card-increment-text">
              <span>12%</span> vs last week
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default CustomersMetric;
