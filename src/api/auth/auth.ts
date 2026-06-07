import { ApiResponseType, AxiosResponse } from "../../types";
import { request } from "../request";

export const LoginApi = async (body: any) => {
  const response: AxiosResponse<ApiResponseType> = await request({
    url: "/login",
    method: "POST",
    body: { ...body },
  });

  return response;
};

export const LogOutAPI = async (body: any) => {
    const response: AxiosResponse<any> = await request({
        url: `/logout`,
        method: "POST",
        body: { ...body },
    });
    return response;
};
export const EditProfileAPi = async (body: any) => {
    
    const response: AxiosResponse<any> = await request({
        url: `/editProfile`,
        method: "POST",
        body: { ...body },
    });
    return response;
    
};
export const ChangePasswordApi = async (body: any) => {
    const response: AxiosResponse<any> = await request({
        url: `/changePassword`,
        method: "POST",
        body: { ...body },
    });
    return response;
};
export const ForgotPasswordApi = async (body: any) => {
    const response: AxiosResponse<any> = await request({
        url: `/forgetPassword`,
        method: "POST",
        body: { ...body },
    });
    return response;
};
export const ResetPasswordApi = async (body: any) => {
    const response: AxiosResponse<any> = await request({
        url: `/resetPassword`,
        method: "POST",
        body: { ...body },
    });
    return response;
};
