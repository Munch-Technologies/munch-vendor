import {
  Button,
  ConfirmationModal,
  ErrorContent,
  FullPageSpinner,
} from "components";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useModal } from "utils/hooks";
import { useClient } from "utils/apiClient";
import { useQuery } from "react-query";

const RiderApplication = ({ status, setStatus }) => {
  const [current, setCurrent] = useState(1);
  const {
    CustomModal: ApprovalModal,
    revealModal: revealApprovalModal,
    closeModal: closeApprovalModal,
  } = useModal();
  const {
    CustomModal: RejectionModal,
    revealModal: revealRejectionModal,
    closeModal: closeRejectionModal,
  } = useModal();

  const client = useClient();
  const { riderId } = useParams();
  const {
    isIdle,
    isLoading,
    isError,
    error,
    data: riderDetail,
    refetch,
  } = useQuery(
    ["riderDetail", { riderId }],
    () => client(`/admin/rider/${riderId}`)
  );

  const approveApplication = () => {
    setStatus("approved");
    closeApprovalModal();
  };

  const rejectApplication = () => {
    setStatus("rejected");
    closeRejectionModal();
  };

  if (isLoading || isIdle) {
    return <FullPageSpinner containerHeight="40rem" />;
  }

  if (isError) {
    return (
      <ErrorContent
        error={error}
        reset={refetch}
      />
    );
  }
  function renderAccount() {
    return (
      <div className="rideraccount">
        <h3>Create Account</h3>
        <div key={riderDetail.rider.id} className="rideraccount__content">
          <div>
            <div className="subtext">Name</div>
            <h4>{`${riderDetail.rider.firstname} ${riderDetail.rider.lastname}`}</h4>
          </div>
          <div>
            <div className="subtext">Email</div>
            <h4>{riderDetail.rider.email}</h4>
          </div>
          <div>
            <div className="subtext">City</div>
            <h4>{riderDetail.rider.city}</h4>
          </div>
          <div>
            <div className="subtext">Post Code</div>
            <h4>{riderDetail.rider.postal_code}</h4>
          </div>
          <div>
            <div className="subtext">Phone Number</div>
            <h4>{riderDetail.rider.phone}</h4>
          </div>
        </div>
      </div>
    );
  }
  function renderbackground() {
    return (
      <div className="rideraccount">
        <h3>Background Check</h3>
        <div key={riderDetail.vehicle?.id} className="rideraccount__content">
          <div>
            <div className="subtext">Vehicle Type</div>
            <h4>{riderDetail.vehicle?.type}</h4>
          </div>
          <div>
            <div className="subtext">Vehicle Make</div>
            <h4>{riderDetail.vehicle?.make}</h4>
          </div>
          <div>
            <div className="subtext">Vehicle Model</div>
            <h4>{riderDetail.vehicle?.model}</h4>
          </div>
          <div>
            <div className="subtext">Vehicle Color</div>
            <h4>{riderDetail.vehicle?.colour}</h4>
          </div>
          <div>
            <div className="subtext">Driver’s License State</div>
            <h4>{riderDetail.rider.licence_state}</h4>
          </div>
          <div>
            <div className="subtext">Driver’s License Number</div>
            <h4>{riderDetail.rider.licence_number}</h4>
          </div>
          <div>
            <div className="subtext">Social Security Number</div>
            <h4>{riderDetail.rider.social_security_number}</h4>
          </div>
          <div>
            <div className="subtext">DOB</div>
            <h4>{riderDetail.rider.date_of_birth}</h4>
          </div>
        </div>
      </div>
    );
  }

  function renderAddAccount() {
    return (
      <div className="rideraccount">
        <h3>Add bank Account</h3>
        <div className="rideraccount__content">
          <div>
            <div className="subtext">Routing Number</div>
            <h4>{riderDetail.bank_account.routing_number}</h4>
          </div>
          <div>
            <div className="subtext">Bank Account</div>
            <h4>{riderDetail.bank_account.checking_account_number}</h4>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div>
      <ApprovalModal>
        <ConfirmationModal
          header="Approve Rider Application"
          message="This is to certify that the rider application has been
            thoroughly checked and approved by you"
          onConfirm={approveApplication}
          confirmText="Approve"
          cancelText="Cancel"
          closeModal={closeApprovalModal}
          instantClose
        />
      </ApprovalModal>
      <RejectionModal>
        <ConfirmationModal
          header="Reject Rider Application"
          message="This is to certify that the rider application has been
            thoroughly checked and rejected by you."
          onConfirm={rejectApplication}
          confirmText="Reject Application"
          cancelText="Cancel"
          closeModal={closeRejectionModal}
          alert
          instantClose
        />
      </RejectionModal>
      <div className=" riderapplication">
        <div className=" riderapplication__progress">
          <div
            className={` riderapplication__progress-indicator  one ${
              current === 1 ? "green" : null
            }`}
            onClick={() => setCurrent(1)}
          >
            1
          </div>
          <div
            className={` riderapplication__progress-indicator two ${
              current === 2 ? "green" : null
            }`}
            onClick={() => setCurrent(2)}
          >
            2
          </div>
          <div
            className={` riderapplication__progress-indicator three ${
              current === 3 ? "green" : null
            }`}
            onClick={() => setCurrent(3)}
          >
            3
          </div>
        </div>

        {/* menu cards */}
        <div className="riderapplication__content">
          {(() => {
            switch (current) {
              case 1:
                return renderAccount();
              case 2:
                return renderbackground();
              case 3:
                return renderAddAccount();
              default:
                return null;
            }
          })()}

          <div className="application__content-buttons">
            {current >= 2 && (
              <Button
                className={"previous"}
                titleClass={"previousStyle"}
                onClick={() => setCurrent(current - 1)}
                title={"Previous"}
              />
            )}
            {current === 3 && status === "pending" && (
              <>
                <Button
                  className={"cancel"}
                  titleClass={"cancelStyle"}
                  title={"Don’t Approve"}
                  onClick={revealRejectionModal}
                />
                <Button
                  className={"next"}
                  titleClass={"nextStyle"}
                  onClick={revealApprovalModal}
                  title={"Approve"}
                />
              </>
            )}
            {current < 3 && (
              <Button
                className={"next"}
                titleClass={"nextStyle"}
                onClick={() => setCurrent((o) => o + 1)}
                title={"Next"}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderApplication;
