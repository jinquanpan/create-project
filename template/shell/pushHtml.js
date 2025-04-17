import path from "path";
import fs from "fs";
import request from "superagent";

/**
 *  cross-env TYPE=oem node ./docker/pushHtml.js [projectName]
 *
 * 用途:
 *  推送已打包好的html静态文件至deploy项目存储
 *
 */

let packageJson = fs.readFileSync(
  path.join(process.cwd(), "./package.json"),
  "utf-8"
);
packageJson = JSON.parse(packageJson);

const PROJECT_PATH = path.resolve(process.cwd());
const DIST_PATH = path.resolve(PROJECT_PATH, "dist");

const readFileContent = (path) => {
  return new Promise((resolve) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        console.log("催哦污");
        throw err;
      }
      resolve(data.toString());
    });
  });
};

const url = "https://api-service.isjike.com/deploy";

async function main() {
  const projectName = packageJson.name;
  // const htmlContent = await readFileContent(path.resolve(projectPath, 'dist/index.html'))

  // const packageContent = _packageContent.replace(/[\r\n]/g, '')

  const htmlContent = await readFileContent(
    path.resolve(DIST_PATH, `./index.html`)
  );
  const version = packageJson.version;
  const params = {
    html: htmlContent,
    name: projectName,
    version: version,
    key: "mengxiang01",
    package: packageJson.toString(),
  };
  const r = await request.post(url + "/git/add-version").send(params);
  console.log(r.text);
}
main();
