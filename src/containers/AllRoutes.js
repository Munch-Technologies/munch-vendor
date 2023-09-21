import React from "react";
import { Routes, Route } from "react-router-dom";

import {
  Dashboard,
  Menu,
  Notifications,
  Order,
  Revenue,
  Riders,
  Settings,
  Restaurants,
  Restaurant,
  RiderDetail,
  Customers,
  Users,
  Customer,
  Reviews,
  Promotions,
  CreatePromotions,
  ViewPromotions,
  CreateHighlight,
  ViewHighlight,
} from "containers";
import { Suspense } from "react";
import { ErrorContent, FullPageSpinner } from "components";
import { ErrorBoundary } from "react-error-boundary";
import { useActiveRoute } from "utils/hooks";

const AllRoutes = () => {
  const { activePath, routes } = useActiveRoute();
  return (
    <ErrorBoundary
      FallbackComponent={ErrorContent}
      onReset={() => {
        // reset the state of your app so the error doesn't happen again
      }}
      resetKeys={[activePath, routes]}
    >
      <Suspense fallback={<FullPageSpinner containerHeight="80vh" />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/menu/*" element={<Menu />} />
          <Route path="/orders" element={<Order />} />
          <Route path="/revenue" element={<Revenue />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/customers/:customerId" element={<Customer />} />
          <Route path="/riders" element={<Riders />} />
          <Route path="/users" element={<Users />} />
          <Route path="/riders/:riderId" element={<RiderDetail />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="/promotions/create" element={<CreatePromotions />} />
          <Route
            path="/promotions/create/:promoId"
            element={<ViewPromotions />}
          />
          <Route path="/promotions/highlight" element={<CreateHighlight />} />
          <Route
            path="/promotions/highlight/create"
            element={<ViewHighlight />}
          />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurants/:restaurantId/*" element={<Restaurant />} />
          {/* <Route
            path="/restaurants/:restaurantId/:editId"
            element={<EditMenu />}
          /> */}
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default AllRoutes;
