import checkFileExistence from "../shell/push";

export default function vitePluginBuildEnd() {
  return {
    name: "vite-plugin-build-end",
    apply: "build",
    closeBundle: () => {
      console.log("上传cdn--------------");
      checkFileExistence();
    },
  };
}
