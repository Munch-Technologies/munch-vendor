import React from "react";
import { Link } from "react-router-dom";

export default function BreadCrumbs({ routes, ...props }) {
  const length = routes.length;
  // console.log("routes", routes);
  return (
    <div className="breadcrumb" {...props}>
      {routes.map((route, index) =>
        index === length - 1 ? (
          <span className="breadcrumb__main" key={index}>
            {route.title}
          </span>
        ) : (
          <span className="breadcrumb__link" key={index}>
            <Link to={route.path}>{route.title}</Link>
          </span>
        )
      )}
    </div>
  );
}
