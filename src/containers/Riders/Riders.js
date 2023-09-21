import { DownloadIcon, LocationIcon, RidersIcon } from "assets/icons";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  ErrorContent,
  FallbackResultCard,
  FullPageSpinner,
  Image,
  Pagination2,
  RatingStar,
  SearchInput,
  StatusPill,
} from "components";
import React, { useState } from "react";
import RidersStatistics from "./RidersStatistics";
import { useClient } from "utils/apiClient";
import { useQuery } from "react-query";
import RiderMetric from "./RiderMetric";

const Riders = () => {
  return (
    <div className="riders">
      <h3 className="riders__title">Riders</h3>
      <RidersStatistics />
      <RiderMetric />
      <RidersTable />

      <Button
        className={"download-button"}
        titleClass="download-button-text"
        title={"Download Report"}
        iconLeft={<DownloadIcon />}
      />
    </div>
  );
};

export default Riders;

const RidersTable = () => {
  const [search, setSearch] = useState("");
  const [activePage, setActivePage] = useState(1);

  const navigate = useNavigate();

  const client = useClient();

  const {
    isIdle,
    isLoading,
    isError,
    error,
    data: riderData,
    refetch,
  } = useQuery(
    [
      "riderData",
      {
        activePage,
        search,
      },
    ],
    () =>
      client(
        `/admin/rider?page=${activePage}&per-page=10&search-term=${encodeURIComponent(
          search
        )}`
      )
  );
  console.log(riderData);
  if (isError) {
    return <ErrorContent error={error} reset={refetch} />;
  }

  return (
    <>
      <div className="search">
        <h4 className="search__title">All Riders</h4>
        <SearchInput value={search} onChange={setSearch} />
      </div>

      <div className="riders__table">
        {isLoading || isIdle ? (
          <FullPageSpinner containerHeight="30rem" />
        ) : riderData?.rider ? (
          <Card>
            <table>
              <thead>
                <tr>
                  <th className="infotext">Rider’s ID</th>
                  <th className="infotext">Email</th>
                  <th className="infotext">Location</th>
                  <th className="infotext">Ratings</th>
                  <th className="infotext">Status</th>
                </tr>
              </thead>
              <tbody>
                {riderData.rider.map((detail) => {
                  return (
                    <tr key={detail.id} className="rows">
                      <td className="riderId">
                        <Image
                          src={detail.avatar}
                          alt={`rider ${detail.firstname}`}
                        />
                        <div className="riderId-text">
                          <div className="bodytext">{`${detail.firstname} ${detail.lastname}`}</div>
                          <div className="infotext">{detail.id}</div>
                        </div>
                      </td>
                      <td className="infotext">{detail.email}</td>
                      <td className="location">
                        <div className="location-icon">
                          <LocationIcon />
                        </div>
                        <div className="subtext">{detail.address}</div>
                      </td>
                      <td className="infotext rating">
                        <span>
                          <RatingStar star={detail.rating} />
                        </span>
                        {/* {350} */}
                      </td>
                      <td className="infot">
                        <StatusPill value={detail.approval_status} />
                      </td>
                      <td>
                        <Button
                          onClick={() => navigate(`/riders/${detail.id}`)}
                          className={"data"}
                          title={"View"}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        ) : (
          <FallbackResultCard>
            <RidersIcon />
            <p>No Riders found</p>
          </FallbackResultCard>
        )}
        {riderData?.rider && (
          <Pagination2
            pages={riderData?.meta.page_count}
            activePage={activePage}
            onPageChange={(newActivePage) => setActivePage(newActivePage)}
          />
        )}
      </div>
    </>
  );
};
