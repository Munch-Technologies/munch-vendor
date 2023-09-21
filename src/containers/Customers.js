import { Card, ErrorContent, FullPageSpinner, PillsDropdown } from "components";
import React from "react";
import Chart from "react-apexcharts";
import { useRangeDropdown } from "utils/hooks";
import CustomersMetric from "./CustomersMetric";
import CustomersTable from "./CustomersTable";
import { useClient } from "utils/apiClient";
import { useQuery } from "react-query";

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
      total = d.earning;
      // total = Math.round(Math.random() * 10000);
      count = 1;
    } else {
      total += d.earning;
      // total += Math.round(Math.random() * 10000);
      count++;
    }
  });
  return [formattedPrev, formattedCurrent];
}
const Customers = () => {
  const {
    selectedRange,
    ranges,
    onSelect: onRangeSelected,
  } = useRangeDropdown();

  const client = useClient();

  const {
    isIdle,
    isLoading,
    isError,
    error,
    data: customerData,
    refetch,
  } = useQuery(["customerData", selectedRange.value], () =>
    client(`/admin/user/metric?time-frame=${selectedRange.value}`)
  );

  if (isLoading || isIdle) {
    return <FullPageSpinner containerHeight="80vh" />;
  }

  if (isError) {
    return (
      <ErrorContent
        error={error}
        reset={refetch}
      />
    );
  }
  // const { previous, current } = customerData.order_chart;
  // var prevArr = previous.map((obj) => obj.orders);
  // var currArr = current.map((obj) => obj.orders);
  // var chartDate = current.map(
  //   (obj) =>
  //     months[new Date(obj.date).getMonth()] +
  //     " " +
  //     new Date(obj.date).getUTCDate()
  // );

  return (
    <div className="customers">
      {" "}
      <div className="pills">
        <PillsDropdown
          list={ranges}
          value={selectedRange.text}
          onSelect={onRangeSelected}
        />
      </div>
      <CustomersMetric customerData={customerData} />
      <CustomerEarningChart
        customerData={customerData}
        selectedRange={selectedRange}
      />
      <CustomersTable />
    </div>
  );
};

export default Customers;

const CustomerEarningChart = ({ customerData, selectedRange }) => {
  const { previous, current } = customerData.order_chart;
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
