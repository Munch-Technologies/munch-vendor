import React from "react";
import {
  CustomerIcon,
  HomeIcon,
  LogoutIcon,
  MenuIcon,
  OrderIcon,
  PromotionIcon,
  RestaurantIcon,
  RevenueIcon,
  ReviewIcon,
  RidersIcon,
  SettingsIcon,
  SubadminIcon,
} from "assets/icons";
import { MunchLogo } from "assets/images";
import { useActiveRoute } from "utils/hooks";
import SidebarItem from "./SidebarItem/SidebarItem";
import { useNavigate } from "react-router-dom";
import { useAuth } from "context/AuthContext";
import { capitalizeFirstLetter } from "utils/capitalize";
import Image from "components/Image";

const Sidebar = () => {
  const { activePath } = useActiveRoute("dashboard");
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  return (
    <div className="sidebar">
      <div className="sidebar__logo">
        <MunchLogo />
      </div>
      <nav className="sidebar__nav">
        <div className="sidebar__nav-items">
          <div className="sidebar__nav-items-item">
            <SidebarItem
              page={"/"}
              icon={<HomeIcon className={"sidebar__nav-items-item-icon"} />}
              title={"Dashboard"}
              className={activePath === "dashboard" ? "active" : ""}
            />
          </div>

          <div className="sidebar__nav-items-item">
            <SidebarItem
              page={"/revenue"}
              icon={<RevenueIcon className={"sidebar__nav-items-item-icon"} />}
              title={"Revenue"}
              className={activePath === "revenue" ? "active" : ""}
            />
          </div>

          <div className="sidebar__nav-items-item">
            <SidebarItem
              page={"/restaurants"}
              icon={
                <RestaurantIcon className={"sidebar__nav-items-item-icon"} />
              }
              title={"Restaurants"}
              className={activePath === "restaurants" ? "active" : ""}
            />
          </div>

          <div className="sidebar__nav-items-item">
            <SidebarItem
              page={"/menu"}
              icon={<MenuIcon className={"sidebar__nav-items-item-icon"} />}
              title={"Menu"}
              className={activePath === "menu" ? "active" : ""}
            />
          </div>

          <div className="sidebar__nav-items-item">
            <SidebarItem
              page={"/orders"}
              icon={<OrderIcon className={"sidebar__nav-items-item-icon"} />}
              title={"Orders"}
              className={activePath === "orders" ? "active" : ""}
            />
          </div>

          <div className="sidebar__nav-items-item">
            <SidebarItem
              page={"/riders"}
              icon={<RidersIcon className={"sidebar__nav-items-item-icon"} />}
              title={"Riders"}
              className={activePath === "riders" ? "active" : ""}
            />
          </div>

          <div className="sidebar__nav-items-item">
            <SidebarItem
              page={"/customers"}
              icon={<CustomerIcon className={"sidebar__nav-items-item-icon"} />}
              title={"Customers"}
              className={activePath === "customers" ? "active" : ""}
            />
          </div>

          <div className="sidebar__nav-items-item">
            <SidebarItem
              page={"/users"}
              icon={<SubadminIcon className={"sidebar__nav-items-item-icon"} />}
              title={"Sub-admins"}
              className={activePath === "users" ? "active" : ""}
            />
          </div>

          <div className="sidebar__nav-items-item">
            <SidebarItem
              page={"/reviews"}
              icon={<ReviewIcon className={"sidebar__nav-items-item-icon"} />}
              title={"Reviews"}
              className={activePath === "reviews" ? "active" : ""}
            />
          </div>

          <div className="sidebar__nav-items-item">
            <SidebarItem
              page={"/settings"}
              icon={<SettingsIcon className={"sidebar__nav-items-item-icon"} />}
              title={"Settings"}
              className={activePath === "settings" ? "active" : ""}
            />
          </div>

          <div className="sidebar__nav-items-item">
            <SidebarItem
              page={"/promotions"}
              icon={
                <PromotionIcon className={"sidebar__nav-items-item-icon"} />
              }
              title={"Promotions"}
              className={activePath === "promotions" ? "active" : ""}
            />
          </div>
        </div>
        <div className="sidebar__nav-admin">
          <div
            className="sidebar__nav-admin-munch"
            onClick={() => navigate("/settings")}
          >
            <Image src={user.avatar} alt="munch admin" />
            <h4>{capitalizeFirstLetter(user.name)}</h4>
          </div>
          <LogoutIcon onClick={logout} />
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
