import path from "node:path";
import { pathExistsSync } from "path-exists";
import fse from "fs-extra";
import ora from "ora";
import { execa } from "execa";
import download from "download-git-repo";
import { printErrorLog, log } from "@mt/utils";
import chalk from 'chalk'

// 获得缓存目录
function getCacheDir(targetPath) {
  return path.resolve(targetPath, "node_modules");
}

// 创建缓存目录
function makeCacheDir(targetPath) {
  const cacheDir = getCacheDir(targetPath);
  //判断缓存目录是否存在
  if (!pathExistsSync(cacheDir)) {
    // 如果不存在就创建
    fse.mkdirpSync(cacheDir); //如果这个目录下任何路径都不存在,就去创建这个目录
  }
}

//下载模板
async function downloadAddTemplate(targetPath, selectedTemplate, name) {
  const cwd = targetPath; //缓存目录

  log.verbose("cwd", cwd);

  download(
    "direct:https://gitee.com/beiyaoyaoyao/express-template.git",
    name,
    { clone: true },
    (err) => {
      if (!err) {
        log.success("下载模板成功");
        console.log(chalk.blue.bold("Done!"), chalk.bold("you run:"));
        console.log("cd " + name);
        console.log("npm install ");
        console.log("npm run dev ");
      } else {
        log.error("代码下载失败", err);
      }
    }
  );
}

//下载模板
export default async function downloadTemplate(selectedTemplate) {
  const { targetPath, template, name } = selectedTemplate;

  makeCacheDir(targetPath);

  const spinner = ora("正在下载模板...").start();
  try {
    await downloadAddTemplate(targetPath, template, name);
    spinner.stop();
  } catch (e) {
    spinner.stop();
    printErrorLog(e);
  }
}
