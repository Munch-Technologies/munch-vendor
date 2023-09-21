import React, { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { useClient } from "utils/apiClient";
import { DownloadIcon, RestaurantIcon } from "assets/icons";
import { Button, Card, FullPageSpinner, Pagination2 } from "components";
import RatingStar from "components/Rating/RatingStar";

const RevenueTable = () => {
  const [activePage, setActivePage] = useState(1);
  const navigate = useNavigate();

  const client = useClient();

  const {
    isIdle,
    isLoading,
    isError,
    error,
    data: revenueTable,
  } = useQuery(["revenueTable", "restaurants", activePage], () =>
    client(`/admin/restaurant?page=${activePage}&per-page=10`)
  );

  if (isError) throw error;

  return (
    <div className="revenue__table">
      <h4>Restaurant</h4>
      <Card className={"revenue__table-container"}>
        {isIdle || isLoading ? (
          <FullPageSpinner containerHeight="250px" />
        ) : revenueTable?.restaurant ? (
          <table>
            <thead>
              <tr>
                <th className="infotext">Restaurant Name</th>
                <th className="infotext">Revenue</th>
                <th className="infotext">Comission</th>
                {/* <th className="infotext">Income</th> */}
                <th className="infotext">Total Orders</th>
                <th className="infotext">Order Acceptance Rate</th>
                <th className="infotext">Rating</th>
              </tr>
            </thead>
            <tbody>
              {revenueTable.restaurant.map((data) => {
                return (
                  <tr key={data.id} className="revenue_restaurantTable">
                    <td
                      className="subtext dark name"
                      onClick={() => navigate(`/restaurants/${data.id}`)}
                    >
                      {data.name}
                    </td>
                    <td className="infotext dark">
                      &#163;{data.total_revenue}
                    </td>
                    <td className="infotext dark">
                      {data.preferred_delivery_method.commission}%
                    </td>
                    {/* <td className="infotext dark">&#163;{data.income}</td> */}
                    <td className="infotext dark">
                      {data.completed_order_count}
                    </td>
                    <td className="infotext dark">
                      {data.order_acceptance_rate}%
                    </td>
                    <td className="infotext revenue">
                      <span>
                        <RatingStar star={data.number_of_ratings} />
                      </span>
                      {data.ratings}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="revenue__table-container-noData">
            <RestaurantIcon />
            <p>All restaurant revenue data will appear here</p>
          </div>
        )}
        {revenueTable?.restaurant && (
          <Pagination2
            pages={revenueTable.meta.page_count + 1}
            activePage={activePage}
            onPageChange={(newActivePage) => setActivePage(newActivePage)}
          />
        )}
      </Card>
      {revenueTable?.meta.total && (
        <Button
          className={"download-button"}
          titleClass="download-button-text"
          title={"Download Report"}
          iconLeft={<DownloadIcon />}
        />
      )}
    </div>
  );
};

export default RevenueTable;
