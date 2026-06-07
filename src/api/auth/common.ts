import { AxiosResponse } from "../../types";
import { request } from "../request";

export const UploadFileApi = async (body: FormData) => {
  const response: AxiosResponse<any> = await request({
    url: "/categoryImage",
    method: "POST",
    body: body,
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "multipart/form-data",
    },
  });
  return response;
};
export const UploadCategoryApi = async (body: FormData) => {
  const response: AxiosResponse<any> = await request({
    url: "/categoryImage",
    method: "POST",
    body: body,
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "multipart/form-data",
    },
  });
  return response;
};
export const UploadProofApi = async (body: FormData) => {
  const response: AxiosResponse<any> = await request({
    url: "/upload/uploadImage",
    method: "POST",
    body: body,
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "multipart/form-data",
    },
  });
  return response;
};
