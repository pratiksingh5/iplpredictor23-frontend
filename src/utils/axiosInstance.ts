/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosRequestConfig, Method } from "axios";
import config from "@/config";

// Define the interface for custom request options
interface IRequestOptions extends AxiosRequestConfig {
  customHeaders?: { [key: string]: string }; // Custom headers
  queryParams?: { [key: string]: string }; // Custom query params
}

const axiosInstance = axios.create({
  baseURL: config.BACKEND_URL || "http://localhost:3001",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    config.withCredentials = true; // Ensure cookies are included in requests
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Create a reusable request function to handle all HTTP methods
const request = async <T>(
  method: Method,
  url: string,
  data?: any,
  options?: IRequestOptions
): Promise<any> => {
  // Ensure that this function returns just the data (T)
  try {
    // Perform the request and rely on the interceptor to handle the response
    const response = await axiosInstance.request<T>({
      method,
      url,
      data,
      ...options,
    });

    // Return only the data from the response
    return response; // This extracts the data, which is of type T
  } catch (error: any) {
    console.error("Request failed:", error?.response || error.message);
    throw error; // Re-throw the error for the caller to handle
  }
};

// HTTP method specific functions
const getHttp = async <T>(
  url: string,
  params?: any,
  options?: IRequestOptions
): Promise<T> => {
  // Merge custom query parameters if provided
  const mergedParams = options?.queryParams
    ? { ...params, ...options.queryParams }
    : params;
  return request<T>("get", url, undefined, {
    params: mergedParams,
    ...options,
  });
};

const postHttp = async <T>(
  url: string,
  data?: any,
  options?: IRequestOptions
): Promise<T> => {
  const config = {
    ...options,
    withCredentials: true, // Ensures cookies are sent with the request
  };
  return request<T>("post", url, data, config);
};

const putHttp = async <T>(
  url: string,
  data?: any,
  options?: IRequestOptions
): Promise<T> => {
  return request<T>("put", url, data, options);
};

const patchHttp = async <T>(
  url: string,
  data?: any,
  options?: IRequestOptions
): Promise<T> => {
  return request<T>("patch", url, data, options);
};

const deleteHttp = async <T>(
  url: string,
  data?: any,
  options?: IRequestOptions
): Promise<T> => {
  return request<T>("delete", url, data, options);
};

export { getHttp, postHttp, putHttp, patchHttp, deleteHttp };

export default axiosInstance;
