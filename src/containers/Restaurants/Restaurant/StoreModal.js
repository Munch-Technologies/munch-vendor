import { LoadingSpinner } from "assets/icons";
import { Button, Card, ErrorButton, Input } from "components";
import React from "react";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { useClient } from "utils/apiClient";

const StoreModal = ({ closeAddstore, onSuccess }) => {
  const [manager, setManager] = useState("");
  const [address, setAddress] = useState("");
  // const [name, setName] = useState("Water store");

  const close = () => {
    closeAddstore();
    setManager("");
    setAddress("");
  };

  function onChangeManager(e) {
    setManager(e.target.value);
  }
  function onChangeAddress(e) {
    setAddress(e.target.value);
  }
  const { restaurantId } = useParams();
  const client = useClient();
  const queryClient = useQueryClient();

  const { mutate, isLoading, isError, error } = useMutation(
    (data) => {
      return client(`/admin/restaurant/${restaurantId}/stores`, { data });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["menuStores"]);
        onSuccess();
        close();
      },
    }
  );

  const uploadHandler = (event) => {
    event.preventDefault();

    const userData = {
      address,
      name: "water store",
      manager,
      location: {
        coordinates: [12, 2.3],
      },
    };
    mutate(userData);
  };

  return (
    <Card className="restaurantapplication__modal">
      <div className="restaurantapplication__modal-header">Add New Store</div>
      <Input
        label={"Location"}
        type="text"
        placeholder="45, Example street, City, State"
        style={{ marginBottom: "3rem" }}
        value={address}
        onChange={onChangeAddress}
        disabled={isLoading}
      />
      <Input
        label={"Store Manager"}
        type="text"
        placeholder="Manager Name"
        value={manager}
        onChange={onChangeManager}
        disabled={isLoading}
      />

      {isError && (
        <div className="restaurantapplication__modal-error">
          <ErrorButton /> {error.message}
        </div>
      )}
      <div className="restaurantapplication__modal-footer">
        <Button
          className={"cancel"}
          titleClass={"dont-text"}
          onClick={close}
          title="Close"
          disabled={isLoading}
        />{" "}
        <Button
          className={"approve"}
          titleClass={"approve-text"}
          onClick={uploadHandler}
          title="Add"
          disabled={isLoading}
          iconRight={isLoading ? <LoadingSpinner /> : null}
        />
      </div>
    </Card>
  );
};

export default StoreModal;
