// import checkFileExistence from "../shell/push-cdn";

export default function vitePluginBuildEnd() {
  return {
    name: "vite-plugin-build-end",
    apply: "build",
    closeBundle: () => {
      // checkFileExistence();
    },
  };
}
