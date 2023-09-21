import { ImagePlaceholder } from "assets/icons";
import Button from "components/Button/Button";
import React, { useState } from "react";

export default function ImageInput({
  label,
  currentImageUrl,
  image,
  setImage,
  className,
  disabled = false,
  ...props
}) {
  const [imageUrl, setImageUrl] = useState(currentImageUrl);

  const changeImage = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageUrl(URL.createObjectURL(e.target.files[0]));
      setImage(e.target.files[0]);
    }
  };

  const removeImage = () => {
    setImageUrl();
    setImage();
  };

  return (
    <div className={`imageInput ${className}`}>
      {label && <p className="imageInput__label">{label}</p>}
      <div className="imageInput__thumbnail">
        {imageUrl ? (
          <img src={imageUrl} alt={label ?? "an image"} />
        ) : (
          <ImagePlaceholder />
        )}
      </div>
      <div className="imageInput__actions">
        <label>
          <Button
            title="Change Photo"
            className="imageInput__actions-change"
            disabled={disabled}
          />
          <input type="file" accept="image/*" onChange={changeImage} />
        </label>
        <Button
          title="Remove"
          className="imageInput__actions-remove"
          onClick={removeImage}
        />
      </div>
    </div>
  );
}
