import { ArrowgreenSmall, ArrowredSmall } from "assets/icons";
import React from "react";

export default function ChangeStatusIndicator({
  className,
  wrapClassName,
  arrowSize,
  percentage,
  wrapped = false,
}) {
  return (
    <div
      className={`changeStatusInidcator ${
        !wrapped ? null : percentage < 0 ? "down" : "up"
      } ${wrapClassName ? wrapClassName : null}`}
    >
      {percentage < 0 ? (
        <ArrowredSmall
          width={arrowSize ? arrowSize : wrapped ? "10px" : "14px"}
        />
      ) : (
        <ArrowgreenSmall
          width={arrowSize ? arrowSize : wrapped ? "10px" : "14px"}
        />
      )}
      <span
        className={`changeStatusInidcator-percentage ${
          className ? className : null
        }`}
      >
        {Math.abs(percentage)}%
      </span>
    </div>
  );
}
