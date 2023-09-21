import { DisapprovingMascot } from "assets/icons/MunchMascots";
import React from "react";

const AccessError = () => {
  return (
    <div className="card emptyMenu">
      <DisapprovingMascot />
      <p className="emptyMenu__text">
        Sorry you currently don't have permission to access this page.
      </p>
    </div>
  );
};

export default AccessError;
