import { AxiosResponse } from "../../types";
import UseToast from "../../utils/useToast";
import { request } from "../request";

export const PopurlarCategoryApi = async (body: {
  categoryId: any;
  is_popular: number;
}) => {
  const response: any = await request({
    url: `/addToPopularCategory`,
    method: "POST",
    body: body,
  });
  if (response.status === true) {
    UseToast(response.message);
  }
  console.log(response, "response");

  return response;
};

export const GetCategoryApi = async (id: any) => {
  console.log(id, "dd");
  const response: AxiosResponse<any> = await request({
    url: `/getCategory/${id}`,
    method: "GET",
  });

  return response;
};

export const AddCategoryApi = async (body: any) => {
  const response: AxiosResponse<any> = await request({
    url: `/addCategory`,
    method: "POST",
    body: body,
  });
  return response;
};

export const EditCategoryApi = async (body: any) => {
  const response: AxiosResponse<any> = await request({
    url: `/editCategory`,
    method: "POST",
    body: body,
  });
  return response;
};

export const AddPopularCategory = async (body: any) => {
  const response: AxiosResponse<any> = await request({
    url: `/addToPopularCategory`,
    method: "POST",
    body: body,
  });
  return response;
};

export const DeleteCategoryApi = async (id: any) => {
  const response: AxiosResponse<any> = await request({
    url: `/trashPlaceCategory/${id}`,
    method: "POST",
  });
  return response;
};
export const StatusCategoryApi = async (body: any) => {
  console.log(body, "iddd");

  const response: AxiosResponse<any> = await request({
    url: `/updateCategoryStatus`,
    method: "POST",
    body: body,
  });
  return response;
};
