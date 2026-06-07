import { Navigate } from "react-router-dom";
// import { useAuthStore } from "../store/auth";
export const PrivateRouterOutlet = ({
  // outlet,
  authenticationPath,
  // prevPath,
}: PrivateRouteProps) => {
  return (
    <Navigate
      to={{
        pathname: authenticationPath,
      }}
      replace
    />
  );
};

export type PrivateRouteProps = {
  authenticationPath?: string;
  prevPath?: string;
  outlet?: JSX.Element;
};
