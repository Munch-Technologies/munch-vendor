import { DownloadIcon, PlusIcon, RestaurantIcon } from "assets/icons";
import {
  Button,
  ErrorContent,
  FallbackResultCard,
  FullPageSpinner,
  Pagination2,
} from "components";
import React, { useState } from "react";
import CuisineModal from "./CuisineModal";
import { useClient } from "utils/apiClient";
import { useQuery } from "react-query";
import { useModal } from "utils/hooks";
import CuisineImage from "./CuisineImage";

export default function RestaurantCuisines() {
  const { CustomModal, revealModal, closeModal } = useModal();
  const [activePage, setActivePage] = useState(1);

  const client = useClient();

  const { isIdle, isLoading, isError, error, data, refetch } = useQuery(
    ["cuisines", { activePage }],
    () => client(`/admin/cuisine?page=${activePage}&per-page=12`)
  );

  return (
    <>
      <CustomModal>
        <CuisineModal
          closeModal={() => {
            setActivePage(1);
            closeModal();
            refetch();
          }}
        />
      </CustomModal>
      <div className="cuisines">
        <div className="cuisines__header">
          <h3 className="cuisines__header-title">Restaurant Cuisines</h3>
          <Button
            className={"cuisines__header-button"}
            titleClass="cuisines__header-button-text"
            title="New Cuisine Type"
            iconLeft={<PlusIcon />}
            onClick={revealModal}
          />
        </div>
        {isError ? (
          <ErrorContent
            title="Error loading Restaurant application data!"
            retry={refetch}
            error={error}
          />
        ) : isLoading || isIdle ? (
          <FullPageSpinner containerHeight="20rem" />
        ) : data.cuisine?.length > 0 ? (
          <div className="cuisines__list">
            {data.cuisine.map((cuisine) => (
              <div className="card cuisines__list-card" key={cuisine.id}>
                <CuisineImage cuisine={cuisine} activePage={activePage} />
                <table className="cuisines__list-card-info">
                  <tbody>
                    <tr>
                      <th>Type of Restaurant</th>
                      <td>{cuisine.type}</td>
                    </tr>
                    <tr>
                      <th>No of Restaurant:</th>
                      <td>{cuisine.restaurant_count}</td>
                    </tr>
                    <tr>
                      <th>No of Categories:</th>
                      <td>{cuisine.category_count}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        ) : (
          <FallbackResultCard>
            <RestaurantIcon />
            <p>
              No cuisines found. Click 'New Cuisine Type' to create new cuisine.
            </p>
          </FallbackResultCard>
        )}
        {data?.cuisine && (
          <Pagination2
            pages={data.meta.page_count + 1}
            activePage={activePage}
            onPageChange={(newActivePage) => setActivePage(newActivePage)}
          />
        )}

        {data?.meta.total && (
          <Button
            className={"download-button"}
            titleClass="download-button-text"
            title={"Download Report"}
            iconLeft={<DownloadIcon />}
          />
        )}
      </div>
    </>
  );
}
