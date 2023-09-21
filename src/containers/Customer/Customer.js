import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { ErrorContent, FullPageSpinner, Image } from "components";
import Detail from "./Detail";
import { useClient } from "utils/apiClient";
import { useQuery } from "react-query";
import SubNavigation from "components/SubNavigation";
import Activities from "./Activities";
import { ErrorBoundary } from "react-error-boundary";

var months = [
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
const listTab = [
  {
    value: 1,
    title: "Detail",
  },
  {
    value: 2,
    title: "Activity",
  },
];

const Customer = () => {
  const client = useClient();
  const [tab, setTab] = useState(1);
  const { customerId } = useParams();
  const {
    isIdle,
    isLoading,
    isError,
    error,
    refetch,
    data: customerData,
  } = useQuery(["customer", { customerId }], () =>
    client(`/admin/customer/${customerId}`)
  );
  console.log(customerData);

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

  const mydate =
    months[new Date(customerData.created_at).getMonth()] +
    " " +
    new Date(customerData.created_at).getFullYear();
  return (
    <>
      <div className="customerdetail">
        <div className="customerdetail__header">
          <div className="customerdetail__header-image">
            <Image src={customerData.avatar} alt="one of our customer" />
          </div>

          <div className="customerdetail__header-detail">
            <div className=" customerdetail__header-detail-user">
              <div className="bodytext name">{`${customerData.firstname} ${customerData.lastname}`}</div>
              <div className="infotext type">{customerData.customer_type}</div>
            </div>

            <div className="subtext date ">Joined {mydate}</div>
          </div>
        </div>

        <div className="customerdetail__content">
          <div className="orders">
            <div className="card">
              <div className="subtext">
                {customerData.total_order > 1 ? "Total Orders" : "Total Order"}
              </div>
              <h3 className="green">{customerData.total_order}</h3>
            </div>
            <div className="card">
              <div className="subtext">
                {customerData.cancelled_order > 1
                  ? "Cancelled Orders"
                  : "Cancelled Order"}
              </div>
              <h3 className="red">{customerData.cancelled_order}</h3>
            </div>
            <div className="card">
              <div className="subtext">Total Order Value</div>
              <h3 className="green">&#163;{customerData.total_order_value}</h3>
            </div>
          </div>
          <div className="favourites">
            <div className="card">
              <div className="subtext">Favourite Restaurant</div>
              <h3 className="green">{customerData.restaurant_name}</h3>
            </div>
            <div className="card">
              <div className="subtext">Favourite Menu</div>
              <h3 className="green">{customerData.top_order}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* tab navigation */}
      <SubNavigation
        className="restaurant__tab"
        navList={listTab}
        selected={tab}
        onSelect={(priority) => setTab(priority.value)}
        variant="underlined"
      />

      <ErrorBoundary
        FallbackComponent={ErrorContent}
        onReset={() => {
          // reset the state of your app so the error doesn't happen again
        }}
        resetKeys={[tab]}
      >
        <>
          {tab === 1 ? (
            <Detail customer={customerData} />
          ) : tab === 2 ? (
            <Activities />
          ) : null}
        </>
      </ErrorBoundary>
    </>
  );
};

export default Customer;
