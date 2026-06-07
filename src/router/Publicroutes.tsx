import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import { PrivateRouteProps } from "./Privateroutes";
// import React from "react";

export const PublicRouterOutlet = ({
  authenticationPath,
  // outlet,
}: PrivateRouteProps) => {
  const {  accessToken } = useAuthStore.getState();
  // console.log(token, "FDgfdg");

  return accessToken ? <Navigate to={authenticationPath ?? "/"} /> : <Outlet />;
};
