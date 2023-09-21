import {
  Card,
  CustomerFilterDropdown,
  FallbackResultCard,
  FullPageSpinner,
  NumberDropdown,
  Pagination2,
  SearchInput,
} from "components";
import React, { useState } from "react";
// import data from "assets/dummyData/orderData";
import CustomerRow from "./CustomerRow";
import { Pleased, RestaurantIcon } from "assets/icons";
import { useClient } from "utils/apiClient";
import { useQuery } from "react-query";
import { useCustomerFilterDropdown } from "utils/hooks";

const CustomersTable = () => {
  const client = useClient();
  const [entries, setEntries] = useState(5);

  const changeEntries = (newEntries) => setEntries(newEntries);

  const [activePage, setActivePage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const {
    selectedFilter,
    filters,
    onSelect: onFilterChange,
  } = useCustomerFilterDropdown();

  console.log(searchQuery);

  const {
    isIdle,
    isLoading,

    data: customersData,
  } = useQuery(
    [
      "customers",
      {
        entries,
        activePage,
        searchQuery,
        filterKey: selectedFilter?.value.key,
        filter: selectedFilter?.value.filter,
      },
    ],
    () =>
      selectedFilter
        ? client(
            `/admin/customers?page=${activePage}&per-page=${entries}&search-term=${encodeURIComponent(
              searchQuery
            )}&filter-key=${selectedFilter?.value.key}&filter=${
              selectedFilter?.value.filter
            }`
          )
        : client(`/admin/customer?page=${activePage}&per-page=${entries}`)
  );
  
  return (
    <div className="customers__table">
      <div className="menuItems__search">
        {/* customer search and filter */}
        <div className="menuItems__search-entries">
          Show{" "}
          <NumberDropdown
            list={[5, 10, 15, 20]}
            value={entries}
            onSelect={changeEntries}
            min={5}
            max={20}
            className="menuItems__search-entries-input"
          />{" "}
          entries
        </div>

        <CustomerFilterDropdown
          list={filters}
          value={selectedFilter?.text}
          onSelect={onFilterChange}
        />
        <SearchInput
          value={searchQuery}
          onChange={(value) => setSearchQuery(value)}
        />
        {/* --- */}
      </div>

      <div className="customers__table-title">
        <h3>Customers</h3>
      </div>

      <div className="table">
        {isLoading || isIdle ? (
          <Card style={{ margin: "4rem 0" }}>
            <FullPageSpinner containerHeight="35rem" />
          </Card>
        ) : customersData && customersData?.customer ? (
          <Card>
            <table>
              <thead>
                <tr>
                  <th>Customer’s Name</th>
                  <th>Email</th>
                  <th>Location</th>
                  <th>Total Orders</th>
                  <th>Top Order</th>
                </tr>
              </thead>

              <tbody>
                {customersData?.customer.length === 0 ? (
                  <FallbackResultCard>
                    <Pleased />
                    <p> Consumers Information Will Appear on This Table</p>
                  </FallbackResultCard>
                ) : (
                  customersData?.customer?.map((list) => {
                    return <CustomerRow key={list.id} list={list} />;
                  })
                )}
              </tbody>
            </table>
          </Card>
        ) : (
          <FallbackResultCard>
            <RestaurantIcon />
            <p>{`No result found`}</p>
          </FallbackResultCard>
        )}
      </div>

      {customersData?.customer && (
        <Pagination2
          pages={customersData.meta.page_count + 1}
          activePage={activePage}
          onPageChange={(newActivePage) => setActivePage(newActivePage)}
        />
      )}
    </div>
  );
};

export default CustomersTable;
