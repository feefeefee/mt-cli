#! /usr/bin/env node 

import  importLocal from 'import-local'
import {log} from '@mt/utils'
// import {fileURLToPath} from 'node:url'
import {filename} from 'dirname-filename-esm'

import entry  from '../lib/index.js'

// const __filename = fileURLToPath(import.meta.url)
const __filename = filename(import.meta)

if(importLocal(__filename)){
  log.info('cli',"使用本次 cli-mt 版本")
}else{
  entry(process.argv.slice(2))
}
