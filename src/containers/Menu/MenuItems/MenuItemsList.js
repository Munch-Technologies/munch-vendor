import React from "react";
import MenuItem from "./MenuItem";

export default function MenuItemsList({ list, params }) {
  return (
    <table className="menuItems__table">
      <thead>
        <tr>
          <th>Menu item</th>
          <th>Category</th>
          <th>Restaurant</th>
          <th>Rating</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {list.map((menuItem) => (
          <MenuItem item={menuItem} key={menuItem.id} params={params} />
        ))}
      </tbody>
    </table>
  );
}
