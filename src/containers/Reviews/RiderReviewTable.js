import { DownloadIcon, ReviewIcon } from "assets/icons";
import {
  Button,
  Card,
  FallbackResultCard,
  FullPageSpinner,
  Pagination2,
} from "components";
import React, { useState } from "react";
import RiderReviewRow from "./RiderReviewRow";
import { useClient } from "utils/apiClient";
import { useQuery } from "react-query";

const RiderReviewTable = () => {
  const client = useClient();
  const [activePage, setActivePage] = useState(1);

  const { isIdle, isLoading, data } = useQuery(
    [
      "riderReview",
      {
        activePage,
      },
    ],
    () => client(`/admin/review/riders?page=${activePage}&per-page=10`)
  );

  if (isIdle || isLoading) {
    return <FullPageSpinner containerHeight="20rem" />;
  }
  return (
    <div className="restaurantreview__table">
      <h4>Riders</h4>
      {data.reviews?.length ? (
        <Card className={"restaurantreview__table-container"}>
          <table>
            <thead>
              <tr>
                <th className="infotext">Customer</th>
                <th className="infotext">Review</th>
                <th className="infotext">Rider's Name</th>
                <th className="infotext">Date</th>
                <th className="infotext">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.reviews.map((data) => {
                return <RiderReviewRow data={data} key={data.id} />;
              })}
            </tbody>
          </table>

          {data?.reviews && (
            <Pagination2
              pages={data.meta.page_count + 1}
              activePage={activePage}
              onPageChange={(newActivePage) => setActivePage(newActivePage)}
            />
          )}
        </Card>
      ) : (
        <FallbackResultCard>
          <ReviewIcon />
          <p>{`No reviews found`}</p>
        </FallbackResultCard>
      )}
      <Button
        className={"download-button"}
        titleClass="download-button-text"
        title={"Download Report"}
        iconLeft={<DownloadIcon />}
      />
    </div>
  );
};

export default RiderReviewTable;
