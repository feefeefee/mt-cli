import path from 'node:path';
import fse from 'fs-extra';
import { pathExistsSync } from 'path-exists';
import ora from 'ora';
// import ejs from 'ejs';
// import glob from 'glob';
import { log, makeList, makeInput } from '@mt/utils';

function getCacheFilePath(targetPath, template) {
  return path.resolve(targetPath, 'node_modules', template.npmName, 'template');
}

function getPluginFilePath(targetPath, template) {
  return path.resolve(targetPath, 'node_modules', template.npmName, 'plugins', 'index.js');
}

// 拷贝文件
function copyFile(targetPath, template, installDir) {
  //获取原始文件
  const originFile = getCacheFilePath(targetPath, template);
  // 读取该目录下所有文件
  const fileList = fse.readdirSync(originFile);
  const spinner = ora('正在拷贝模板文件...').start();
  fileList.map(file => {
    // 逐一拷贝
    fse.copySync(`${originFile}/${file}`, `${installDir}/${file}`);
  });
  spinner.stop();
  log.success('模板拷贝成功');
}

async function ejsRender(targetPath, installDir, template, name) {
  log.verbose('ejsRender', installDir, template);
  const { ignore } = template;
  // 执行插件
  let data = {};
  const pluginPath = getPluginFilePath(targetPath, template);
  if (pathExistsSync(pluginPath)) {
    const pluginFn = (await import(pluginPath)).default;
    const api = {
      makeList,
      makeInput,
    }
    data = await pluginFn(api);
  }
  const ejsData = {
    data: {
      name, // 项目名称
      ...data,
    }
  }
  glob('**', {
    cwd: installDir,
    nodir: true,
    ignore: [
      ...ignore,
      '**/node_modules/**',
    ],
  }, (err, files) => {
    files.forEach(file => {
      const filePath = path.join(installDir, file);
      log.verbose('filePath', filePath);
      ejs.renderFile(filePath, ejsData, (err, result) => {
        if (!err) {
          fse.writeFileSync(filePath, result);
        } else {
          log.error(err);
        }
      });
    });
  });
}

//安装模板
export default async function installTemplate(selectedTemplate, opts) {
  const { force = false } = opts;  
  const { targetPath, name, template } = selectedTemplate;
  const rootDir = process.cwd(); //当前根路径

  fse.ensureDirSync(targetPath); // 确保targetPath这个目录是存在的
  const installDir = path.resolve(`${rootDir}/${name}`);
  
  // 判断这个目录是否存在
  if (pathExistsSync(installDir)) {
    //是否强制安装
    if (!force) {
      log.error(`当前目录下已存在 ${installDir} 文件夹`);
      return;
    } else {
      //强制安装
      fse.removeSync(installDir);  // 移除目录
      fse.ensureDirSync(installDir);// 再装回来
    }
  } else {
    fse.ensureDirSync(installDir);
  }
  copyFile(targetPath, template, installDir);
  // await ejsRender(targetPath, installDir, template, name);
}
