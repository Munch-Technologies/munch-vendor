import React from "react";
import { Card } from "components";
import Chart from "react-apexcharts";

const DashboardOrder = ({ data }) => {
  const { cancelled, completed, refunded } = data;
  return (
    <Card className="dashboard__piechart">
      <Chart
        type="donut"
        width={"100%"}
        height={"100%"}
        series={[completed, refunded, cancelled]}
        options={{
          labels: ["Completed", "Refunded", "Cancelled"],
          colors: ["#00A642", "#301876", "#DA2226"],
          dataLabels: {
            enabled: false,
          },

          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  value: {
                    show: true,
                    offsetY: 4,
                    fontSize: "28px",
                  },
                  total: {
                    show: true,
                    label: "Total Orders",
                    showAlways: true,
                    fontSize: "14px",
                    color: "#989B9B",
                  },
                },
              },
            },
          },
        }}
      ></Chart>
    </Card>
  );
};

export default DashboardOrder;
