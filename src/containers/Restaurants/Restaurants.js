import React from "react";
import { DownloadIcon } from "assets/icons";
import { Button } from "components";
import { RestaurantMetric, RestaurantTable } from "./index";

const Restaurants = () => {
  return (
    <>
      <RestaurantMetric />

      <RestaurantTable />

      <Button
        className={"download-button"}
        titleClass="download-button-text"
        title={"Download Report"}
        iconLeft={<DownloadIcon />}
      />
    </>
  );
};

export default Restaurants;
