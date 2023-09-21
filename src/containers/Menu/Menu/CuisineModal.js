import apiAxios from "apis/apiAxios";
import { LoadingSpinner } from "assets/icons";
import { Button, Card, ErrorButton, Input, RestaurantImage } from "components";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";

const CuisineModal = ({ closeModal }) => {
  const [type, setType] = useState("");
  const [image, setImage] = useState();

  const queryClient = useQueryClient();

  const {
    mutate,
    isLoading: isMutateLoading,
    isError: isMutateError,
    error: mutateError,
  } = useMutation(
    (data) => {
      // create cuisine
      const formData = new FormData();
      formData.append("media", image);
      console.log(formData);

      return apiAxios.post(`/admin/cuisine?cuisine-name=${type}`, formData);
    },
    {
      onSuccess: () => {
        closeModal();
        queryClient.invalidateQueries(["cuisines"]);
      },
      onMutate: () => {
        const previousItem = queryClient.getQueryData([
          "cuisines",
          { activePage: 1 },
        ]);

        queryClient.setQueryData(["cuisines", { activePage: 1 }], (old) => {
          return {
            ...old,
            cuisine: [
              {
                id: "new",
                type,
                image: URL.createObjectURL(image),
                restaurant_count: 0,
                category_count: 0,
              },
              ...old.cuisine.slice(0, -1),
            ],
          };
        });

        return () =>
          queryClient.setQueryData(
            ["cuisines", { activePage: 1 }],
            previousItem
          );
      },
    }
  );

  function handleClose(e) {
    e.preventDefault();
    closeModal();
  }

  const uploadImage = (event) => {
    event.preventDefault();
    mutate();
  };

  // const uploadImage = async (event) => {
  //   event.preventDefault();
  //   const formData = new FormData();
  //   formData.append("media", image);
  //   console.log(formData);

  //   await apiAxios.post(`/admin/cuisine?cuisine-name=${type}`, formData);
  //   closeModal();
  // };

  return (
    <Card className={"addcuisine"}>
      <div className="addcuisine__title">
        <h4>New Cuisine</h4>
      </div>

      <form>
        <div className="image">
          <RestaurantImage setImage={setImage} className="cuisineImg" />
        </div>

        <Input
          className="cuisinetype"
          placeholder="E.g Jamaican, African etc"
          label={"Type of restaurant"}
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
        {isMutateError && (
          <div className="addcuisine__error">
            <ErrorButton /> {mutateError.message}
          </div>
        )}
        <div className="buttons">
          <Button
            onClick={handleClose}
            title={"Cancel"}
            className="deleteBtn"
            disabled={isMutateLoading}
          />
          <Button
            onClick={uploadImage}
            title={isMutateError ? "Retry" : "Add Cuisine"}
            className="addBtn"
            disabled={isMutateLoading}
            iconRight={isMutateLoading ? <LoadingSpinner /> : null}
          />
        </div>
      </form>
    </Card>
  );
};

export default CuisineModal;
