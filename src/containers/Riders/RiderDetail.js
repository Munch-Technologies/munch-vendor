import {
  BigRider,
  ChevronDown,
  CoinIcon,
  LoadingSpinner,
  ZapIcon,
} from "assets/icons";
import {
  Card,
  ChangeStatusIndicator,
  CustomDropdown,
  ErrorButton,
  ErrorContent,
  FullPageSpinner,
  Image,
  RatingStar,
  StatusPill,
} from "components";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import RiderApplication from "./RiderApplication";
import RiderDocument from "./RiderDocument";
import { useClient } from "utils/apiClient";
import { useMutation, useQuery, useQueryClient } from "react-query";
import produce from "immer";
import SubNavigation from "components/SubNavigation";
import { ErrorBoundary } from "react-error-boundary";

var months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const listTab = [
  {
    value: 1,
    title: "View Application",
  },
  {
    value: 2,
    title: "Document",
  },
];

const RiderDetail = () => {
  const client = useClient();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState(1);
  const { riderId } = useParams();

  const {
    isIdle,
    isLoading,
    isError,
    error,
    data: riderDetail,
    refetch,
  } = useQuery(["riderDetail", { riderId }], () =>
    client(`/admin/rider/${riderId}`)
  );
  console.log(riderDetail);

  const {
    mutate,
    isLoading: isMutationLoading,
    isError: isMutationError,
    error: mutationError,
  } = useMutation(
    (data) => {
      return client(`/admin/rider/${riderId}`, {
        method: "PATCH",
        data,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["riderDetail", { riderId }]);
      },
      onMutate: (data) => {
        const previousItems = queryClient.getQueryData([
          "riderDetail",
          { riderId },
        ]);

        queryClient.setQueryData(["riderDetail", { riderId }], (old) =>
          produce(old, (draft) => {
            draft.rider.approval_status = data.status;
          })
        );

        return () =>
          queryClient.setQueryData(["riderDetail", { riderId }], previousItems);
      },
    }
  );

  // console.log("riderDetail", riderDetail);

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
  const { five_star, four_star, one_star, three_star, two_star } =
    riderDetail.rating_count;
  // const ratingCount = five_star + four_star + three_star + two_star + one_star;
  // const avergeRating = (
  //   (five_star * 5 +
  //     four_star * 4 +
  //     three_star * 3 +
  //     two_star * 2 +
  //     one_star * 1) /
  //   ratingCount
  // ).toFixed(1);
  const mydate =
    months[new Date(riderDetail.rider.created_at).getMonth()] +
    " " +
    new Date(riderDetail.rider.created_at).getFullYear();

  const changeStatus = (value) => {
    if (value !== riderDetail.rider.approval_status) {
      // change rider status
      mutate({ approval_status: value });
    }
  };

  return (
    <>
      <div className="riderdetail">
        <div className="riderdetail__header">
          <div className="riderdetail__header-image">
            <Image src={riderDetail.rider.avatar} alt="one of munch drivers" />
          </div>

          <div className="riderdetail__header-detail">
            <div className="bodytext riderdetail__header-detail-user">
              <div className="name">{`${riderDetail.rider.firstname} ${riderDetail.rider.lastname}`}</div>
              <div className="status">
                <StatusPill value={riderDetail.rider.approval_status} />
              </div>
              <div className="detailDropdown">
                {isMutationError && (
                  <span className="detailDropdown-error">
                    {mutationError.message}
                  </span>
                )}
                <span className="detailDropdown-status">
                  {isMutationLoading ? (
                    <LoadingSpinner />
                  ) : isMutationError ? (
                    <ErrorButton />
                  ) : null}
                </span>
                <CustomDropdown
                  className="detailDropdown-dropdown"
                  header={
                    <div className="riderdetail__header-detail-user-dropdown">
                      <StatusPill
                        value={riderDetail.rider.approval_status || "pending"}
                        textOnly
                      />
                      <ChevronDown />
                    </div>
                  }
                  list={["approved", "suspended", "rejected", "pending"]}
                  onSelect={(value) => changeStatus(value)}
                />
              </div>
            </div>

            <div className="riderdetail__header-detail-reviews infotext">
              <div className="star">
                <RatingStar star={riderDetail.rider.rating} />{" "}
                <span className="value">{riderDetail.rider.rating}</span>
              </div>
              <div className="riderdetail__header-detail-reviews-review">
                <span>{`${riderDetail.rider.number_of_rating} ratings`}</span>
              </div>
            </div>

            <div className="riderdetail__header-detail-points infotext">
              <CoinIcon />
              <div className="point">{`${riderDetail.rider.munch_coins} ${
                riderDetail.rider.points > 1 ? "Points" : "Point"
              }`}</div>
            </div>

            <div className="riderdetail__header-detail-date infotext">
              Joined {mydate}
            </div>
          </div>

          <div className="riderdetail__header-vector">
            <BigRider />
          </div>
        </div>

        <div className="riderdetail__content">
          <div className="riderdetail__content-cards">
            <div className="riderdetail__content-cards-card">
              <div className="infotext">Total Trip</div>
              <h3 className="text tip">{riderDetail.rider.total_trips}</h3>
            </div>
            <div className="riderdetail__content-cards-card">
              <div className="infotext">Cancelled Ride</div>
              <h3 className="text cancelled">
                {riderDetail.rider.cancelled_ride}
              </h3>
            </div>
            <div className="riderdetail__content-cards-card">
              <div className="infotext">Finished Ride</div>
              <h3 className="text finished">
                {riderDetail.rider.completed_deliveries}
              </h3>
            </div>
            <div className="riderdetail__content-cards-card">
              <div className="infotext">Status</div>
              <h3 className="text">{riderDetail.rider.status}</h3>
            </div>
            <div className="riderdetail__content-cards-card">
              <div className="infotext">Distance Covered</div>
              <h3 className="text">{riderDetail.rider.distance_covered}km</h3>
            </div>
            <div className="riderdetail__content-cards-card">
              <div className="infotext">Total Time</div>
              <h3 className="text">{riderDetail.rider.total_time}hrs</h3>
            </div>
            <div className="riderdetail__content-cards-card">
              <div className="infotext">Total Tip</div>
              <h3 className="text">&#163;{riderDetail.rider.total_tip}</h3>
            </div>
            <div className="riderdetail__content-cards-card">
              <div className="infotext">Munch Coin</div>
              <h3 className="text">{riderDetail.rider.munch_coins}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="riderdetail__metric">
        <Card className="riderdetail__metric-performance">
          <div className="title">
            <div className="title-icon">
              <ZapIcon />
            </div>
            <div className="textmd">Performance</div>
          </div>

          <div className="textsmbold">{riderDetail.performance}%</div>

          <div className="riderdetail__metric-performance-change">
            <ChangeStatusIndicator
              percentage={riderDetail.performance_percentage_change}
            />
            <div className="textsm">vs last week</div>
          </div>
        </Card>
        <Card className="riderdetail__metric-rating">
          <h3 className="riderdetail__metric-rating-count">
            {riderDetail.rider.rating}
          </h3>
          <RatingStar star={riderDetail.rider.rating} />
          <ul className="ratingList">
            <li className="item">
              <div className="infotext">5 Stars</div>{" "}
              <div className="progress">
                <div
                  style={{
                    height: "0.8rem",
                    width: `${
                      isNaN(five_star / riderDetail.rider.number_of_rating)
                        ? 0
                        : (five_star / riderDetail.rider.number_of_rating) * 100
                    }%`,
                    backgroundColor: "#fec200",
                    borderRadius: "0.6rem",
                  }}
                />
              </div>
            </li>
            <li className="item">
              <div className="infotext">4 Stars</div>{" "}
              <div className="progress">
                <div
                  style={{
                    height: "0.8rem",
                    width: `${
                      isNaN(four_star / riderDetail.rider.number_of_rating)
                        ? 0
                        : (four_star / riderDetail.rider.number_of_rating) * 100
                    }%`,
                    backgroundColor: "#fec200",
                    borderRadius: "0.6rem",
                  }}
                />
              </div>
            </li>
            <li className="item">
              <div className="infotext">3 Stars</div>{" "}
              <div className="progress">
                <div
                  style={{
                    height: "0.8rem",
                    width: `${
                      isNaN(three_star / riderDetail.rider.number_of_rating)
                        ? 0
                        : (three_star / riderDetail.rider.number_of_rating) *
                          100
                    }%`,
                    backgroundColor: "#fec200",
                    borderRadius: "0.6rem",
                  }}
                />
              </div>
            </li>
            <li className="item">
              <div className="infotext">2 Stars</div>{" "}
              <div className="progress">
                <div
                  style={{
                    height: "0.8rem",
                    width: `${
                      isNaN(two_star / riderDetail.rider.number_of_rating)
                        ? 0
                        : (two_star / riderDetail.rider.number_of_rating) * 100
                    }%`,
                    backgroundColor: "#fec200",
                    borderRadius: "0.6rem",
                  }}
                />
              </div>
            </li>
            <li className="item">
              <div className="infotext">1 Stars</div>{" "}
              <div className="progress">
                <div
                  style={{
                    height: "0.8rem",
                    width: `${
                      isNaN(one_star / riderDetail.rider.number_of_rating)
                        ? 0
                        : (one_star / riderDetail.rider.number_of_rating) * 100
                    }%`,
                    backgroundColor: "#fec200",
                    borderRadius: "0.6rem",
                  }}
                />
              </div>
            </li>
          </ul>
        </Card>
      </div>

      {/* tab navigation */}
      <SubNavigation
        className="restaurant__tab"
        navList={listTab}
        selected={tab}
        onSelect={(priority) => setTab(priority.value)}
        variant="underlined"
      />

      <ErrorBoundary
        FallbackComponent={ErrorContent}
        onReset={() => {
          // reset the state of your app so the error doesn't happen again
        }}
        resetKeys={[tab]}
      >
        <>
          {tab === 1 ? (
            <RiderApplication
              status={riderDetail.rider.approval_status}
              setStatus={changeStatus}
            />
          ) : tab === 2 ? (
            <RiderDocument documents={riderDetail.rider?.document || []} />
          ) : null}
        </>
      </ErrorBoundary>
    </>
  );
};

export default RiderDetail;
