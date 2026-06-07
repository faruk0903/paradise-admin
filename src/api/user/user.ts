/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from "../../types";
import { request } from "../request";

// export const GetUsersApi = async (body: any) => {
//   const response: AxiosResponse<any> = await request({
//     url: `/getAllUsers?page=1&limit=10`,
//     method: "GET",
//     body: { ...body },
//   });
//   return response;
// };
export const GetUsersApi = async (page: any, limit: any) => {
  const response: AxiosResponse<any> = await request({
    url: `/getAllUsers?page=${page}&limit=${limit}`,
    method: "GET",
  });
  return response;
};

export const GetUserByIdApi = async (id: any) => {
  console.log(id);
  const response: AxiosResponse<any> = await request({
    url: `/getUser/${id}`,
    method: "GET",
  });
  return response;
};
export const UpdateUser = async (body: any) => {
  console.log(body, "body");

  const response: AxiosResponse<any> = await request({
    url: `/updateUser`,
    method: "POST",
    body,
  });
  console.log({ id: body }, "bodyyyy");
  return response;
};
export const TrashUserApi = async (id: any) => {
  console.log(id);
  const response: AxiosResponse<any> = await request({
    url: `/trashUser/${id}`,
    method: "POST",
  });
  return response;
};
export const StatusUserApi = async (body: any) => {
  console.log(body, "iddd");

  const response: AxiosResponse<any> = await request({
    url: `/updateStatusUser`,
    method: "POST",
    body: body,
  });
  return response;
};
