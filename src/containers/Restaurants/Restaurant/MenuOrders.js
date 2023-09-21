import {
  Card,
  ChangeStatusIndicator,
  DummyGraph,
  ErrorContent,
  FullPageSpinner,
} from "components";
import React from "react";
import { Pie, PieChart, Tooltip } from "recharts";
import { useClient } from "utils/apiClient";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";

const MenuOrders = () => {
  const client = useClient();
  const { restaurantId } = useParams();

  const {
    isIdle,
    isLoading,
    isError,
    error,
    data: restaurantOrders,
    refetch,
  } = useQuery(["restaurantOrders", { restaurantId }], () =>
    client(`/admin/restaurant/${restaurantId}/orders`)
  );

  console.log("restaurantOrders", restaurantOrders);
  if (isError) {
    return (
      <ErrorContent
        title="Error loading Restaurant orders data!"
        retry={refetch}
        error={error}
      />
    );
  }

  if (isLoading || isIdle) {
    return (
      <Card style={{ margin: "4rem 0" }}>
        <FullPageSpinner containerHeight="20rem" />
      </Card>
    );
  }
  return (
    <div className="menuorders">
      <div className="menuorders__cards">
        <Card className={"menuorders__card"}>
          <h5 className="menuorders__card-title">Total Orders</h5>

          <p className="menuorders__card-value">
            {restaurantOrders.total_orders || 25}
          </p>

          <div className="menuorders__card-change">
            <ChangeStatusIndicator
              percentage={restaurantOrders.total_order_percentage_change || 3}
            />
            <span>vs last month</span>
          </div>
          <div className="menuorders__card-graph">
            <DummyGraph
              percentage={restaurantOrders.total_order_percentage_change || 6}
            />
            {/* {console.log(restaurantOrders)} */}
          </div>
        </Card>
        <Card className={"menuorders__card"}>
          <h5 className="menuorders__card-title">Order Acceptance Rate</h5>

          <p className="menuorders__card-value">
            {restaurantOrders.order_acceptance_rate || 10}%
          </p>
          <div className="menuorders__card-change">
            <span className="positive">+ve</span>Keep above 90%
          </div>
        </Card>
        <Card className={"menuorders__card"}>
          <h5 className="menuorders__card-title">Order Rejection Rate</h5>

          <p className="menuorders__card-value">
            {restaurantOrders.order_rejection_rate || 5}%
          </p>
          <div className="menuorders__card-change">
            <span className="negative">-ve</span>Keep below 1.0%
          </div>
        </Card>
      </div>
      <Card className="menuorders__piechart">
        <div className="wrapper">
          <div>
            <PieChart width={240} height={240}>
              <Tooltip />
              {/* TODO: remove fallback values */}
              <Pie
                data={[
                  {
                    name: "Completed",
                    value: restaurantOrders.order_status_count_completed, //|| 36,
                    fill: "#00A642",
                  },
                  {
                    name: "Refunded",
                    value: restaurantOrders.order_status_count_refunded, //|| 2,
                    fill: "#301876",
                  },
                  {
                    name: "Cancelled",
                    value: restaurantOrders.order_status_count_cancelled, //|| 4,
                    fill: "#DA2226",
                  },
                ]}
                nameKey="name"
                dataKey="value"
                innerRadius={"75%"}
                outerRadius={"100%"}
                startAngle={90}
                endAngle={-270}
                fill="#8884d8"
              ></Pie>
            </PieChart>
          </div>
          <div className="menuorders__piechart-content">
            <h4>Total Orders</h4>
            <h3>{restaurantOrders.total_orders}</h3>
          </div>
        </div>
        <ul className="legend">
          <li className="completed subtext">
            <div>{restaurantOrders.order_status_count_completed}</div>
            Completed
          </li>
          <li className="refunded subtext">
            <div></div>
            Refunded
          </li>
          <li className="cancelled subtext">
            <div></div>
            Cancelled
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default MenuOrders;
