import apiAxios from "apis/apiAxios";
import { AddImageIcon, LoadingSpinner } from "assets/icons";
import { ErrorButton } from "components";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
// import { useClient } from "utils/apiClient";

export default function CuisineImage({ cuisine, activePage }) {
  const [imageUrl, setImageUrl] = useState(cuisine.image);

  const changeImage = (e) => {
    if (e.target.files && e.target.files[0]) {
      mutate(e.target.files[0]);
    }
  };

  const queryClient = useQueryClient();
  // const client = useClient();

  const {
    mutate,
    isLoading: isMutateLoading,
    isError: isMutateError,
    error: mutateError,
  } = useMutation(
    (data) => {
      const formData = new FormData();
      formData.append("media", data);
      // update cuisine image
      // return client(`/admin/cuisine/${cuisine.id}`, {
      //   method: "PATCH",
      //   data: formData,
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   },
      // });
      return apiAxios.patch(`/admin/cuisine/${cuisine.id}`, formData);
    },
    {
      onMutate: (data) => {
        setImageUrl(URL.createObjectURL(data));

        return () => setImageUrl(cuisine.image);
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries(["cuisines", { activePage }]);
      },
    }
  );

  return (
    <div
      className="cuisines__list-card-pic"
      role="img"
      aria-label={`${cuisine.type} cuisine`}
      title={`${cuisine.type} cuisine`}
      style={{
        backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('${imageUrl}')`,
        height: "200px",
      }}
    >
      {isMutateLoading && <LoadingSpinner className="loading" />}
      {isMutateError && (
        <div className="error">
          <ErrorButton /> {mutateError.message}
        </div>
      )}
      <div className="changeImage" role={"button"}>
        <input type="file" accept="image/*" onChange={changeImage} />
        <AddImageIcon />
      </div>
    </div>
  );
}
