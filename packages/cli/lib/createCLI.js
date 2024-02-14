
import path from 'node:path'
import {program} from 'commander'
import {dirname} from 'dirname-filename-esm'
import chalk from 'chalk'
import semver from 'semver'
import fse from 'fs-extra'
import {log} from '@mt/utils'

const __dirname = dirname(import.meta)
const pkgPath = path.resolve(__dirname,'../package.json')


const pkg = fse.readJSONSync(pkgPath)

/**最低node版本支持 */
const LOWEST_NODE_VERSION = '14.0.0'

/**检查node版本 */
function checkNodeVersion(){
  log.verbose('node version',process.version)
  if(!semver.gte(process.version , LOWEST_NODE_VERSION)){
    throw new Error(chalk.red(`cli-mt 需要安装${LOWEST_NODE_VERSION}以上版本的Node.js`))
  }

}

function preAction(){
  // 检查node版本
  checkNodeVersion()
}


export default function createCIL(){
  log.info('version', pkg.version)

  // 初始化
  program
  .name(Object.keys(pkg.bin)[0]) //拿取脚手架名称
  .usage('<command> [options]') //设置使用说明
  .version(pkg.version)
  .option('-d, --debug','是否开启调式模式',false)
  .hook('preAction',preAction)

  /*
  当用户使用debug参数启动时触发，
  'option:<name>'：当用户使用一个选项时触发，其中 <name> 是选项的名称。
  */
  program.on('option:debug',function(){
    if(program.opts().debug){
      log.verbose('debug','launch debug mode')
    }
  })
  // 当匹配不到任何命令时触发
  program.on('command:*',function(obj){
    log.error('未知的命令' + obj[0])
  })


  return program
}