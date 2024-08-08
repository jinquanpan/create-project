// import config from "./config";
import Client from "ssh2-sftp-client";
import fs from "fs";
import path from "path";

const packagePath = path.resolve("./", "package.json");
const packageData = fs.readFileSync(packagePath, "utf-8");
const packageJson = JSON.parse(packageData);

// 连接配置
const sshConfig = {
  host: "120.77.15.52", // 服务器地址
  port: 22, // 默认SSH端口
  username: "root", // 用户名
  privateKey: fs.readFileSync("./shell/id_rsa"),
  readyTimeout: 10000, // 设置超时时间为10秒
};

const serverPath =
  process.env.BUILD === "dev"
    ? `/data/assets/dev/${packageJson.name}`
    : `/data/assets/production/${packageJson.name}/${packageJson.version}`;

export default async function checkFileExistence() {
  const sftp = new Client();
  await sftp.connect(sshConfig);
  async function uploadFolder(sftpClient, localDir, remoteDir) {
    // 读取本地目录
    const files = fs.readdirSync(localDir);

    for (const file of files) {
      const localFilePath = path.join(localDir, file);
      const remoteFilePath = remoteDir + "/" + file;
      const stats = fs.statSync(localFilePath);
      if (stats.isFile()) {
        // 上传文件
        await sftpClient.put(localFilePath, remoteFilePath);
      } else if (stats.isDirectory()) {
        // 递归创建远程目录
        await sftpClient.mkdir(remoteFilePath);
        // 递归上传子目录
        await uploadFolder(sftpClient, localFilePath, remoteFilePath);
      }
    }
  }

  // 查看是否有目录文件  只是dev,dev不保存版本
  if (process.env.BUILD === "dev") {
    let isMkdir = await sftp.exists(serverPath);

    if (isMkdir) {
      await sftp.rmdir(serverPath, true);
    }
  }
  // 查看线上正式是否有当前版本
  if (process.env.BUILD !== "dev") {
    let projectPath = `/data/assets/production/${packageJson.name}`;
    let isProject = await sftp.exists(projectPath);
    // 线上资源查看有没这个项目的文件
    if (!isProject) {
      await sftp.mkdir(projectPath, true);
    }

    let isVersion = await sftp.exists(serverPath);
    if (isVersion) {
      sftp.end();
      console.log("已有当前版本");
      return;
    }
  }

  await sftp.mkdir(serverPath, true);
  console.log("创建目录成功");
  // 上传 文件
  await uploadFolder(sftp, "./dist", serverPath);
  console.log("上传成功");
  sftp.end();
  // 使用`sftp.stat()`来检查文件或文件夹是否存在
}

if (process.env.SETVER === "run") {
  checkFileExistence();
}
