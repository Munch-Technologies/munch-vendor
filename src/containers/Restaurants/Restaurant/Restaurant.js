import React from "react";
import { Route, Routes, useParams } from "react-router-dom";
import {
  CircleCheck,
  LoadingSpinner,
  ThreeDot,
  VerifyIcon,
} from "../../../assets/icons";
import {
  ActionsDropdown,
  ApproveDropdown,
  Card,
  EditableInput2,
  ErrorButton,
  ErrorContent,
  FullPageSpinner,
  RestaurantImage,
} from "../../../components";
import {
  MenuCards,
  RestaurantApplication,
  Document,
  MenuOrders,
  MenuStore,
} from "./index";
import { useState } from "react";
import { useClient } from "utils/apiClient";
import { useMutation, useQuery, useQueryClient } from "react-query";
import SubNavigation from "components/SubNavigation";
import EditMenu from "./EditMenu";
import { useNavigate } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import apiAxios from "apis/apiAxios";

const subnavigations = [
  { title: "View Application", value: "application" },
  { title: "Menu", value: "menu" },
  { title: "Orders", value: "orders" },
  { title: "Store", value: "store" },
  { title: "Documents", value: "documents" },
];

const Restaurant = () => {
  const client = useClient();
  const navigate = useNavigate();
  const params = useParams();
  const restaurantId = params.restaurantId;
  const menuId = params["*"];
  const [tab, setTab] = useState(() => (menuId ? "menu" : "application"));

  const queryClient = useQueryClient();

  const {
    isIdle,
    isLoading,
    isError,
    error,
    data: restaurantData,
  } = useQuery(["restaurant", { restaurantId }], () =>
    client(`/admin/restaurant/${restaurantId}`)
  );

  const [recentlyChanged, setRecentlyChanged] = useState("");
  const {
    mutate,
    isLoading: changeIsLoading,
    isError: changeIsError,
    isSuccess: changeIsSuccess,
    error: changeError,
  } = useMutation(
    (data) => {
      if (data.hasOwnProperty("media")) {
        let fd = new FormData();
        fd.append("media", data.media);
        // let a = client(`/admin/restaurant/${restaurantId}/avatar`, {
        //   method: "patch",
        //   data: fd,
        //   headers: {
        //     "Content-Type": "multipart/form-data",
        //   },
        // });
        // let b = client(`/admin/restaurant/${restaurantId}`, {
        //   data: {
        //     image_status: data.image_status,
        //   },
        //   method: "patch",
        // });

        // return Promise.all([a, b]);

        return apiAxios.patch(`/admin/restaurant/${restaurantId}/avatar`, fd);
      }
      return client(`/admin/restaurant/${restaurantId}`, {
        data,
        method: "patch",
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["restaurant", { restaurantId }]);
      },

      onMutate: (data) => {
        const previousItems = queryClient.getQueryData([
          "restaurant",
          { restaurantId },
        ]);

        if (data.hasOwnProperty("media")) {
          queryClient.setQueryData(["restaurant", { restaurantId }], (old) => {
            return { ...old, image_status: data.media ? true : false };
          });
        } else {
          queryClient.setQueryData(["restaurant", { restaurantId }], (old) => {
            return { ...old, ...data };
          });
        }

        return () =>
          queryClient.setQueryData(
            ["restaurant", { restaurantId }],
            previousItems
          );
      },
    }
  );

  const setRestaurantStatus = (value) => {
    setRecentlyChanged("status");
    mutate({
      status: value,
    });
  };

  const setImage = (image) => {
    setRecentlyChanged("image");
    mutate({
      media: image,
    });
    // mutate({
    //   image_status: restaurantData.image_status,
    // });
  };

  const setRestaurantDescription = (description) => {
    setRecentlyChanged("description");
    mutate({
      description,
    });
  };

  const changeImageStatus = (value) => {
    setRecentlyChanged("imageStatus");
    if (value === "delete") {
      mutate({
        media: null,
      });
    }

    if (value === "rejected") {
      mutate({
        image_status: "pending",
      });
    }

    if (value === "approved") {
      mutate({
        image_status: "approved",
      });
    }
  };

  if (isIdle || isLoading) return <FullPageSpinner containerHeight="80vh" />;

  if (isError) throw error;

  return (
    <div className="restaurant">
      {/* name and approval dropdown */}
      <div className="restaurant__head">
        <div className="restaurant__head-name">
          <h3>{restaurantData.name}</h3>

          {restaurantData.status === "approved" ? (
            <VerifyIcon />
          ) : restaurantData.status === "pending" ? (
            <div className="approveDropdown-pending-button approveDropdown-pending-title approveTag">
              Pending
            </div>
          ) : restaurantData.status === "suspended" ? (
            <div className="approveDropdown-suspended-button approveDropdown-suspended-title approveTag">
              Suspended
            </div>
          ) : null}
        </div>

        <div className="restaurant__head-status">
          {recentlyChanged === "status" && changeIsLoading ? (
            <LoadingSpinner />
          ) : recentlyChanged === "status" && changeIsError ? (
            <ErrorButton />
          ) : null}
          <ApproveDropdown
            className="itemModal__picture-dropdown"
            status={restaurantData.status}
            setStatus={setRestaurantStatus}
          />
        </div>
      </div>
      {/* description */}
      <Card className={"restaurant__description"}>
        <RestaurantImage
          currentImageUrl={restaurantData?.image}
          setImage={setImage}
          isLoading={recentlyChanged === "image" && changeIsLoading}
          isError={recentlyChanged === "image" && changeIsError}
          className={"restaurant__description-image"}
          label={`${restaurantData.name} image`}
          error={changeError}
        />
        <EditableInput2
          isLoading={recentlyChanged === "description" && changeIsLoading}
          isError={recentlyChanged === "description" && changeIsError}
          isSuccess={recentlyChanged === "description" && changeIsSuccess}
          className={"restaurant__description-description"}
          error={changeError}
          save={setRestaurantDescription}
          placeholder="Add a Description"
          textarea
        >
          {restaurantData.description}
        </EditableInput2>
        <div className="restaurant__description-optionsButton">
          <ThreeDot fill={"#00A642"} />
        </div>
        <div className="restaurant__description-imageAction">
          {recentlyChanged === "imageStatus" && changeIsLoading ? (
            <LoadingSpinner />
          ) : recentlyChanged === "imageStatus" && changeIsError ? (
            <ErrorButton />
          ) : null}
          <ActionsDropdown
            className="restaurant__description-imageActionDropdown"
            status={
              restaurantData.image_status === "approved"
                ? "approved"
                : "pending"
            }
            setStatus={changeImageStatus}
          />
        </div>
        <div className="restaurant__description-imageStatus">
          {restaurantData.image_status === "approved" ? (
            <>
              <CircleCheck /> Image Approved
            </>
          ) : (
            "Image pending approval"
          )}
        </div>
      </Card>
      <SubNavigation
        navList={subnavigations}
        selected={tab}
        onSelect={(nav) => {
          navigate(`/restaurants/${restaurantId}`);
          setTab(nav.value);
        }}
        variant="underlined"
        className={"restaurant__subnav"}
      />
      <ErrorBoundary
        FallbackComponent={ErrorContent}
        onReset={() => {
          // reset the state of your app so the error doesn't happen again
        }}
        resetKeys={[tab]}
      >
        <Routes>
          <Route path=":menuId" element={<EditMenu />} />
          <Route
            index
            element={
              <>
                {/* menu cards */}
                {tab === "application" && (
                  <RestaurantApplication
                    status={restaurantData.status}
                    setStatus={setRestaurantStatus}
                  />
                )}
                {tab === "menu" && <MenuCards />}
                {tab === "orders" && <MenuOrders restaurantId={restaurantId} />}
                {tab === "store" && <MenuStore />}
                {tab === "documents" && <Document />}
              </>
            }
          />
        </Routes>
      </ErrorBoundary>
    </div>
  );
};

export default Restaurant;
