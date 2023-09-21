import React from "react";
import OrderMetric from "./OrderMetric";
import OrderTable from "./OrderTable";

const Order = () => {
  return (
    <div className="orders">
      <h3 className="riders__title">Orders</h3>
      <OrderMetric />
      <OrderTable />
    </div>
  );
};

export default Order;
