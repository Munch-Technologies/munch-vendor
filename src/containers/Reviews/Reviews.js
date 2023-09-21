import { ErrorContent } from "components";
import SubNavigation from "components/SubNavigation";
import React, { useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import MenuitemReviewTable from "./MenuitemReviewTable";
import RestaurantReviewTable from "./RestaurantReviewTable";
import RiderReviewTable from "./RiderReviewTable";

const Reviews = () => {
  const [tab, setTab] = useState("restaurants");
  return (
    <div>
      {/* tab navigation */}
      <SubNavigation
        variant="underlined"
        navList={["restaurants", "riders", "menu items"]}
        selected={tab}
        onSelect={(option) => setTab(option)}
        className="revenue__tab"
      />

      <ErrorBoundary
        FallbackComponent={ErrorContent}
        onReset={() => {
          // reset the state of your app so the error doesn't happen again
        }}
        resetKeys={[tab]}
      >
        {(() => {
          switch (tab) {
            case "restaurants":
              return <RestaurantReviewTable />;
            case "riders":
              return <RiderReviewTable />;
            case "menu items":
              return <MenuitemReviewTable />;
            default:
              return null;
          }
        })()}
      </ErrorBoundary>
    </div>
  );
};

export default Reviews;
