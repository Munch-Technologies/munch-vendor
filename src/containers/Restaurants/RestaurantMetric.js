import React from "react";
import {
  Card,
  ChangeStatusIndicator,
  FullPageSpinner,
  PillsDropdown,
} from "components";
import { useRangeDropdown } from "utils/hooks";
import Chart from "react-apexcharts";
import { useQuery } from "react-query";
import { useClient } from "utils/apiClient";

const RestaurantMetric = () => {
  const client = useClient();
  const {
    selectedRange,
    ranges,
    onSelect: onRangeSelected,
  } = useRangeDropdown();

  const {
    isIdle,
    isLoading,
    isError,
    error,
    data: restaurantMetrics,
  } = useQuery(["restaurantMetrics", selectedRange.value], () =>
    client(`/admin/restaurant-metric?time-frame=${selectedRange.value}`)
  );

  if (isError) throw error;

  if (isLoading || isIdle) {
    return (
      <Card style={{ margin: "4rem 0" }}>
        <FullPageSpinner containerHeight="35rem" />
      </Card>
    );
  }

  return (
    <>
      <div className="pills">
        <PillsDropdown
          list={ranges}
          value={selectedRange.text}
          onSelect={onRangeSelected}
        />
      </div>

      <div className="metric">
        <Card className="metric__card">
          <h3 className="metric__card-title">Total Restaurant</h3>
          <h2 className="metric__card-number">
            {restaurantMetrics.growth_metric.total_restaurant}
          </h2>
          <div className="metric__card-increment">
            <ChangeStatusIndicator
              percentage={
                restaurantMetrics.growth_metric
                  .total_restaurant_percentage_change
              }
            />
            <span className="vs">vs {selectedRange.text}</span>
          </div>
        </Card>
        <Card className="metric__card">
          <h3 className="metric__card-title">New Merchant Sign Up</h3>
          <h2 className="metric__card-number">
            {restaurantMetrics.growth_metric.new_sign_up}
          </h2>
          <div className="metric__card-increment">
            <ChangeStatusIndicator
              percentage={
                restaurantMetrics.growth_metric.new_sign_up_percentage_change
              }
            />{" "}
            <span className="vs">vs {selectedRange.text}</span>
          </div>
        </Card>
        <Card className="metric__card">
          <h3 className="metric__card-title">Order Acceptance Rate</h3>
          <h2 className="metric__card-number">
            {`${restaurantMetrics.growth_metric.overall_acceptance_rate}%`}
          </h2>
          <div className="metric__card-increment">
            <ChangeStatusIndicator
              percentage={
                restaurantMetrics.growth_metric
                  .overall_acceptance_rate_percentage_change
              }
            />{" "}
            <span className="vs">vs {selectedRange.text}</span>
          </div>
        </Card>
      </div>

      <RestaurantEarningChart
        restaurantMetrics={restaurantMetrics}
        selectedRange={selectedRange}
      />
      <Card className={"gauge"}>
        <div className="gauge__chart">
          <h4 className="title">Restaurants</h4>
          <div className="gauge__chart-pie">
            <Chart
              type="donut"
              width={"100%"}
              height={"150%"}
              series={[
                restaurantMetrics.activity_metric.active_restaurant_count,
                restaurantMetrics.activity_metric.inactive_restaurant_count,
              ]}
              options={{
                labels: ["Active Restaurant", "Inactive Restaurant"],
                colors: ["#00A642", "#FFEFCD"],
                dataLabels: {
                  enabled: false,
                },
                legend: {
                  show: false,
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
                          label: "Total Restaurants",
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
            <div className="gauge__chart-pie-legend">
              <div className="gauge__chart-pie-legend-active">
                <div className="dot dot-green"></div>
                <div className="detail">
                  <h4>Active Restaurants</h4>
                  <h3>
                    {restaurantMetrics.activity_metric.active_restaurant_count}
                  </h3>
                </div>
              </div>
              <div className="gauge__chart-pie-legend-inactive">
                <div className="dot dot-yellow"></div>
                <div className="detail">
                  <h4>Inactive Restaurants</h4>
                  <h3>
                    {
                      restaurantMetrics.activity_metric
                        .inactive_restaurant_count
                    }
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="gauge__applicants">
          <h4 className="title">Total Number of Application</h4>
          <div className="gauge__applicants-status">
            <div className="new">
              <h4>New Application</h4>
              <h3>
                {restaurantMetrics.application_metric.new_application_count}
              </h3>
            </div>
            <div className="pending">
              <h4>Pending Application</h4>
              <h3>
                {restaurantMetrics.application_metric.pending_application_count}
              </h3>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default RestaurantMetric;

var monthsAbbr = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

var months = [
  "January",
  "Febuary",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "Septempber",
  "October",
  "November",
  "December",
];

function formatYearlyGraphData(data) {
  const formattedPrev = [];
  const formattedCurrent = [];

  let total = 0;
  let count = 0;
  let currentMonth = "";
  data.forEach((d, index) => {
    let month = months[new Date(d.date).getMonth()];
    if (currentMonth !== month) {
      currentMonth = month;
      if (count !== 0) {
        formattedPrev.push((total / count).toFixed(2));
      }
      formattedCurrent.push(month);
      total = d.orders;
      // total = Math.round(Math.random() * 10000);
      count = 1;
    } else {
      total += d.orders;
      // total += Math.round(Math.random() * 10000);
      count++;
    }
  });
  return [formattedPrev, formattedCurrent];
}

const RestaurantEarningChart = ({ restaurantMetrics, selectedRange }) => {
  const { previous, current } = restaurantMetrics.order_chart_data;
  var prevArr, currArr, chartDate;

  if (selectedRange.value === "yearly") {
    let formattedPrev = formatYearlyGraphData(previous);
    prevArr = formattedPrev[0];
    let formattedCurrent = formatYearlyGraphData(current);
    currArr = formattedCurrent[0];
    chartDate = formattedCurrent[1];
  } else {
    prevArr = previous.map((obj) => obj.orders);
    currArr = current.map((obj) => obj.orders);
    chartDate = current.map(
      (obj) =>
        monthsAbbr[new Date(obj.date).getMonth()] +
        " " +
        new Date(obj.date).getUTCDate()
    );
  }

  return (
    <Card>
      <Chart
        type="area"
        width={"100%"}
        height={400}
        series={[
          {
            name: `This ${selectedRange.value.slice(0, -2)}`,
            data: currArr,
            color: "#00a642",
          },
          {
            name: `Last ${selectedRange.value.slice(0, -2)}`,
            data: prevArr,
            color: "#2e3034",
          },
        ]}
        options={{
          chart: {
            toolbar: {
              show: false,
            },
          },
          noData: {
            text: "Earning report is currently empty",
            align: "center",
            verticalAlign: "middle",
            offsetX: 0,
            offsetY: 0,
            style: {
              color: "#6c6c6c",
              fontSize: "24px",
              fontFamily: "DM Sans",
            },
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            width: 1,
            curve: "smooth",
          },

          tooltip: {
            followCursor: true,
          },
          xaxis: {
            axisTicks: {
              show: false,
            },
            categories: chartDate,
            title: {
              text: selectedRange.value === "yearly" ? "Months" : "Days",
              style: {
                fontSize: "12px",
                fontWeight: 500,
                color: "#6c6c6c",
                fontFamily: "DM Sans",
              },
            },
          },
          yaxis: {
            labels: {
              show: true,
            },
            title: {
              text: "Earnings",
              style: {
                fontSize: "12px",
                fontWeight: 500,
                color: "#6c6c6c",
                fontFamily: "DM Sans",
              },
            },
          },
          legend: {
            position: "top",
            horizontalAlign: "right",
          },
          title: {
            text: "Earning Chart",
          },
          grid: {
            borderColor: "#F2F4F7",
            borderWidth: 10,
          },
        }}
      ></Chart>
    </Card>
  );
};
