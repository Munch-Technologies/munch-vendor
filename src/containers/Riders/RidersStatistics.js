import { MunchRider, RestaurantRider } from "assets/images";
import { Card, ErrorContent, FullPageSpinner } from "components";
import { useQuery } from "react-query";
import React from "react";
import { useClient } from "utils/apiClient";

const RidersStatistics = () => {
  const client = useClient();

  const {
    isIdle,
    isLoading,
    isError,
    error,
    data: ridersStat,
    refetch,
  } = useQuery(["ridersStatistics"], () => client(`/admin/rider/statistics`));

  if (isLoading || isIdle) {
    return <FullPageSpinner containerHeight="20rem" />;
  }

  if (isError) {
    return (
      <ErrorContent
        error={error}
        reset={refetch}
      />
    );
  }

  const { total_riders, munch_riders, restaurant_riders } = ridersStat;

  const statistics = [
    {
      id: 1,
      icon: MunchRider,
      title: "Total Riders",
      number: total_riders,
    },
    {
      id: 2,
      icon: MunchRider,
      title: "Munch Riders",
      number: munch_riders,
    },
    {
      id: 3,
      icon: RestaurantRider,
      title: "Restaurant Riders",
      number: restaurant_riders,
    },
  ];
  return (
    <div className="riders__stats">
      {statistics.map((statistic) => {
        return (
          <Card key={statistic.id} className={"riders__stats-stat"}>
            <div className="riders__stats-icon">
              <img src={statistic.icon} alt="" />
            </div>
            <p className="riders__stats-title">{statistic.title}</p>
            <p className="riders__stats-value">{statistic.number}</p>
          </Card>
        );
      })}
    </div>
  );
};

export default RidersStatistics;
