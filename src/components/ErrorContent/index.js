import AccessError from "components/AccessErr/AccessError";
import React from "react";

export default function ErrorContent({
  title,
  error,
  reset,
  resetErrorBoundary,
}) {
  // console.log("error", error);
  // This will be updated based on the error type
  if (error.status === 406 || error.status === 401) {
    return <AccessError />;
  }

  return (
    <div className="errorContent">
      <p className="errorContent-title">
        {title || error.statusText || "Something went wrong:"}
      </p>
      <pre className="errorContent-message">{error.message}</pre>
      {(reset || resetErrorBoundary) && (
        <button
          onClick={() => {
            if (reset) reset();
            if (resetErrorBoundary) resetErrorBoundary();
          }}
        >
          Click to retry
        </button>
      )}
    </div>
  );
}
