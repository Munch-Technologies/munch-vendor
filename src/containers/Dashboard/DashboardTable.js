import React from "react";
import { Card } from "components";
import { useNavigate } from "react-router-dom";

const DashboardTable = ({ topRestaurants }) => {
  const navigate = useNavigate();

  return (
    <div className="table">
      <h4 className="table__title">Top Performing Restaurants</h4>
      <Card>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Amount of Order</th>
              <th>Total Revenue</th>
            </tr>
          </thead>
          <tbody>
            {topRestaurants.map((performance) => {
              return (
                <tr
                  key={performance.id}
                  className="dashboard__restaurantTable__row"
                >
                  <td
                    className="first data"
                    onClick={() => navigate(`/restaurants/${performance.id}`)}
                  >
                    <img
                      src={performance.image}
                      alt={performance.name}
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "8px",
                      }}
                    />
                    {performance.name}
                  </td>
                  <td className=" data">{performance.completed_order_count}</td>
                  <td className=" data">&#163;{performance.total_revenue}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default DashboardTable;
