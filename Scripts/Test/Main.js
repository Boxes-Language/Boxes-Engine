// https://coolors.co/eec643-141414-eef0f2-0d21a1-011638

import { VirtualMachine, Compiler } from '../../Boxes-Engine/API.js'

const executable = (await new Compiler()
  .compile(
`
+@main <- (1000) : {}
`
  ))

// console.log(JSON.stringify(executable, null, 2))

// Execute
async function execute () {
  const vm = new VirtualMachine()

  const start = performance.now()
  
  console.log('Finished', await vm.start(executable.data), parseFloat((performance.now()-start)/1000).toFixed(2))
}

execute()
