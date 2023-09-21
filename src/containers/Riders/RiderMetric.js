import {
  Card,
  ChangeStatusIndicator,
  DummyGraph,
  ErrorContent,
  FullPageSpinner,
  PillsDropdown,
} from "components";
import React from "react";
import { useClient } from "utils/apiClient";
import { useQuery } from "react-query";
import { useRangeDropdown } from "utils/hooks";

const RiderMetric = () => {
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
    data: ridersMetric,
    refetch,
  } = useQuery(["ridersMetrics", selectedRange.value], () =>
    client(`/admin/rider/metrics?time-frame=${selectedRange.value}`)
  );

  if (isLoading || isIdle) {
    return (
      <Card style={{ margin: "2rem 0" }}>
        <FullPageSpinner containerHeight="20rem" />
      </Card>
    );
  }

  if (isError) {
    return (
      <ErrorContent
        error={error}
        reset={refetch}
      />
    );
  }

  return (
    <>
      <div className="pills">
        <PillsDropdown
          list={ranges}
          value={selectedRange.text}
          onSelect={onRangeSelected}
        />
      </div>
      <div className="menuorders__cards orders__metric">
        <Card className={"menuorders__card"}>
          <h5 className="menuorders__card-title">Total Completed Rides</h5>

          <p className="menuorders__card-value">
            {ridersMetric.total_completed_ride}
          </p>

          <div className="menuorders__card-change">
            <ChangeStatusIndicator
              percentage={ridersMetric.completed_rider_percentage_change}
            />
            <span>vs {selectedRange.text}</span>
          </div>
          <div className="menuorders__card-graph">
            <DummyGraph
              percentage={ridersMetric.completed_rider_percentage_change}
            />
          </div>
        </Card>
        <Card className={"menuorders__card"}>
          <h5 className="menuorders__card-title">Ride Acceptance Rate</h5>

          <p className="menuorders__card-value">
            {ridersMetric.ride_acceptance_rate}%/<span>min</span>
          </p>
          <div className="menuorders__card-change">
            <span className="positive">+ve</span>Keep above 90%
          </div>
        </Card>
        <Card className={"menuorders__card"}>
          <h5 className="menuorders__card-title">Order Rejection Rate</h5>

          <p className="menuorders__card-value">
            {ridersMetric.ride_rejection_rate}%/<span>min</span>
          </p>
          <div className="menuorders__card-change">
            <span className="negative">-ve</span>Keep below 1.0%
          </div>
        </Card>
      </div>
    </>
  );
};

export default RiderMetric;
