// https://coolors.co/eec643-141414-eef0f2-0d21a1-011638

import { VirtualMachine, Compiler } from '../../Boxes-Engine/API.js'

const executable = (await new Compiler()
  .compile(
`
+count <- 0

+@main <- (1000, count) : { count }
`
  ))

// console.log(JSON.stringify(executable, null, 2))

// Execute
async function execute () {
  const vm = new VirtualMachine()
  
  console.log('Finished', await vm.start(executable.data))
}

execute()
