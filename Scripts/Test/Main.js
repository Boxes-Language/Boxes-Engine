// https://coolors.co/eec643-141414-eef0f2-0d21a1-011638

import { VirtualMachine, Compiler } from '../../Boxes-Engine/API.js'

const executable = (await new Compiler()
  .compile(`+@a <- a[1]`)).data

console.log(JSON.stringify(executable, null, 2))

// Execute
async function execute () {
  const vm = new VirtualMachine()
  
  console.log('Finished', await vm.start(executable))
}

// execute()
