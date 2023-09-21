import React from "react";
import { Card, ChangeStatusIndicator, DummyGraph } from "components";

const DashboardSales = ({ sales, range }) => {
  return (
    <div className="sales">
      <h2 className="sales__title">Sales</h2>
      <div className="sales__cards">
        <Card className={"sales__cards-item"}>
          <div className="sales__cards-item-detail">
            <h3 className="sales__cards-item-detail-title">
              Gross Transaction Value
            </h3>

            <h2 className="sales__cards-item-detail-amount">
              &#163;
              {sales.gross_transaction_value.toLocaleString()}
            </h2>

            <div className="sales__cards-item-detail-change">
              <ChangeStatusIndicator
                percentage={sales.transaction_value_percentage_change}
              />
              <span>vs {range}</span>
            </div>
          </div>
          <div className="sales__cards-item-chart">
            <DummyGraph
              percentage={sales.transaction_value_percentage_change}
            />
          </div>
        </Card>

        <Card className={"sales__cards-item"}>
          <div className="sales__cards-item-detail">
            <h3 className="sales__cards-item-detail-title">Gross Orders</h3>

            <h2 className="sales__cards-item-detail-amount">
              {sales.gross_order.toLocaleString()}
            </h2>

            <div className="sales__cards-item-detail-change">
              <ChangeStatusIndicator
                percentage={sales.transaction_value_percentage_change}
              />
              <span>vs {range}</span>
            </div>
          </div>
          <div className="sales__cards-item-chart">
            <DummyGraph
              percentage={sales.gross_order_percentage_change}
              variant="2"
            />
          </div>
        </Card>

        <Card className={"sales__cards-item"}>
          <div className="sales__cards-item-detail">
            <h3 className="sales__cards-item-detail-title">Ticket Size</h3>

            <h2 className="sales__cards-item-detail-amount">
              &#163;{sales.ticket_size.toLocaleString()}
            </h2>

            <div className="sales__cards-item-detail-change">
              <ChangeStatusIndicator
                percentage={sales.ticket_percentage_change}
              />
              <span>vs {range}</span>
            </div>
          </div>
          <div className="sales__cards-item-chart">
            <DummyGraph percentage={sales.ticket_percentage_change} />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardSales;
