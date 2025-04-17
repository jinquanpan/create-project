import path from "path";
import fs from "fs";
import chalk from "chalk";
import qiniu from "./qiniu/index.js";

let packageJson = fs.readFileSync(
  path.join(process.cwd(), "./package.json"),
  "utf-8"
);
packageJson = JSON.parse(packageJson);

const readFileList = (_path, filesList = []) => {
  const files = fs.readdirSync(_path);

  files.forEach((item) => {
    const fullPath = path.join(_path, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      readFileList(path.join(_path, item), filesList); // 递归读取文件
      // 过滤dist/index.html
    } else if (!fullPath.includes("dist/index.html")) {
      let index = fullPath.indexOf("dist");

      filesList.push({
        path: fullPath,
        name: fullPath.slice(index + 5).replace(/\\/g, "/"),
      });
    }
  });
  return filesList;
};

const main = async () => {
  if (!process.env.BUILD) {
    console.log(chalk.red("环境变量目前只支持: development / production!"));
    return;
  }
  const PROJECT_NAME = packageJson.name;
  const PROJECT_PATH = path.resolve(process.cwd());
  const DIST_PATH = path.resolve(PROJECT_PATH, "dist");

  const projectConfig = {
    PROJECT_NAME,
    PROJECT_VERSION: packageJson.version,
    PATH_DIR_NAME: DIST_PATH,
  };

  // const buildInfo = await syncCommand(
  //   `npm run ${buildCommand[process.env.BUILD || 'development']}`,
  //   {
  //     cwd: PROJECT_PATH,
  //   },
  // );

  // if (buildInfo.toLowerCase().includes('error')) {
  //   outputLog(
  //     [
  //       '\nPROJECT_INFO---------',
  //       `packageName: ${projectConfig.PROJECT_NAME}`,
  //       `目录: ${PROJECT_NAME}`,
  //       `版本: ${projectConfig.PROJECT_VERSION}`,
  //       `环境: ${process.env.BUILD}`,
  //       `状态: Error !`,
  //       '---------\n',
  //     ],
  //     color.red,
  //   );
  //   process.exitCode = 1;
  //   throw new Error('编译错误! 请检查错误日志');
  // }

  // await syncCommand('ls', {
  //   cwd: DIST_PATH,
  // }).split('\n');

  // console.log(distls);

  // if (!distls.includes('index.html') || !distls.includes('js')) {
  //   console.log(chalk.red('dist目录不存在 index.html 或者 js . 可能存在打包失败,请检查'));
  //   return;
  // }
  const files = readFileList(DIST_PATH);

  qiniu(files, projectConfig);
};

export default main;

main();
