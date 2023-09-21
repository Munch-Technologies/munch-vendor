import React from "react";
import { ArrowLeft, ArrowRight } from "../../assets/icons";
import { Button } from "../index";
const Pagination2 = ({
  className,
  pages = 1,
  activePage = 1,
  onPageChange,
}) => {
  if (pages < 2) return;

  const getPageBox = (index) => (
    <span
      className={`pagination__pages-page ${
        activePage === index + 1 && "active"
      }`}
      tabIndex={0}
      onClick={() => onPageChange(index + 1)}
      key={index + 1}
    >
      {index + 1}
    </span>
  );

  return (
    <div className={`pagination ${className}`}>
      {/* previous page button */}

      <Button
        titleClass={"pagination__title"}
        className="pagination__button"
        title={"Previous"}
        iconLeft={<ArrowRight />}
        disabled={activePage === 1}
        onClick={() => onPageChange(activePage - 1)}
      />

      {/* available pages number */}
      {pages < 11 ? (
        <div className="pagination__pages">
          {Array(pages)
            .fill(null)
            .map((page, index) => getPageBox(index))}
        </div>
      ) : (
        <div className="pagination__pages">
          {activePage < 6
            ? Array(6)
                .fill(null)
                .map((page, index) => getPageBox(index))
            : Array(2)
                .fill(null)
                .map((page, index) => getPageBox(index))}
          <span className="pagination__pages-continue">...</span>
          {activePage < 6 ? (
            <>
              {getPageBox(pages - 2)}
              {getPageBox(pages - 1)}
            </>
          ) : activePage > pages - 5 ? (
            <>
              {getPageBox(pages - 6)}
              {getPageBox(pages - 5)}
              {getPageBox(pages - 4)}
              {getPageBox(pages - 3)}
              {getPageBox(pages - 2)}
              {getPageBox(pages - 1)}
            </>
          ) : (
            <>
              {getPageBox(activePage - 2)}
              {getPageBox(activePage - 1)}
              {getPageBox(activePage)}
              <span className="pagination__pages-continue">...</span>
              {getPageBox(pages - 2)}
              {getPageBox(pages - 1)}
            </>
          )}
        </div>
      )}
      {/* next page button */}

      <Button
        titleClass={"pagination__title"}
        className="pagination__button"
        title={"Next"}
        iconRight={<ArrowLeft />}
        disabled={activePage === pages}
        onClick={() => onPageChange(activePage + 1)}
      />
    </div>
  );
};

export default Pagination2;

// if page count is less than 9 we render all buttons
// 1 2 3 4 5 6 7 8 9 10
// 1 2 3 4 5 6 ... 11 12 (5)
// 1 2 ... 5 6 7 ... 11 12 (6)
// 1 2 ... 6 7 8 ... 11 12 (7)
// 1 2 ... 7 8 9 10 11 12 (8)
// 1 2 ... 7 8 9 ... 19 20 (8)
// 1 2 ... 5 6 7 ... 19 20 (6)
// 1 2 3 4 5 6 ... 19 20
