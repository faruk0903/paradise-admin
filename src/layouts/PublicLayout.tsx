// import React, { Suspense, useEffect, useState } from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// import { useAuthStore } from "../store/auth";

// type Props = {};

// const PublicAppLayout = (props: Props) => {
//   const { token } = useAuthStore();
//   const navigate = useNavigate();
//   useEffect(() => {
//     if (token) {
//       navigate("/");
//     } else {
//       navigate("/");
//     }
//   }, []);

//   return !token && <Outlet />;
// };

// export default PublicAppLayout;


import { Outlet } from "react-router-dom";

;

const PublicAppLayout = () => {
  return <Outlet />;
};

export default PublicAppLayout;
