import { DownloadIcon, OrderIcon } from "assets/icons";
import {
  Button,
  Card,
  FallbackResultCard,
  FullPageSpinner,
  Pagination2,
} from "components";
import SubNavigation from "components/SubNavigation";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { useClient } from "utils/apiClient";
import OrderRow, { IncomingOrderRow } from "./OrderRow";

const subnavigations = [
  {
    title: "All",
    value: null,
  },
  {
    title: "Incoming",
    value: "incoming",
  },
  {
    title: "Ongoing",
    value: "ongoing",
  },
  {
    value: "completed",
    title: "Completed",
  },
  {
    value: "cancelled",
    title: "Cancelled",
  },
  {
    value: "refunded",
    title: "Refunded",
  },
];

const OrderTable = () => {
  const client = useClient();
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [activePage, setActivePage] = useState(1);

  const { isIdle, isLoading, data } = useQuery(
    [
      "orders",
      {
        activePage,
        selectedStatus,
      },
    ],
    () =>
      selectedStatus
        ? client(
            `/admin/order?page=${activePage}&per-page=10&filter-key=status&filter=${selectedStatus}`
          )
        : client(`/admin/order?page=${activePage}&per-page=10`)
    // () => client(`/admin/order`)
  );
  console.log(data);

  return (
    <div className="orders__table">
      <SubNavigation
        navList={subnavigations}
        selected={selectedStatus}
        onSelect={(nav) => {
          setSelectedStatus(nav.value);
        }}
        className={"orders__table-subnav"}
      />
      <div className="table">
        <Card>
          {isIdle || isLoading ? (
            <Card style={{ margin: "2rem 0" }}>
              <FullPageSpinner containerHeight="20rem" />
            </Card>
          ) : data?.order ? (
            <table>
              <thead>
                <tr>
                  <th>S/N</th>
                  <th>Order Id</th>
                  <th>Restaurant</th>
                  <th>Customer</th>
                  <th>Total Amount</th>
                  {selectedStatus !== "incoming" && <th>Status</th>}
                </tr>
              </thead>
              <tbody>
                {data.order.map((list, index) => {
                  return selectedStatus === "incoming" ? (
                    <IncomingOrderRow
                      key={list.id}
                      list={list}
                      index={data.meta.per_page * (data.meta.page - 1) + index}
                    />
                  ) : (
                    <OrderRow
                      key={list.id}
                      list={list}
                      index={data.meta.per_page * (data.meta.page - 1) + index}
                    />
                  );
                })}
              </tbody>
            </table>
          ) : (
            <FallbackResultCard>
              <OrderIcon />
              <p>{`No ${selectedStatus ?? ""} order`}</p>
            </FallbackResultCard>
          )}

          {data?.order && (
            <Pagination2
              pages={data.meta.page_count + 1}
              activePage={activePage}
              onPageChange={(newActivePage) => setActivePage(newActivePage)}
            />
          )}
        </Card>
        <Button
          className={"download-button"}
          titleClass="download-button-text"
          title={"Download Report"}
          iconLeft={<DownloadIcon />}
        />
      </div>
    </div>
  );
};

export default OrderTable;
