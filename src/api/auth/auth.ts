import { ApiResponseType, AxiosResponse } from "../../types";
import { request } from "../request";

export const LoginApi = async (body: any) => {
  const response: AxiosResponse<ApiResponseType> = await request({
    url: "/auth/login",
    method: "POST",
    body: { ...body },
  });

  return response;
};

export const LogOutAPI = async (body: any) => {
    const response: AxiosResponse<any> = await request({
        url: `/auth/logout`,
        method: "POST",
        body: { ...body },
    });
    return response;
};
export const EditProfileAPi = async (body: any) => {

    const response: AxiosResponse<any> = await request({
        url: `/auth/editProfile`,
        method: "POST",
        body: { ...body },
    });
    return response;
    
};
export const ChangePasswordApi = async (body: any) => {
    const response: AxiosResponse<any> = await request({
        url: `/auth/changePassword`,
        method: "POST",
        body: { ...body },
    });
    return response;
};
export const ForgotPasswordApi = async (body: any) => {
    const response: AxiosResponse<any> = await request({
        url: `/auth/forgetPassword`,
        method: "POST",
        body: { ...body },
    });
    return response;
};
export const ResetPasswordApi = async (body: any) => {
    const response: AxiosResponse<any> = await request({
        url: `/auth/resetPassword`,
        method: "POST",
        body: { ...body },
    });
    return response;
};
