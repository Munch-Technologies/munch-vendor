import { LocationIcon } from "assets/icons";
import { Button, Image } from "components";
import React from "react";
import { useNavigate } from "react-router-dom";

const CustomerRow = ({ list }) => {
  const navigate = useNavigate();
  console.log(list);
  return (
    <>
      <tr key={list.id} className="row">
        <td className="customer">
          {/* <img src={list.restaurantImage} alt="" /> */}
          <Image src={list.avatar} alt={`rider ${list.firstname}`} />
          <div>
            <div className="bodytext">{`${list.firstname} ${list.lastname}`}</div>
            <div className="infotext">{list.customer_type}</div>
          </div>
        </td>
        <td>
          <div className="infotext">{list.email}</div>
        </td>
        <td>
          <div className="address">
            <div>
              <LocationIcon />
            </div>
            <div className="location">{list.address || "Ibadan road"}</div>
          </div>
        </td>
        <td>
          <div className="infotext">{list.total_order}</div>
        </td>
        <td className="top">
          <Image src={list.top_order_image} alt={`rider ${list.firstname}`} />
          <div className="subtext">{list.top_order || "Ramen noodles"}</div>
        </td>
        <td>
          <Button
            title={"View"}
            onClick={() => navigate(`/customers/${list.id}`)}
          />
        </td>
      </tr>
    </>
  );
};

export default CustomerRow;
