/* eslint-disable @typescript-eslint/no-explicit-any */
import qiniu from "qiniu";
import { getQiniuConfig } from "../config.js";
import { ProgressBar, outputLog, color } from "./logs.js";

const resultStatus = {
  error: 0,
  success: 0,
  reupload: 0,
  errorFiles: [],
  total: 0,
};

const progressInstance = new ProgressBar("Progress", 25);

const getToken = () => {
  const { accessKey, secretKey, bucket } = getQiniuConfig();
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  const putPolicy = new qiniu.rs.PutPolicy({
    scope: bucket,
  });
  return putPolicy.uploadToken(mac);
};

const upload = (ctx) => {
  const fileName = ctx.cdnPath + ctx.file.name;
  const putExtra = new qiniu.resume_up.PutExtra();
  putExtra.fname = ctx.file.name;

  const instance = new qiniu.resume_up.ResumeUploader(ctx.config);
  return new Promise((resolve) => {
    instance.putFile(
      ctx.token,
      fileName,
      ctx.file.path,
      putExtra,
      (respErr, respBody, respInfo) => {
        if (!respErr && respInfo.statusCode === 200) {
          resolve(respBody);
        } else {
          resolve({});
        }
      }
    );
  });
};

const group = (list, subGroupLength) => {
  let index = 0;
  const newArray = [];

  while (index < list.length) {
    newArray.push(list.slice(index, (index += subGroupLength)));
  }

  return newArray;
};

const loopUpload = async (files, ctx) => {
  const allFile = group(files, 3);
  const promiseAll = [];
  allFile.forEach(async (fs) => {
    for (const f of fs) {
      // eslint-disable-next-line no-await-in-loop

      const res = await upload({ ...ctx, file: f });

      if (res && res.key) {
        resultStatus.success += 1;
      } else {
        resultStatus.error += 1;
        resultStatus.errorFiles.push(f);
      }
      progressInstance.render({
        total: resultStatus.total,
        completed: resultStatus.success,
      });
    }
  });

  allFile.forEach((fs) => {
    promiseAll.push(
      // eslint-disable-next-line no-async-promise-executor
      new Promise(async (resolve) => {
        // eslint-disable-next-line no-restricted-syntax
        for (const f of fs) {
          // eslint-disable-next-line no-await-in-loop
          const res = await upload({ ...ctx, file: f });
          if (res && res.key) {
            resultStatus.success += 1;
          } else {
            resultStatus.error += 1;
            resultStatus.errorFiles.push(f);
          }
          progressInstance.render({
            total: resultStatus.total,
            completed: resultStatus.success,
          });
        }
        resolve(true);
      })
    );
  });

  await Promise.all(promiseAll);

  if (resultStatus.error !== 0) {
    const err = [...resultStatus.errorFiles];
    resultStatus.error = 0;
    resultStatus.errorFiles = [];
    resultStatus.reupload += 1;

    const st = await loopUpload(err, ctx);
    console.log({ st });
    return st;
  }
  return true;
};

const getExpValue = (exp, key) => {
  if (exp && key && exp[key]) {
    return exp[key];
  }
  return "-";
};

const main = async (files, exp) => {
  const t = Date.now();
  const { zone, cdnPath } = getQiniuConfig();

  const ctx = {
    config: {
      ...new qiniu.conf.Config(),
      zone,
    },
    token: getToken(),
    cdnPath,
  };

  if (exp && exp.PROJECT_NAME) {
    ctx.cdnPath += `${exp.PROJECT_NAME}/`;
  }

  if (exp && exp.PROJECT_VERSION) {
    ctx.cdnPath += `${exp.PROJECT_VERSION}/`;
  }

  resultStatus.total = files.length;
  const status = await loopUpload(files, ctx);

  if (!status) {
    outputLog(
      [
        `packageName: ${getExpValue(exp, "PROJECT_NAME")}`,
        `目录: ${getExpValue(exp, "PATH_DIR_NAME")}`,
        `版本: ${getExpValue(exp, "PROJECT_VERSION")}`,
        `环境: ${process.env.BUILD}`,
        `状态: Error !`,
        "cdn推送失败 请检查程序!",
      ],
      color.red
    );
    return;
  }

  outputLog(
    [
      `\n\nfiles: ${files.length} / success: ${resultStatus.success} / error: ${resultStatus.error} / reupload: ${resultStatus.reupload}`,
      `环境: ${process.env.BUILD}`,
      `cdn时长: ${(Date.now() - t) / 1000}s`,
      `--------`,
      `packageName: ${getExpValue(exp, "PROJECT_NAME")}`,
      `目录: ${getExpValue(exp, "PATH_DIR_NAME")}`,
      `版本: ${getExpValue(exp, "PROJECT_VERSION")}`,
      `状态: Success !`,
    ],
    color.green
  );
};

export default main;
