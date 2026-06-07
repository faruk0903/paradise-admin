import { AxiosResponse } from "../../types";
import { request } from "../request";

export const GetDashBoardCountApi = async () => {
  const response: AxiosResponse<any> = await request({
    url: `/getDashboardCounts`,
    method: "GET",
  });
  return response;
};
