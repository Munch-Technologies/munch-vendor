import React, { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { useClient } from "utils/apiClient";
import { DownloadIcon, RidersIcon } from "../../assets/icons";
import {
  Button,
  Card,
  FullPageSpinner,
  Pagination2,
  RatingStar,
} from "../../components";

const RidersTable = () => {
  const [activePage, setActivePage] = useState(1);
  const navigate = useNavigate();

  const client = useClient();

  const {
    isIdle,
    isLoading,
    isError,
    error,
    data: riderRevenueTable,
  } = useQuery(["revenueTable", "riders", activePage], () =>
    client(`/admin/rider?page=${activePage}&per-page=10`)
  );

  if (isError) throw error;

  // console.log("data", riderRevenueTable);

  return (
    <div className="revenue__table">
      <h4>Riders</h4>
      <Card className={"revenue__table-container"}>
        {isIdle || isLoading ? (
          <FullPageSpinner containerHeight="250px" />
        ) : riderRevenueTable?.rider ? (
          <table>
            <thead>
              <tr>
                <th className="infotext">Rider’s Name</th>
                <th className="infotext">Order Acceptance Rate</th>
                <th className="infotext">Comission</th>
                <th className="infotext">Income</th>
                <th className="infotext">Total Rides</th>
                <th className="infotext">Rating</th>
              </tr>
            </thead>
            <tbody>
              {riderRevenueTable?.rider.map((data) => {
                return (
                  <tr key={data.id} className="">
                    <td
                      className="subtext dark name"
                      onClick={() => navigate(`/riders/${data.id}`)}
                    >{`${data.firstname} ${data.lastname}`}</td>
                    <td className="infotext dark">{data.acceptance_rate}%</td>
                    <td className="infotext dark">{data.commission}%</td>
                    <td className="infotext dark">
                      &#163;{data.earning.all_time}
                    </td>
                    <td className="infotext dark">
                      {data.completed_deliveries}
                    </td>
                    <td className="infotext revenue">
                      <span>
                        <RatingStar star={data.ratingCount} />
                      </span>
                      {data.rating}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="revenue__table-container-noData">
            <RidersIcon />
            <p>All riders revenue data will appear here</p>
          </div>
        )}

        {riderRevenueTable?.rider && (
          <Pagination2
            pages={riderRevenueTable.meta.page_count + 1}
            activePage={activePage}
            onPageChange={(newActivePage) => setActivePage(newActivePage)}
          />
        )}
      </Card>
      {riderRevenueTable?.meta.total && (
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

export default RidersTable;
