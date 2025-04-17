import qiniu from "qiniu";

const qiniuConfig = {
  production: {
    accessKey: "VBvN33BnrqcaAqrbOHLD4EbTuIwxwjA_VSdUo6B5",
    secretKey: "fdSgoq2c71UX8rJ8luX5zf3BsC03TmDmbOdKnr7e",
    zone: qiniu.zone.Zone_z0,
    bucket: "igeekee",
    qiniuBaseUrl: "//cdn-static.isjike.com/",
    cdnPath: "front-end-cdn/static/",
  },
  dev: {
    accessKey: "VBvN33BnrqcaAqrbOHLD4EbTuIwxwjA_VSdUo6B5",
    secretKey: "fdSgoq2c71UX8rJ8luX5zf3BsC03TmDmbOdKnr7e",
    zone: qiniu.zone.Zone_z2,
    bucket: "imgtest",
    qiniuBaseUrl: "//imgtest.clickwifi.net/",
    cdnPath: "front-end-cdn/static_dev/",
  },
  sandbox: {
    accessKey: "VBvN33BnrqcaAqrbOHLD4EbTuIwxwjA_VSdUo6B5",
    secretKey: "fdSgoq2c71UX8rJ8luX5zf3BsC03TmDmbOdKnr7e",
    zone: qiniu.zone.Zone_z2,
    bucket: "imgtest",
    qiniuBaseUrl: "//imgtest.clickwifi.net/",
    cdnPath: "front-end-cdn/static_sandbox/",
  },
};

export const getQiniuConfig = () => qiniuConfig[process.env.BUILD || "dev"];
