// https://coolors.co/eec643-141414-eef0f2-0d21a1-011638

import { VirtualMachine, Compiler } from '../../Boxes-Engine/API.js'

const executable = (await new Compiler()
  .compile(
`
# +@getNumber <- { 1 }

+@main <- 1 == 1
`
  ))

console.log(executable)

// Execute
async function execute () {
  const vm = new VirtualMachine()
  
  console.log('Finished', await vm.start(executable.data))
}

execute()
