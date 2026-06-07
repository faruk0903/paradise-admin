import { AxiosResponse } from "../../types";
import { request } from "../request";

export const addSiteApi = async (body: any) => {
  const response: AxiosResponse<any> = await request({
    url: `/sites`,
    method: "POST",
    body,
  });
  return response;
};
export const UpdateSite = async (body: any) => {
  const response: AxiosResponse<any> = await request({
    url: `/sites/${body.id}`,
    method: "PUT",
    body: body,
  });
  return response;
};
export const GetAllSiteApi = async (page: any, limit: any, searchTerm: any) => {
  const response: AxiosResponse<any> = await request({
    url: `/sites?page=${page}&limit=${limit}&search=${searchTerm}`,
    method: "GET",
  });
  return response;
};
export const GetSiteApi = async (id: any) => {
  const response: AxiosResponse<any> = await request({
    url: `/sites/${id}`,
    method: "GET",
  });
  return response;
};
export const GetAllCategoryListApi = async () => {
  const response: AxiosResponse<any> = await request({
    url: `/getAllCategory`,
    method: "GET",
  });
  return response;
};
