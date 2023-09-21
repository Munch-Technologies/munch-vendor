import React from "react";
import { Link } from "react-router-dom";

const SidebarItem = (props) => {
  return (
    <Link to={props.page}>
      <div className={`sidebaritem ${props.className}`}>
        <div className="sidebaritem__icon">{props.icon}</div>
        <p className="sidebaritem__text">{props.title}</p>
      </div>
    </Link>
  );
};

export default SidebarItem;
