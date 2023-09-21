import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  FallbackResultCard,
  FilterDropdown,
  FullPageSpinner,
  Pagination2,
  SearchInput,
  StatusPill,
} from "../../components";
import { LocationIcon, RestaurantIcon } from "../../assets/icons";
import RatingStar from "../../components/Rating/RatingStar";
import { useQuery } from "react-query";
import { useClient } from "utils/apiClient";
import { truncate } from "utils/truncate";
import { useFilterDropdown } from "utils/hooks";
import { capitalizeFirstLetter } from "utils/capitalize";

const RestaurantTable = () => {
  const client = useClient();

  const navigate = useNavigate();
  const [activePage, setActivePage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const {
    selectedFilter,
    filters,
    onSelect: onFilterChange,
  } = useFilterDropdown();

  const {
    isIdle,
    isLoading,
    isError,
    error,
    data: restaurantsData,
  } = useQuery(
    [
      "restaurants",
      {
        activePage,
        searchQuery,
        filterKey: selectedFilter?.value.key,
        filter: selectedFilter?.value.filter,
      },
    ],
    () =>
      selectedFilter
        ? client(
            `/admin/restaurant?page=${activePage}&per-page=10&search-term=${encodeURIComponent(
              searchQuery
            )}&filter-key=${selectedFilter?.value.key}&filter=${
              selectedFilter?.value.filter
            }`
          )
        : client(`/admin/restaurant?page=${activePage}&per-page=10`)
  );

  if (isError) throw error;
  return (
    <>
      <div className="restaurantsTableTop">
        {/*restaurant search and filter */}
        <div className="search">
          <h4 className="search__title">Restaurant</h4>
          <SearchInput
            value={searchQuery}
            onChange={(value) => setSearchQuery(value)}
          />
        </div>
        {/* <FilterInput /> */}
        <FilterDropdown
          list={filters}
          value={selectedFilter?.text}
          onSelect={onFilterChange}
        />
      </div>
      <div className="table">
        {isLoading || isIdle ? (
          <Card style={{ margin: "4rem 0" }}>
            <FullPageSpinner containerHeight="35rem" />
          </Card>
        ) : restaurantsData.restaurant ? (
          <Card>
            <table>
              <thead>
                <tr>
                  <th>Restaurant Name</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Rating</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {restaurantsData.restaurant.map((performance) => {
                  return (
                    <tr key={performance.id} className="table__item">
                      <td className=" data first">
                        <div
                          className="table__item-pic"
                          role="img"
                          aria-label={performance.name}
                          title={performance.name}
                          style={{
                            backgroundImage: `url(${performance.image})`,
                          }}
                        ></div>
                        {performance.name}
                      </td>
                      <td className="infotext data table__item-email">
                        {performance.email ?? "unknown@gmail.com"}
                      </td>
                      <td className=" data table__item-address">
                        <div>
                          <div>
                            <LocationIcon />
                          </div>
                          <span>
                            {truncate(performance.address.address, 25)}
                          </span>
                        </div>
                      </td>
                      <td className=" data table__item-rating">
                        <span>
                          <RatingStar star={performance.ratings} />
                        </span>
                        {performance.number_of_ratings}
                      </td>
                      <td className="data">
                        <StatusPill
                          value={capitalizeFirstLetter(
                            performance.status || ""
                          )}
                        />
                      </td>
                      <td>
                        <Button
                          onClick={() =>
                            navigate(`/restaurants/${performance.id}`)
                          }
                          className={"data"}
                          title={"View"}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        ) : (
          <FallbackResultCard>
            <RestaurantIcon />
            <p>
              {`No result found for: ${
                searchQuery && `searchKey = ${searchQuery}`
              } ${
                selectedFilter &&
                `filter = ${selectedFilter?.value.key}-${selectedFilter?.value.filter}`
              }`}
            </p>
          </FallbackResultCard>
        )}
      </div>

      {restaurantsData?.restaurant && (
        <Pagination2
          pages={restaurantsData.meta.page_count + 1}
          activePage={activePage}
          onPageChange={(newActivePage) => setActivePage(newActivePage)}
        />
      )}
    </>
  );
};

export default RestaurantTable;
