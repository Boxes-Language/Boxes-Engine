// https://coolors.co/eec643-141414-eef0f2-0d21a1-011638

import { VirtualMachine, Compiler } from '../../Boxes-Engine/API.js'

const executable = (await new Compiler()
  .compile(`+a <- 1`)).data

// Execute
async function execute () {
  const vm = new VirtualMachine({ executionInterval: 500 })
  
  console.log(await vm.start(executable))
}

execute()
