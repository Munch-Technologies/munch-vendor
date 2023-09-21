import { Pleased, PlusIcon } from "assets/icons";
import { Button, Card, FullPageSpinner } from "components";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { useClient } from "utils/apiClient";
import { capitalizeFirstLetter } from "utils/capitalize";
import formatAMPM from "utils/formatAMPM";

const CreatePromotions = () => {
  const client = useClient();

  const { data, isIdle, isLoading, isError, error } = useQuery(
    ["discounts"],
    () => {
      return client("admin/promotions/discount");
    }
  );

  // const date = new Date().toLocaleDateString("en-us", {
  //   year: "numeric",
  //   month: "short",
  //   day: "numeric",
  // });
  // const time = formatAMPM(new Date(`${currentDate}T${currentTime}`));

  if (isError) throw error;

  return (
    <div className="promotions__create">
      <h1 className="title">Create Offer</h1>
      <div className="bodytext">
        Create a marketing campaign draw in customers and grow your business
      </div>
      <Link to={"/promotions/create/view"}>
        <div className={"create-button"}>
          <Button
            className={"button"}
            titleClass="create-button-text"
            title="Create New Offer"
            iconLeft={<PlusIcon />}
          />
        </div>
      </Link>

      <div>
        <h4>Existing Offers</h4>
        <Card>
          {isIdle || isLoading ? (
            <FullPageSpinner containerHeight="20rem" />
          ) : data?.length ? (
            <table>
              <thead>
                <tr>
                  <th className="infotext">Restaurant Name</th>
                  <th className="infotext">Menu Item</th>
                  <th className="infotext">Discount</th>
                  <th className="infotext">Target Audience</th>
                  <th className="infotext">Start Date</th>
                  <th className="infotext">End Date</th>
                  <th className="infotext">End Time</th>
                </tr>
              </thead>
              <tbody>
                {data.map((discount) => {
                  return (
                    <tr key={discount.id}>
                      <td>
                        <div className="subtext">
                          {discount.restaurant.name}
                        </div>
                      </td>
                      <td>
                        {discount.restaurant.isAllMenuItems ? (
                          <div className="subtext">All menu items</div>
                        ) : (
                          <div className="subtext">
                            {typeof discount.restaurant.menuItems === "string"
                              ? capitalizeFirstLetter(
                                  discount.restaurant.menuItems
                                )
                              : discount.restaurant.menuItems?.length > 2
                              ? `${discount.restaurant.menuItems[0].name}, ${
                                  discount.restaurant.menuItems[1].name
                                } +${
                                  discount.restaurant.menuItems.length - 2
                                } more`
                              : `${discount.restaurant.menuItems[0].name}, ${discount.restaurant.menuItems[1].name}`}
                          </div>
                        )}
                      </td>
                      <td>
                        {discount.type === "percentage" ? (
                          <div className="subtext">{discount.value}%</div>
                        ) : (
                          <div className="subtext">&#163;{discount.value}</div>
                        )}
                      </td>
                      <td>
                        <div className="subtext">{discount.audience}</div>
                      </td>
                      <td>
                        <div className="subtext">
                          {new Date(discount.start_date).toLocaleDateString(
                            "en-us",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="subtext">
                          {new Date(discount.end_date).toLocaleDateString(
                            "en-us",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="subtext">
                          {formatAMPM(
                            new Date(
                              `${discount.end_date}T${discount.end_time}`
                            )
                          )}
                        </div>
                      </td>
                      <td>
                        <Link to={`/promotions/create/${discount.id}`}>
                          <div className="subtext button">View</div>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="empty">
              <div className="img">
                <Pleased />
              </div>
              <div className="bodytext">
                You Haven’t Created Any Offer Yet. Start Creating Offer to
                Entice Customers and Grow your Sales
              </div>
              <Link to={"/promotions/create/view"}>
                <div className={"create-button"}>
                  <Button
                    className={"button"}
                    titleClass="create-button-text"
                    title="Create New Offer"
                    iconLeft={<PlusIcon />}
                  />
                </div>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default CreatePromotions;
