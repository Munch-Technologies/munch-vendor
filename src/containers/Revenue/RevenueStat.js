import React from "react";
import { Card, ChangeStatusIndicator } from "components";

const RevenueStat = ({ revenueData }) => {
  let formatter = Intl.NumberFormat("en", { notation: "compact" });

  return (
    <div className="revenueStat">
      <Card className={"revenueStat__order"}>
        <div className="textsm">Gross Order</div>
        <div className="revenueStat__order-content">
          <h2>{revenueData.gross_order}</h2>
          <ChangeStatusIndicator
            wrapped
            percentage={revenueData.gross_order_percentage_change}
          />
        </div>
      </Card>

      <Card className="revenueStat__transaction">
        <div className="textsm">Gross Transaction Value</div>
        <div className="revenueStat__order-content">
          <h2>&#163;{formatter.format(revenueData.gross_transaction_value)}</h2>
          <ChangeStatusIndicator
            wrapped
            percentage={revenueData.gross_transaction_value_percentage_change}
          />
        </div>
      </Card>
      <Card className="revenueStat__revenue">
        <div className="textsm">Gross Revenue</div>
        <div className="revenueStat__order-content">
          <h2>&#163;{formatter.format(revenueData.gross_revenue)}</h2>
        </div>
      </Card>
      <Card className="revenueStat__profit">
        <div className="textsm">Gross Profit</div>
        <div className="revenueStat__order-content">
          <h2>&#163;{formatter.format(revenueData.gross_profit)}</h2>
        </div>
      </Card>
    </div>
  );
};

export default RevenueStat;
