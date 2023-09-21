import React from "react";
import ReactStars from "react-rating-stars-component";

function RatingStar({ star, edit = false, onChange }) {
  return (
    <ReactStars
      count={5}
      half={true}
      value={star}
      edit={edit}
      onChange={(newRating) => onChange && onChange(newRating)}
      color1="#EEEEEE"
    />
  );
}

export default RatingStar;
