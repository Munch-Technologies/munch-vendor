import { RestaurantIcon } from "assets/icons";
import {
  ErrorContent,
  FallbackResultCard,
  FilterDropdown,
  FullPageSpinner,
  NumberDropdown,
  Pagination2,
  SearchInput,
} from "components";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { useClient } from "utils/apiClient";
import { useFilterDropdown } from "utils/hooks";
import MenuItemsList from "./MenuItemsList";

export default function MenuItems() {
  const client = useClient();
  const [entries, setEntries] = useState(10);
  const [activePage, setActivePage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const {
    selectedFilter,
    filters,
    onSelect: onFilterChange,
  } = useFilterDropdown();

  const { isIdle, isLoading, isError, error, data, refetch } = useQuery(
    [
      "menuItems",
      {
        entries,
        activePage,
        searchQuery,
        filterKey: selectedFilter?.value.key,
        filter: selectedFilter?.value.filter,
      },
    ],
    () =>
      selectedFilter || searchQuery
        ? client(
            `/admin/menu?page=${activePage}&per-page=${entries}${
              searchQuery
                ? `&search-term=${encodeURIComponent(searchQuery)}`
                : ""
            }${
              selectedFilter
                ? `&filter-key=${selectedFilter?.value.key}&filter=${selectedFilter?.value.filter}`
                : ""
            }`
          )
        : client(`/admin/menu?page=${activePage}&per-page=${entries}`)
  );

  const changeEntries = (newEntries) => setEntries(newEntries);

  return (
    <div className="menuItems">
      <h3 className="title">Menu Items</h3>

      <div className="menuItems__search">
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
        <FilterDropdown
          list={filters}
          value={selectedFilter?.text}
          onSelect={onFilterChange}
        />
        <SearchInput
          value={searchQuery}
          onChange={(value) => setSearchQuery(value)}
        />
      </div>

      <div className="card menuItems__list">
        {isError ? (
          <ErrorContent
            title="Error loading Menu Items!"
            retry={refetch}
            error={error}
          />
        ) : isLoading || isIdle ? (
          <FullPageSpinner containerHeight="20rem" />
        ) : data.menu_item ? (
          <>
            <MenuItemsList
              list={data.menu_item}
              params={{
                entries,
                activePage,
                searchQuery,
                filterKey: selectedFilter?.value.key,
                filter: selectedFilter?.value.filter,
              }}
            />
          </>
        ) : (
          <FallbackResultCard>
            <RestaurantIcon />
            <p>{`No result found for ${searchQuery ? searchQuery : ""} ${
              !selectedFilter
                ? ""
                : searchQuery
                ? `"${searchQuery}" and Status: ${selectedFilter.text}`
                : `Status: ${selectedFilter.value.filter}`
            }`}</p>
          </FallbackResultCard>
        )}
        {data?.menu_item && (
          <Pagination2
            pages={data.meta.page_count + 1}
            activePage={activePage}
            onPageChange={(newActivePage) => setActivePage(newActivePage)}
          />
        )}
      </div>
    </div>
  );
}
