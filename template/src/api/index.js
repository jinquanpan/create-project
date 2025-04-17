import axios from "axios";
import store from "@/utils/redux";
import { message } from "antd";

// console.log("BASE_API++++++++++", process.env.BASE_API);
// create an axios instance
const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  // timeout: 5000, // request timeout
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    const state = store.store.getState();
    const token = state?.user?.token;
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    const res = response.data;
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      console.log(res.message);

      // 401: Token expired;
      if (res.code === 401) {
        message.warning("token已过期, 请重新登录");
        // to re-login
        store.store.dispatch({ type: "user/logout" });
      }
      return Promise.reject(new Error(res.message || "Error"));
    }
    return res;
  },
  (error) => {
    console.log("err++++++", error);
    // 401: Token expired;
    if (error.status === 401) {
      message.warning("token已过期, 请重新登录");
      // to re-login
      store.store.dispatch({ type: "user/logout" });
    }

    return Promise.reject(error);
  }
);

//取消接口
const CancelToken = axios.CancelToken;
let cancel = {};

export const cancelAsync = (config) => {
  let path = config.method + "-" + config.url + "-" + config.cancelParam;

  if (cancel[path]) {
    cancel[path]();
    cancel[path] = null;
  }

  return service({
    ...config,
    cancelToken: new CancelToken(function executor(c) {
      // executor 函数接收一个 cancel 函数作为参数
      cancel[path] = c;
    }),
  });
};

export default (config) => {
  return service(config);
};

// get
// cancelAsync({
//   url: "/api/newcitymap/outletanalysis/brand_library_start?page_size=100&page_num=1&model=brand_library",
//   method: "get",
//   params: {
//     firstName: 'Fred',
//     lastName: 'Flintstone'
//   }
// });

// post
// cancelAsync({
//   url: "/api/newcitymap/outletanalysis/brand_library_start?page_size=100&page_num=1&model=brand_library",
//   method: "post",
// data: {
//   firstName: 'Fred',
//   lastName: 'Flintstone'
// }
// });
