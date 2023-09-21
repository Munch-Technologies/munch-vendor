import React from "react";
import { Route, Routes } from "react-router-dom";
import MenuItems from "./MenuItems";
import MenuPage from "./Menu";

const Menu = () => {
  return (
    <>
      <Routes>
        <Route path="menuitems" element={<MenuItems />} />
        <Route index element={<MenuPage />} />
      </Routes>
    </>
  );
};

export default Menu;
