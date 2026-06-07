import { AxiosResponse } from "../../types";
import { request } from "../request";

export const addBookingApi = async (body: any) => {
  const response: AxiosResponse<any> = await request({
    url: `/plotSales`,
    method: "POST",
    body,
  });
  return response;
};

export const GetAllBookingApi = async (
  page: any,
  limit: any,
  searchTerm: any,
  status: any = ""
) => {
  const response: AxiosResponse<any> = await request({
    url: `/plotSales?page=${page}&limit=${limit}&search=${searchTerm}&status=${status}`,
    method: "GET",
  });
  return response;
};

export const GetBookingByIdApi = async (id: any) => {
  const response: AxiosResponse<any> = await request({
    url: `/plotSales/${id}`,
    method: "GET",
  });
  return response;
};

export const UpdateBookingApi = async (body: any) => {
  const { id, ...rest } = body;
  const response: AxiosResponse<any> = await request({
    url: `/plotSales/${id}`,
    method: "PUT",
    body: rest,
  });
  return response;
};

export const CancelBookingApi = async (body: any) => {
  const { id, ...rest } = body;
  const response: AxiosResponse<any> = await request({
    url: `/plotSales/${id}/cancel`,
    method: "PUT",
    body: rest,
  });
  return response;
};

export const AddInstallmentApi = async (body: any) => {
  const response: AxiosResponse<any> = await request({
    url: `/installments`,
    method: "POST",
    body,
  });
  return response;
};

export const GetInstallmentsApi = async (plotSaleId: any) => {
  const response: AxiosResponse<any> = await request({
    url: `/installments/${plotSaleId}`,
    method: "GET",
  });
  return response;
};

export const AdjustAdvanceApi = async (body: any) => {
  const response: AxiosResponse<any> = await request({
    url: `/installments/adjust-advance`,
    method: "POST",
    body,
  });
  return response;
};
