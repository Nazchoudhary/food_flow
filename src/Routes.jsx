import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import DashboardOverview from "pages/dashboard-overview";
import OrderDetails from "pages/order-details";
import OrderManagement from "pages/order-management";
import MenuManagement from "pages/menu-management";
import UserManagement from "pages/user-management";
import BillGeneration from "pages/bill-generation";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<DashboardOverview />} />
        <Route path="/dashboard-overview" element={<DashboardOverview />} />
        <Route path="/order-details" element={<OrderDetails />} />
        <Route path="/order-management" element={<OrderManagement />} />
        <Route path="/menu-management" element={<MenuManagement />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/bill-generation" element={<BillGeneration />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;