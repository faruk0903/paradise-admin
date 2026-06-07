import { Route, Routes, useNavigate } from "react-router-dom";

import VerticalLayout from "../components/SideBar";
import Home from "../pages/Home";
import { PrivateRouteProps } from "./Privateroutes";
import { useEffect } from "react";
import navigation from "../navigation/vertical/index";
import myProfile from "../pages/Profile/myProfile";
import Usermanegment from "../pages/UserManegment/UserManegment";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import Login from "../pages/auth/Login";
import { useAuthStore } from "../store/auth";
import ViewUser from "../pages/UserManegment/ViewUser";
import EditUser from "../pages/UserManegment/EditUser";

import AddSite from "../pages/SiteManagement/AddSite";
import ListSite from "../pages/SiteManagement/ListSite";
import EditSite from "../pages/SiteManagement/EditSite";
import ListBooking from "../pages/PlotSale/PlotSaleListing";
import SaleCreate from "../pages/PlotSale/CreateBooking";
import EditBooking from "../pages/PlotSale/EditBooking";
import ViewBooking from "../pages/PlotSale/ViewBooking";

const AppRouting = () => {
  const { token } = useAuthStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate("/sign-in");
    }
  }, []);

  return (
    <>
      {token ? (
        <VerticalLayout menuData={navigation}>
          <Routes>
            <Route path="/" Component={Home} />

            {/* User Management */}
            <Route path="/usermanegment" Component={Usermanegment} />
            <Route path="/usermanegment/view" Component={ViewUser} />
            <Route path="/usermanegment/edit" Component={EditUser} />

            {/* Profile */}
            <Route path="/profile" Component={myProfile} />

            {/* Site Management */}
            <Route path="/siteList" Component={ListSite} />
            <Route path="/siteList/addsite" Component={AddSite} />
            <Route path="/siteList/edit" Component={EditSite} />

            {/* Booking Management */}
            <Route path="/bookingList" Component={ListBooking} />
            <Route path="/bookingList/add" Component={SaleCreate} />
            <Route path="/bookingList/edit" Component={EditBooking} />
            <Route path="/bookingList/view" Component={ViewBooking} />
          </Routes>
        </VerticalLayout>
      ) : (
        <Routes>
          <Route path="/sign-in" Component={Login} />
          <Route path="/forgot-password" Component={ForgotPassword} />
          <Route path="/reset-password/:token" Component={ResetPassword} />
        </Routes>
      )}
    </>
  );
};

export default AppRouting;

export const defaultPrivateRouteProps: Omit<PrivateRouteProps, "outlet"> = {
  authenticationPath: "/sign-in",
};

export const defaultPublicRouteProps: Omit<PrivateRouteProps, "outlet"> = {
  authenticationPath: "/",
};
