import request, { cancelAsync } from "./index";

export function getAppInfo() {
  return request({
    url: "/api/app/app_info",
    method: "get",
  });
}

//取消接口
export function cancelAsyncParam(num) {
  return cancelAsync({
    url: "/api/newcitymap/outletanalysis/brand_library_start",
    method: "get",
    params: {
      page_size: 100,
      page_num: 1,
      model: "brand_library",
    },
    cancelParam: num || 1, // 用于同一接口参数区分取消请求
  });
}
