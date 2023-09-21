import { LoadingSpinner } from "assets/icons";
import React from "react";

export default function FullPageSpinner({
  containerHeight,
  spinnerWidth,
  style,
  ...props
}) {
  return (
    <div
      style={{
        width: "100%",
        height: containerHeight ?? "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
      {...props}
    >
      <LoadingSpinner width={spinnerWidth ?? "10%"} />
    </div>
  );
}
