import createInitCommand from '@mt/init'
import  './exception.js'
import createCIL from './createCLI.js'


export default function(args){
  const program = createCIL()
  createInitCommand(program)
  program.parse(process.argv)

}