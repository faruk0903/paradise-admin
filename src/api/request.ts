import axios, { AxiosResponse, ResponseType } from "axios";
import { useAuthStore } from "../store/auth";

let authToken = useAuthStore.getState().token;
const removeUser = useAuthStore.getState().removeAll;

useAuthStore.subscribe((state) => {
  authToken = state.token;
});

axios.interceptors.request.use(
  function (config) {
    if (!config.headers) {
      config.headers;
    }

    if (authToken) {
      config.headers["Authorization"] = "Bearer " + authToken;
    }

    return config;
  },

  function (error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    if (response.headers["content-type"]?.includes("application/json")) {
      response = response.data;
      if (response.status) {
        return response;
      } else {
        return Promise.reject(response);
      }
    } else if (response.status === 200) {
      return response;
    }
    123456789;
    return Promise.reject(response);
  },

  function (error) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      removeUser();
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // const message = (error.response?.status === 404 && error?.response?.data?.message || "") || (error?.response?.status === 401 && "You've been logged out. Please log back in") || (error?.response?.data?.message || "")
    // (error.response?.status === 404
    //   ? "API not found."
    //   : error?.response?.data?.message || "Something went wrong")
    return Promise.reject(error?.response?.data?.message);
  }
);

export const request = async ({
  url,
  method = "GET",
  params,
  body,
  headers,
  responseType,
}: {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  params?: any;
  body?: any;
  headers?: any;
  responseType?: ResponseType;
}) => {
  const BASE_URL =
    import.meta.env.VITE_BASE_URL || "http://localhost:5000/paradise/api/admin";

  const res: AxiosResponse = await axios.request({
    url: BASE_URL + url,
    method,
    params,
    data: body,
    headers,
    responseType,
  });

  return res;
};
