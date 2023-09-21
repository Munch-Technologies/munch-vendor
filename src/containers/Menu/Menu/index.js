import React from "react";
import { Card, ErrorContent, FullPageSpinner } from "components";
import { Link } from "react-router-dom";
import { AngleBracketRight } from "assets/icons";
import RestaurantCuisines from "./RestaurantCuisines";
import { categoriesImage, menuImage, promotionsImage } from "assets/images";
import { useQuery } from "react-query";
import { useClient } from "utils/apiClient";

export default function Menu() {
  const client = useClient();

  const {
    isIdle,
    isLoading,
    isError,
    data: menuMetrics,
    error,
    refetch,
  } = useQuery(["menuMetrics"], () => client(`/admin/menu/metric`));

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

  return (
    <div className="menu">
      <h2 className="menu__title">All Menu Category</h2>
      <div className="statistics">
        <h3 className="statistics__title">Restaurant Statistics</h3>
        <div className="statistics__cards">
          <Card className={"statistics__cards-card"}>
            <Link to="menuitems" className="statistics__cards-card-topLink">
              See all{" "}
              <AngleBracketRight className="statistics__cards-card-topLink-icon" />
            </Link>
            <div
              className={`statistics__cards-card-image statistics__cards-card-image-cream-gradient`}
            >
              <img src={menuImage} alt="menu items" />
            </div>
            <h3 className="statistics__cards-card-title">Menu Items</h3>
            <h2 className="statistics__cards-card-total">
              {menuMetrics.menu_items}
            </h2>
          </Card>
          <Card className={"statistics__cards-card"}>
            <div
              className={`statistics__cards-card-image statistics__cards-card-image-cream-gradient`}
            >
              <img src={categoriesImage} alt="categories" />
            </div>
            <h3 className="statistics__cards-card-title">Categories</h3>
            <h2 className="statistics__cards-card-total">
              {menuMetrics.categories_count}
            </h2>
          </Card>
          <Card className={"statistics__cards-card"}>
            <div
              className={`statistics__cards-card-image statistics__cards-card-image-cream-gradient`}
            >
              <img src={promotionsImage} alt="promotions" />
            </div>
            <h3 className="statistics__cards-card-title">Promotions</h3>
            <h2 className="statistics__cards-card-total">
              {menuMetrics.promotions}
            </h2>
          </Card>
        </div>
      </div>

      <RestaurantCuisines />
    </div>
  );
}
