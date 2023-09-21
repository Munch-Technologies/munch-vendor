import React, { useState } from "react";
import {
  Button,
  ConfirmationModal,
  ErrorContent,
  FullPageSpinner,
} from "../../../components";
import { useModal } from "utils/hooks";
import { useQuery } from "react-query";
import { useClient } from "utils/apiClient";
import { useParams } from "react-router-dom";
function renderRestaurantInfo(bussinessInfo) {
  return (
    <div className="business">
      <h3>Business Information</h3>
      {/* {console.log(bussinessInfo)} */}
      <div className="business__content">
        <div>
          <div className="subtext business-infoHead">Restaurant Name</div>
          <h4>{bussinessInfo.name}</h4>
        </div>
        <div>
          <div className="subtext business-infoHead">Restaurant Address</div>
          <h4>{bussinessInfo.address.address.address}</h4>
        </div>
        <div>
          <div className="subtext business-infoHead">City</div>
          <h4>{bussinessInfo.address.city}</h4>
        </div>
        <div>
          <div className="subtext business-infoHead">Post Code</div>
          <h4>{bussinessInfo.address.post_code}</h4>
        </div>
        <div>
          <div className="subtext business-infoHead">Phone Number</div>
          <a href={`tel:${bussinessInfo.phone}`}>{bussinessInfo.phone}</a>
        </div>
        <div>
          <div className="subtext business-infoHead">Restaurant Email</div>
          <a href={`mailto:${bussinessInfo.email}`}>{bussinessInfo.email}</a>
        </div>
        <div>
          <div className="subtext business-infoHead">
            Is this the head office location?
          </div>
          <h4>{bussinessInfo.address.is_head_office ? "Yes" : "No"}</h4>
        </div>
      </div>
    </div>
  );
}
function renderPersonalInfo(restaurantOwnerData) {
  return (
    <div className="business">
      <h3>Personal Information</h3>
      <div className="business__content">
        <div>
          <div className="subtext business-infoHead">First Name</div>
          <h4>{restaurantOwnerData.owner.first_name}</h4>
        </div>
        <div>
          <div className="subtext business-infoHead">Last Name</div>
          <h4>{restaurantOwnerData.owner.last_name}</h4>
        </div>
        <div>
          <div className="subtext business-infoHead">Role</div>
          <h4>{restaurantOwnerData.owner.role}</h4>
        </div>
        <div>
          <div className="subtext business-infoHead">Phone Number</div>
          <a href={`tel:+${restaurantOwnerData.owner.phone}`}>
            {restaurantOwnerData.owner.phone}
          </a>
        </div>
        <div>
          <div className="subtext business-infoHead">Restaurant Email</div>
          <a href={`mailto:${restaurantOwnerData.owner.email}`}>
            {restaurantOwnerData.owner.email}
          </a>
        </div>
        <div>
          <div className="subtext business-infoHead">Identity</div>
          <h4>{restaurantOwnerData.owner.identity}</h4>
        </div>
      </div>
    </div>
  );
}

function renderBusinessInfo(bussinessInfo) {
  return (
    <div className="business">
      <h3>Business Information</h3>
      <div className="business__content">
        <div>
          <div className="subtext business-infoHead">
            How Many Locations Does Your Restaurant Have?
          </div>
          <h4>{bussinessInfo.number_of_location}</h4>
        </div>
        <div>
          <div className="subtext business-infoHead">
            How Many Orders Do You Typically Get Per Week?
          </div>
          <h4>{bussinessInfo.average_orders_per_week}</h4>
        </div>
        <div>
          <div className="subtext business-infoHead">Restaurant Cuisine</div>
          <h4>{bussinessInfo.restaurant_cuisine}</h4>
        </div>
        <div>
          <div className="subtext business-infoHead">Opening Hours</div>
          <h4>{`${new Date(bussinessInfo.opening_hours.opens_at).toLocaleString(
            "en-US",
            { hour: "numeric", hour12: true }
          )} - ${new Date(bussinessInfo.opening_hours.closes_at).toLocaleString(
            "en-US",
            { hour: "numeric", hour12: true }
          )}`}</h4>
        </div>
        <div>
          <div className="subtext business-infoHead">
            Do You Have a Food Standard Agency Hygiene ID?
          </div>
          <h4>
            {bussinessInfo.food_standard_agency_hygiene.is_available
              ? "Yes"
              : "No"}
          </h4>
        </div>
        {bussinessInfo.food_standard_agency_hygiene.is_available && (
          <div>
            <div className="subtext business-infoHead">
              Food Standard Agency Hygiene Link
            </div>
            <a href={`${bussinessInfo.food_standard_agency_hygiene.link}`}>
              {bussinessInfo.food_standard_agency_hygiene.link}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
function renderDeliveryInfo(deliveryInfo) {
  return (
    <div className="business">
      <h3>Delivery Information</h3>
      <div className="delivery">
        <div>
          <div className="subtext business-infoHead">
            What Is Your Preferred Delivery Choice
          </div>
          <h4>{deliveryInfo.preferred_delivery_method.description}</h4>
        </div>
        <div>
          <div className="subtext business-infoHead">
            Do You Want Customers To Pick Up From You?
          </div>
          <h4>
            {deliveryInfo.preferred_delivery_method.customer_pickup
              ? "Yes"
              : "No"}
          </h4>
        </div>
      </div>
    </div>
  );
}
function renderBankInfo(bankInfo) {
  return (
    <div className="business">
      <h3>Bank Details</h3>
      <div className="business__content">
        <div>
          <div className="subtext business-infoHead">Bank Name</div>
          <h4>{bankInfo.bank_information.name}</h4>
        </div>
        <div>
          <div className="subtext business-infoHead">Billing Address</div>
          <h4>{bankInfo.bank_information.billing_address}</h4>
        </div>
        <div>
          <div className="subtext business-infoHead">Account Name</div>
          <h4>{bankInfo.bank_information.account_name}</h4>
        </div>
        <div>
          <div className="subtext business-infoHead">Account Number</div>
          <h4>{bankInfo.bank_information.account_number}</h4>
        </div>
        <div>
          <div className="subtext business-infoHead">Bank Sort Code</div>
          <h4>{bankInfo.bank_information.sort_code}</h4>
        </div>
      </div>
    </div>
  );
}
function renderStructureInfo(businessInfo) {
  return (
    <div className="business">
      <h3>Delivery Information</h3>
      <div className="delivery">
        <div>
          <div className="subtext business-infoHead">
            How Is Your Business Structured?
          </div>
          <h4>{businessInfo.business_structure.structure}</h4>
        </div>
        <div>
          <div className="subtext business-infoHead">
            Liability Insurance Expiry Date
          </div>
          <h4>
            {
              businessInfo.business_structure
                .public_liability_insurance_expiry_date
            }
          </h4>
        </div>
        <div>
          <div className="subtext business-infoHead">
            Are You VAT Registered?
          </div>
          <h4>
            {businessInfo.business_structure.is_vat_registered ? "Yes" : "No"}
          </h4>
        </div>
        {businessInfo.business_structure.is_vat_registered && (
          <div>
            <div className="subtext business-infoHead">VAT Number</div>
            <h4>{businessInfo.business_structure.vat_number}</h4>
          </div>
        )}
      </div>
    </div>
  );
}

// restaurant Data sample
// const restaurantFullDetailsSample = {
//   status: "pending",
//   bussinessInfo: {
//     name: "Bee’s Place",
//     address: {
//       street: "Aylesham Centre, Hanover Park",
//       city: "London",
//       postCode: "335678",
//       headOffice: true,
//     },
//     phoneNumber: "+447679654789756",
//     email: "beesplace@gmail.com",
//     bussinessStructure: "Limited Liability Company",
//     insuranceExpiry: "Fri Sep 23 2022",
//     VAT: {
//       registered: true,
//       number: "343434",
//     },
//     locationCount: 2,
//     averageOrderPerWeek: 600,
//     cuisine: "African Dishes",
//     openingHours: {
//       open: "09:00am",
//       close: "10:00pm",
//     },
//     foodStandardAgencyHygiene: {
//       available: true,
//       link: "https://foodstandardagency",
//     },
//   },
//   ownerInfo: {
//     name: {
//       first: "Bisola",
//       last: "Balogun",
//     },
//     role: "Owner",
//     phone: "+447679654789756",
//     email: "beesplace@gmail.com",
//     identity: "African",
//   },
//   deliveryInfo: {
//     preferredChoice: "With Munch Riders",
//     pickUp: true,
//   },
//   bankInfo: {
//     name: "CITI Bank",
//     billingAddress: "2, Kings Place, Manchester",
//     accountName: "Bee’s Place",
//     accountNumber: "65679943",
//     sortCode: "23461",
//   },
// };

const RestaurantApplication = ({ status, setStatus }) => {
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
  const { restaurantId } = useParams();

  const {
    isIdle,
    isLoading,
    isError,
    error,
    data: restaurantData,
    refetch,
  } = useQuery(["restaurant", { restaurantId }], () =>
    client(`/admin/restaurant/${restaurantId}`)
  );

  if (isIdle || isLoading) return <FullPageSpinner containerHeight="20rem" />;

  if (isError) {
    return (
      <ErrorContent
        title="Error loading Restaurant application data!"
        retry={refetch}
        error={error}
      />
    );
  }

  const approveApplication = () => {
    setStatus("approved");
    closeApprovalModal();
  };

  const rejectApplication = () => {
    setStatus("rejected");
    closeRejectionModal();
  };

  return (
    <>
      <ApprovalModal>
        <ConfirmationModal
          header="Approve Restaurant"
          message="This is to certify that the restaurant application has been
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
          header="Reject Restaurant Application"
          message="This is to certify that the restaurant application has been
            thoroughly checked and rejected by you."
          onConfirm={rejectApplication}
          confirmText="Reject Application"
          cancelText="Cancel"
          closeModal={closeRejectionModal}
          alert
          instantClose
        />
      </RejectionModal>
      <div className="application">
        <div className="application__progress">
          <div
            className={`application__progress-indicator one ${
              current >= 1 ? "green" : null
            }`}
            onClick={() => setCurrent(1)}
          >
            1
          </div>
          <div
            className={`application__progress-indicator two ${
              current >= 2 ? "green" : null
            }`}
            onClick={() => setCurrent(2)}
          >
            2
          </div>
          <div
            className={`application__progress-indicator three ${
              current >= 3 ? "green" : null
            }`}
            onClick={() => setCurrent(3)}
          >
            3
          </div>
          <div
            className={`application__progress-indicator four ${
              current >= 4 ? "green" : null
            }`}
            onClick={() => setCurrent(4)}
          >
            4
          </div>
          <div
            className={`application__progress-indicator five ${
              current >= 5 ? "green" : null
            }`}
            onClick={() => setCurrent(5)}
          >
            5
          </div>
          <div
            className={`application__progress-indicator six ${
              current >= 6 ? "green" : null
            }`}
            onClick={() => setCurrent(6)}
          >
            6
          </div>
        </div>

        {/* menu cards */}
        <div className="application__content">
          {(() => {
            switch (current) {
              case 1:
                return renderRestaurantInfo(restaurantData);
              case 2:
                return renderPersonalInfo(restaurantData);
              case 3:
                return renderBusinessInfo(restaurantData);
              case 4:
                return renderDeliveryInfo(restaurantData);
              case 5:
                return renderStructureInfo(restaurantData);
              case 6:
                return renderBankInfo(restaurantData);
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
            {current === 6 && status === "pending" && (
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
            {current < 6 && (
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
    </>
  );
};

export default RestaurantApplication;
