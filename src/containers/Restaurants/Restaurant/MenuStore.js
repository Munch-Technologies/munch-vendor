import {
  LoadingSpinner,
  LocationIcon,
  PlusIcon,
  RestaurantIcon,
} from "assets/icons";
import {
  Button,
  Card,
  ErrorButton,
  ErrorContent,
  FallbackResultCard,
  FullPageSpinner,
  SelectableTagList,
  Pagination2,
} from "components";
import React, { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useClient } from "utils/apiClient";
import { useModal } from "utils/hooks";
import StoreModal from "./StoreModal";
import produce from "immer";
import Front1 from "assets/icons/MunchMascots/Front1";

const deactivationReasons = [
  "Not bringing in earnings",
  "Slow sales",
  "Low order acceptance rate",
  "Bad reviews ",
];

const MenuStore = () => {
  const {
    CustomModal: AddStoreModal,
    revealModal: revealAddstore,
    closeModal: closeAddstore,
  } = useModal();
  const {
    CustomModal: DeactivateStoreModal,
    revealModal: revealDeactivateStore,
    closeModal: closeDeactivateStore,
  } = useModal();
  const {
    CustomModal: ActivateStoreModal,
    revealModal: revealActivateStore,
    closeModal: closeActivateStore,
  } = useModal();
  const client = useClient();
  const { restaurantId } = useParams();

  const [activePage, setActivePage] = useState(1);
  const [selectedDeactivationReasons, setSelectedDeactivationReasons] =
    useState([]);

  const {
    isIdle,
    isLoading,
    isError,
    error,
    data: menuStores,
    refetch,
  } = useQuery(["menuStores", { restaurantId, activePage }], () =>
    client(
      `/admin/restaurant/${restaurantId}/stores?page=${activePage}&per-page=10`
    )
  );
  const change = useRef({});

  const queryClient = useQueryClient();

  const {
    mutate,
    isLoading: isMutationLoading,
    isError: isMutationError,
    error: mutationError,
  } = useMutation(
    (data) => {
      if (change.current.action === "activate") {
        // activate store
        return client(
          `/admin/restaurant/${restaurantId}/stores/${data.id}/action?action=activate`,
          {
            method: "POST",
          }
        );

        // return new Promise((resolve, reject) => {
        //   setTimeout(() => {
        //     resolve();
        //     // reject({ message: "intentional error" });
        //   }, 500);
        // });
      } else {
        // Deactivate store
        return client(
          `/admin/restaurant/${restaurantId}/stores/${data.id}/action?action=deactivate`,
          {
            data: selectedDeactivationReasons,
            method: "POST",
          }
        );
        // return new Promise((resolve, reject) => {
        //   setTimeout(() => {
        //     resolve();
        //     // reject({ message: "intentional error" });
        //   }, 500);
        // });
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["menuStores", { restaurantId }]);

        if (change.current.action === "activate") {
          closeActivationModal();
        } else {
          closeDeactivationModal();
        }
        change.current = {};
      },
    }
  );

  const deactivateStore = (id) => {
    change.current = {
      id,
      action: "deactivate",
    };
    revealDeactivateStore();
  };

  const closeDeactivationModal = () => {
    closeDeactivateStore();
    setSelectedDeactivationReasons([]);
    change.current = {};
  };

  const closeActivationModal = () => {
    closeActivateStore();
    change.current = {};
  };

  const activateStore = (id) => {
    change.current = {
      id,
      action: "activate",
    };
    revealActivateStore();
  };

  if (isError) {
    return (
      <ErrorContent
        title="Error loading Restaurant menu data!"
        retry={refetch}
        error={error}
      />
    );
  }

  if (isLoading || isIdle) {
    return (
      <Card style={{ margin: "4rem 0" }}>
        <FullPageSpinner containerHeight="20rem" />
      </Card>
    );
  }
  return (
    <>
      <AddStoreModal>
        <StoreModal
          closeAddstore={closeAddstore}
          onSuccess={() => setActivePage(1)}
        />
      </AddStoreModal>
      <DeactivateStoreModal>
        <Card className="restaurantDeactivation__modal">
          <div className="restaurantDeactivation__modal-header">
            Deactivate Store
          </div>
          <p className="restaurantDeactivation__modal-description">
            Why do you want to deactivate this store?
          </p>
          <SelectableTagList
            tags={deactivationReasons}
            selected={selectedDeactivationReasons}
            onClick={(tag) => {
              setSelectedDeactivationReasons((reasons) =>
                produce(reasons, (draft) => {
                  if (draft.includes(tag)) {
                    draft.splice(draft.indexOf(tag), 1);
                  } else {
                    draft.push(tag);
                  }
                })
              );
            }}
            className="restaurantDeactivation__modal-tags"
          />

          <div className="restaurantDeactivation__modal-footer">
            <Button
              onClick={closeDeactivationModal}
              title="Cancel"
              className={"cancel"}
              disabled={
                isMutationLoading && change.current.action === "deactivate"
              }
            />{" "}
            <Button
              className={"approve"}
              titleClass={"approve-text"}
              onClick={() => mutate({ id: change.current.id })}
              title={isMutationLoading ? <LoadingSpinner /> : "Deactivate"}
              disabled={
                selectedDeactivationReasons.length === 0 || isMutationLoading
              }
            />
          </div>
        </Card>
      </DeactivateStoreModal>
      <ActivateStoreModal>
        <Card className="restaurantActivation__modal">
          <div className="restaurantActivation__modal-header">
            Activate Store
          </div>
          <div className="restaurantActivation__modal-description">
            <p>
              {(function () {
                let store = menuStores?.restaurant_store?.find(
                  (store) => store.id === change.current.id
                );

                if (store?.deactivation_reason) {
                  return `This Store was deactivated because of ${store.deactivation_reason.reduce(
                    (acc, curr, index, arr) => {
                      if (index === arr.length - 1) {
                        return `${acc} and ${curr}`;
                      } else {
                        return `${acc}, ${curr}`;
                      }
                    }
                  )}. Are you sure you want to activate it?`;
                } else {
                  return "Are you sure you want to activate this store?";
                }
              })()}
            </p>
            <Front1 />
          </div>

          {isMutationError && change.current.action === "activate" && (
            <div className="restaurantActivation__modal-error">
              <ErrorButton /> {mutationError.message}
            </div>
          )}
          <div className="restaurantActivation__modal-footer">
            <Button
              onClick={closeActivationModal}
              title="Cancel"
              className={"cancel"}
              disabled={
                isMutationLoading && change.current.action === "activate"
              }
            />{" "}
            <Button
              className={"approve"}
              titleClass={"approve-text"}
              onClick={() => mutate({ id: change.current.id })}
              title={
                isMutationLoading && change.current.action === "activate" ? (
                  <LoadingSpinner />
                ) : (
                  "Activate"
                )
              }
              disabled={
                isMutationLoading && change.current.action === "activate"
              }
            />
          </div>
        </Card>
      </ActivateStoreModal>
      <div className="table">
        <div className="addstore">
          <Button
            className={"addstore-btn"}
            iconLeft={<PlusIcon />}
            title={"Add new store"}
            titleClass={"addstoretext"}
            onClick={revealAddstore}
          />
        </div>
        {menuStores?.restaurant_store ? (
          <Card className={"addstore-card"}>
            <table>
              <thead>
                <tr>
                  <th className="textxm">Location</th>
                  <th className="textxm">Manager</th>
                  <th className="textxm">Revenue Generated (Per week)</th>
                  <th className="textxm">Action</th>
                </tr>
              </thead>
              <tbody>
                {menuStores.restaurant_store.map((data, index) => {
                  return (
                    <tr key={data.id} className="table__data">
                      <td className="subtext table__data-text">
                        <span className="locationIcon">
                          <LocationIcon />
                        </span>
                        <span> {data.address} </span>
                      </td>
                      <td className="subtext table__data-manager">
                        {data.manager}
                      </td>
                      <td className="subtext table__data-text">
                        &#163;{data.revenue}
                      </td>
                      <td className="subtext table__data-button">
                        {data.is_active ? (
                          <Button
                            title={"Deactivate"}
                            titleClass={"deactivetext"}
                            className={"deactivate"}
                            onClick={() => deactivateStore(data.id)}
                          />
                        ) : (
                          <Button
                            title={"Activate"}
                            titleClass={"activetext"}
                            className={"activate"}
                            onClick={() => activateStore(data.id)}
                          />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {menuStores?.restaurant_store && (
              <Pagination2
                pages={menuStores.meta.page_count + 1}
                activePage={activePage}
                onPageChange={(newActivePage) => setActivePage(newActivePage)}
              />
            )}
          </Card>
        ) : (
          <FallbackResultCard>
            <RestaurantIcon />
            <p>
              All your restaurant site will appear here if you have more than
              one store
            </p>
          </FallbackResultCard>
        )}
      </div>
    </>
  );
};

export default MenuStore;
