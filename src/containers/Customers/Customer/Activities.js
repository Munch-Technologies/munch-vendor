import { FullPageSpinner } from "components";
import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { useClient } from "utils/apiClient";
import Activity from "./Activity";

export default function Activities() {
  const { customerId } = useParams();
  const client = useClient();
  const {
    isIdle,
    isLoading,
    isError,
    error,
    data: customerActivities,
  } = useQuery(["customerActivities", { customerId }], () =>
    client(`/admin/user/${customerId}/order-history`)
  );

  // console.log("customerActivities", customerActivities);

  if (isError) throw error;

  if (isLoading || isIdle) {
    return <FullPageSpinner containerHeight="40rem" />;
  }
  return (
    <div className="userActivities">
      {customerActivities?.map((activity) => (
        <Activity activity={activity} key={activity.id} />
      ))}
    </div>
  );
}
