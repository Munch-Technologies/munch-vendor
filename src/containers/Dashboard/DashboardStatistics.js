import React from "react";
import { Card } from "components";
import {
  customerImage,
  menuImage,
  restaurantImage,
  riderImage,
} from "assets/images";


const DashboardStatistics = ({ restaurantData }) => {
  const {
    total_number,
    total_number_of_customers,
    total_number_of_menu,
    total_number_of_riders,
  } = restaurantData;

  const statistics = [
    {
      id: 1,
      image: restaurantImage,
      title: "Total No of Restaurants",
      total: total_number,
      color: "green-gradient",
    },
    {
      id: 2,
      image: customerImage,
      title: "Total No of Customers",
      total: total_number_of_customers,
      color: "green-gradient",
    },
    {
      id: 3,
      image: riderImage,
      title: "Total No of Riders",
      total: total_number_of_riders,
      color: "cream-gradient",
    },
    {
      id: 4,
      image: menuImage,
      title: "Menu",
      total: total_number_of_menu,
      color: "cream-gradient",
    },
  ];

  return (
    <div className="statistics">
      <h2 className="statistics__title">Restaurant Statistics</h2>
      <div className="statistics__cards">
        {statistics.map((stat) => (
          <Card key={stat.id} className={"statistics__cards-card"}>
            <div
              className={`statistics__cards-card-image statistics__cards-card-image-${stat.color}`}
            >
              <img src={stat.image} alt={stat.title} />
            </div>
            <h3 className="statistics__cards-card-title">{stat.title}</h3>
            <h2 className="statistics__cards-card-total">{stat.total}</h2>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardStatistics;
