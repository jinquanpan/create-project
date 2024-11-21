"use strict";
import inquirer from "inquirer";
import fsExtra from "fs-extra";
import fs from "fs";
import path from "path";

//   .filter((file) => file.port)
//   .sort((a, b) => a.port - b.port);

let questions = [
  {
    type: "input",
    name: "address",
    message: "请输入写入的地址",
    validate: function (value) {
      if (value) {
        return true;
      }

      return "请输入合法的地址";
    },
  },
  {
    type: "input",
    name: "projectName",
    message: "请输入项目名称",
    validate: function (value) {
      if (value) {
        return true;
      }

      return "请输入合法的项目名称";
    },
  },
];

inquirer.prompt(questions).then((answers) => {
  let i = answers.address[0] === "/" ? 1 : 0;
  let arr = answers.address.split("/");
  let catalog = arr[i];
  let catalogPath = arr.slice(i + 1).join("/");

  let address = "";
  // 相对路径
  if (
    answers.address.slice(0, 2) === "./" ||
    answers.address.slice(0, 3) === "../"
  ) {
    address = path.resolve(answers.address, answers.projectName);

    // 绝对路径
  } else {
    address = path.join(
      `${catalog.toUpperCase()}:`,
      catalogPath,
      answers.projectName
    );
  }

  // // 创建目录
  fsExtra.ensureDirSync(address);

  // // 复制内容
  fsExtra.copySync("./template", address);

  // 修改package.json 名称
  fs.readFile(path.resolve(address, "package.json"), "utf8", (err, data) => {
    let modifiedData = data.replace(
      '"name": "vite-react"',
      `"name": "${answers.projectName}"`
    );
    fs.writeFileSync(path.resolve(address, "package.json"), modifiedData);
    console.log("成功+++++", address);
  });
});
