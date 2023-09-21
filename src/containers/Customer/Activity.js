import { Button, OrderDetailsModal } from "components";
import React from "react";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { useModal } from "utils/hooks";
import getTimeAgo from "utils/timeAgo";

const Activity = ({ activity }) => {
  const { customerId } = useParams();
  const { CustomModal, revealModal, closeModal } = useModal();
  const queryClient = useQueryClient();

  return (
    <div className="activity">
      <CustomModal>
        <OrderDetailsModal
          closeModal={closeModal}
          list={activity}
          onAcceptOrReject={() => {
            queryClient.invalidateQueries([
              "customerActivities",
              { customerId },
            ]);
          }}
        />
      </CustomModal>
      <div className="infotext">
        {getTimeAgo(new Date(activity.timeline.created_at))}
      </div>
      <div className="subtext">
        Ordered food from {activity.restaurant.name}{" "}
        <Button title={"View Order"} onClick={revealModal} />
      </div>
    </div>
  );
};

export default Activity;
