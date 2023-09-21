import React from "react";
import { ArrowLeft, ArrowRight } from "../../assets/icons";
import { Button } from "../index";
const Pagination = ({ className, pages }) => {
  return (
    <div className={`pagination ${className}`}>
      {/* previous page button */}
      <Button
        titleClass={"pagination__title"}
        className="pagination__button"
        title={"Previous"}
        iconLeft={<ArrowRight />}
      />
      {/* available pages number */}
      <div className="pagination__pages">{pages}</div>
      {/* next page button */}
      <Button
        titleClass={"pagination__title"}
        className="pagination__button"
        title={"Next"}
        iconRight={<ArrowLeft />}
      />
    </div>
  );
};

export default Pagination;
