import { DownloadIcon, ReviewIcon } from "assets/icons";
import {
  Button,
  Card,
  FallbackResultCard,
  FullPageSpinner,
  Pagination2,
} from "components";
import React, { useState } from "react";
import { useClient } from "utils/apiClient";
import { useQuery } from "react-query";
import RestaurantReviewRow from "./RestaurantReviewRow";

const RestaurantReviewTable = () => {
  const client = useClient();
  const [activePage, setActivePage] = useState(1);

  const { isIdle, isLoading, data} = useQuery(
    [
      "restaurantReview",
      {
        activePage,
      },
    ],
    () => client(`/admin/review/restaurants?page=${activePage}&per-page=10`)
  );

  if (isIdle || isLoading) {
    return <FullPageSpinner containerHeight="20rem" />;
  }

  return (
    <div className="restaurantreview__table">
      <h4>Restaurant</h4>
      {data?.reviews?.length ? (
        <Card className={"restaurantreview__table-container"}>
          <table>
            <thead>
              <tr>
                <th className="infotext">Customer</th>
                <th className="infotext">Comment</th>
                <th className="infotext">Restaurant</th>
                <th className="infotext">Rating</th>
                <th className="infotext">time</th>
              </tr>
            </thead>
            <tbody>
              {data.reviews?.map((data) => {
                return <RestaurantReviewRow key={data.id} data={data} />;
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

export default RestaurantReviewTable;
