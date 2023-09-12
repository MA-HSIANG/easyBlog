import axios from "axios";

import { getToken } from "../utils/verify";

function useAxios() {
  const instance = axios.create({
    //////-------------render-com-------------------------////////////
    // baseURL: "https://blog-server-6lno.onrender.com",
    baseURL: import.meta.env.VITE_YOUR_API_URL,
    headers: {
      "Content-Type": "application/json",
      "Content-Type": "multipart/form-data",
    },
  });
  //發送請求前
  instance.interceptors.request.use(
    (config) => {
      config.headers.authorization = getToken();

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return instance;
}

export { useAxios };
