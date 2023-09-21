// import { ImagePlaceholder } from "assets/icons";
import { AddImageIcon, CameraIcon, LoadingSpinner } from "assets/icons";
import Button from "components/Button/Button";
import ErrorButton from "components/ErrorButton";
import React, { useState } from "react";

export default function RestaurantImage({
  currentImageUrl,
  image,
  setImage,
  className,
  isError,
  isLoading,
  error,
  label,
  width,
  height,
  ...props
}) {
  const [imageUrl, setImageUrl] = useState(currentImageUrl);

  // console.log("imageUrl", imageUrl);
  const changeImage = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageUrl(URL.createObjectURL(e.target.files[0]));
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className={`restaurantimage ${className}`} {...props}>
      {imageUrl ? (
        <div
          className="restaurantimage-pic"
          role="img"
          aria-label={label}
          title={label}
          style={{
            backgroundImage: `url("${imageUrl ?? currentImageUrl}")`,
          }}
        >
          <label className="restaurantimage-pic-button" role={"button"}>
            <AddImageIcon />
            <input type="file" accept="image/*" onChange={changeImage} />
          </label>
        </div>
      ) : (
        <div className="restaurantimage-placeholder">
          <CameraIcon />
          <div className="subtext">No Photo</div>
          <p>size; min 1200 by 800pixels (.jpg .Png-18MB)</p>
          <label className="restaurantimage-placeholder-button">
            <Button
              title="Change Photo"
              titleClass={"restaurantimage__button-changetext"}
              className="restaurantimage__button-change"
            />
            <input type="file" accept="image/*" onChange={changeImage} />
          </label>
        </div>
      )}
      <div className="restaurantimage-statusIcon">
        {isError && <ErrorButton />}
        {isLoading && <LoadingSpinner />}
      </div>
      {isError && (
        <p className="restaurantimage-error">
          {error?.message ?? "Error uploading image"}
        </p>
      )}
    </div>
  );
}
