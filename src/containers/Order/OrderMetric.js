import React from "react";
import Chart from "react-apexcharts";
import {
  Card,
  ChangeStatusIndicator,
  DummyGraph,
  ErrorContent,
  FullPageSpinner,
  PillsDropdown,
} from "components";
import { useRangeDropdown } from "utils/hooks";
import { useQuery } from "react-query";
import { useClient } from "utils/apiClient";

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

const OrderMetric = () => {
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
    data: orderMetrics,
    refetch,
  } = useQuery(["orderMetrics", selectedRange.value], () =>
    client(`/admin/order/metric?time-frame=${selectedRange.value}`)
  );

  if (isLoading || isIdle) {
    return (
      <>
        <Card style={{ margin: "2rem 0" }}>
          <FullPageSpinner containerHeight="20rem" />
        </Card>
        <Card style={{ margin: "2rem 0" }}>
          <FullPageSpinner containerHeight="20rem" />
        </Card>
      </>
    );
  }

  if (isError) {
    return <ErrorContent error={error} reset={refetch} />;
  }

  const { previous, current } = orderMetrics.order_chart;
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
    <>
      <div className="pills">
        <PillsDropdown
          list={ranges}
          value={selectedRange.text}
          onSelect={onRangeSelected}
        />
      </div>
      <div className="menuorders__cards orders__metric">
        <Card className={"menuorders__card"}>
          <h5 className="menuorders__card-title">Total Orders</h5>

          <p className="menuorders__card-value">{orderMetrics.total_order}</p>

          <div className="menuorders__card-change">
            <ChangeStatusIndicator
              percentage={orderMetrics.total_order_percentage_change}
            />
            <span>vs {selectedRange.text}</span>
          </div>
          <div className="menuorders__card-graph">
            <DummyGraph
              percentage={orderMetrics.total_order_percentage_change}
            />
            {/* {console.log(orderMetrics)} */}
          </div>
        </Card>
        <Card className={"menuorders__card"}>
          <h5 className="menuorders__card-title">Order Acceptance Rate</h5>

          <p className="menuorders__card-value">
            {orderMetrics.order_acceptance_rate}%
          </p>
          <div className="menuorders__card-change">
            <span className="positive">+ve</span>Keep above 90%
          </div>
        </Card>
        <Card className={"menuorders__card"}>
          <h5 className="menuorders__card-title">Order Rejection Rate</h5>

          <p className="menuorders__card-value">
            {orderMetrics.order_rejection_rate}%/<span>min</span>
          </p>
          <div className="menuorders__card-change">
            <span className="negative">-ve</span>Keep below 1.0%
          </div>
        </Card>
      </div>

      {/* TODO: update chart data */}
      <div className="orders__chart">
        <Card>
          <Chart
            type="line"
            width={"100%"}
            height={300}
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
                // stacked: true,
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

        <OrderPie orderMetrics={orderMetrics} />
      </div>
    </>
  );
};

// function OrderChart({ orderMetrics }) {

//   return (
//     <Card>
//       <Chart
//         type="line"
//         width={"100%"}
//         height={300}
//         series={[
//           {
//             name: "Last 7 Days",
//             data: currArr,
//             color: "#2e3034",
//           },
//           {
//             name: "last 14 Days",
//             data: prevArr,
//             color: "#00a642",
//           },
//         ]}
//         options={{
//           chart: {
//             stacked: true,
//             toolbar: {
//               show: false,
//             },
//           },
//           noData: {
//             text: "Earning report is currently empty",
//             align: "center",
//             verticalAlign: "middle",
//             offsetX: 0,
//             offsetY: 0,
//             style: {
//               color: "#6c6c6c",
//               fontSize: "24px",
//               fontFamily: "DM Sans",
//             },
//           },
//           dataLabels: {
//             enabled: false,
//           },
//           stroke: {
//             width: 1,
//             curve: "smooth",
//           },
//           tooltip: {
//             followCursor: true,
//           },
//           xaxis: {
//             axisTicks: {
//               show: false,
//             },
//             categories: chartDate,
//             title: {
//               text: "Days",
//               style: {
//                 fontSize: "12px",
//                 fontWeight: 500,
//                 color: "#6c6c6c",
//                 fontFamily: "DM Sans",
//               },
//             },
//           },
//           yaxis: {
//             labels: {
//               show: true,
//             },
//             title: {
//               text: "Earnings",
//               style: {
//                 fontSize: "12px",
//                 fontWeight: 500,
//                 color: "#6c6c6c",
//                 fontFamily: "DM Sans",
//               },
//             },
//           },
//           legend: {
//             position: "top",
//             horizontalAlign: "right",
//           },
//           title: {
//             text: "Earning Chart",
//           },
//           grid: {
//             borderColor: "#F2F4F7",
//             borderWidth: 10,
//           },
//         }}
//       ></Chart>
//     </Card>
//   );
// }

function OrderPie({ orderMetrics }) {
  const { completed, refunded, cancelled } = orderMetrics.order_metric;

  return (
    <Card>
      <Chart
        type="donut"
        width={310}
        height={310}
        series={[completed, refunded, cancelled]}
        options={{
          labels: ["Completed", "Refunded", "Cancelled"],
          colors: ["#00A642", "#301876", "#DA2226"],
          dataLabels: {
            enabled: false,
          },
          title: {
            text: "Orders",
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
}
export default OrderMetric;
