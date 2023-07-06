import axios from "axios";
import $init from "../data/plugins/init";
function useAxios(isToken = false, token) {
  const instance = axios.create({
    //////-------------render-com-------------------------////////////
    // baseURL: "https://blog-server-6lno.onrender.com",
    baseURL: $init.renderUrl,
    headers: {
      "Content-Type": "application/json",
      "Content-Type": "multipart/form-data",
    },
  });
  //發送請求前

  instance.interceptors.request.use(
    (config) => {
      if (isToken) {
        config.headers.authorization = token.value;
      }

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
