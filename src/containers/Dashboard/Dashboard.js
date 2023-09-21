import Chart from "react-apexcharts";
import { DownloadIcon } from "assets/icons";
import {
  Button,
  Card,
  ErrorContent,
  FullPageSpinner,
  PillsDropdown,
} from "components";
import DashboardSales from "./DashboardSales";
import DashboardStatistics from "./DashboardStatistics";
import DashboardOrder from "./DashboardOrder";
import DashboardCustomer from "./DashboardCustomer";
import DashboardTable from "./DashboardTable";
import { useRangeDropdown } from "utils/hooks";
import { useClient } from "utils/apiClient";
import { useQuery } from "react-query";

const Dashboard = () => {
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
    data: dashboardData,
    refetch,
  } = useQuery(["dashBoardData", selectedRange.value], () =>
    client(`/admin/dashboard?time-frame=${selectedRange.value}`)
  );

  if (isLoading || isIdle) {
    return <FullPageSpinner containerHeight="80vh" />;
  }

  if (isError) {
    return <ErrorContent error={error} reset={refetch} />;
  }

  return (
    <div>
      <div className="pills">
        <PillsDropdown
          list={ranges}
          value={selectedRange.text}
          onSelect={onRangeSelected}
        />
      </div>

      <DashboardSales
        sales={dashboardData.dashboard_metrics.sales}
        range={selectedRange.text}
      />
      <DashboardStatistics restaurantData={dashboardData.restaurant_stat} />
      {/* Dashboard Earning chart */}
      <DashboardEarningChart
        dashboardData={dashboardData}
        selectedRange={selectedRange}
      />

      {/* Dashboard order and customer summary */}
      <div className="summary">
        {/* order section */}
        <DashboardOrder data={dashboardData.dashboard_metrics.orders} />
        {/* customer sectiom */}
        <DashboardCustomer data={dashboardData.dashboard_metrics.customers} />
      </div>

      {/* Table that displays the performance of restaurants */}
      <DashboardTable
        topRestaurants={dashboardData.dashboard_metrics.top_restaurants}
      />

      <Button
        className={"download-button"}
        titleClass="download-button-text"
        title={"Download Report"}
        iconLeft={<DownloadIcon />}
      />
    </div>
  );
};

export default Dashboard;

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

const DashboardEarningChart = ({ dashboardData, selectedRange }) => {
  const { previous, current } = dashboardData.dashboard_metrics.earnings;
  var prevArr, currArr, chartDate;

  if (selectedRange.value === "yearly") {
    let formattedPrev = formatYearlyGraphData(previous);
    prevArr = formattedPrev[0];

    let formattedCurrent = formatYearlyGraphData(current);
    currArr = formattedCurrent[0];
    chartDate = formattedCurrent[1];
  } else {
    prevArr = previous.map((obj) => obj.earning);

    currArr = current.map((obj) => obj.earning);

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
