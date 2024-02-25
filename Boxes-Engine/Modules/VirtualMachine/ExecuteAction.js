// Execute Action
export default (Core, chunk, action) => {
  let wait = false

  const instruction = action[chunk.actionData.currentIndex]

  if (instruction.type === 'data') {
    const result = instruction_data(Core, chunk, instruction)

    if (typeof result === 'object') return result

    wait = result === true
  } else if (instruction.type === 'method') chunk.actionData.methods.push(instruction.name)
  else if (instruction.type === 'get') {
    const result = instruction_get(Core, chunk, instruction)

    if (typeof result === 'object') return result
  } else if (instruction.type === 'set') {
    const result = instruction_set(Core, chunk, instruction)

    if (typeof result === 'object') return result

    wait = result === true
  } else if (instruction.type === 'read') {
    const result = instruction_read(Core, chunk, instruction)

    if (typeof result === 'object') return result

    wait = result === true
  } else if (instruction.type === 'call') {
    const result = instruction_call(Core, chunk, instruction)

    if (typeof result === 'object') return result

    wait = result === true
  } else if (instruction.type === 'math') {
    const result = instruction_math(Core, chunk, instruction)

    if (typeof result === 'object') return result

    wait = result === true
  } else if (instruction.type === 'ifElse') {
    const result = instruction_ifElse(Core, chunk, instruction)

    if (typeof result === 'object') return result

    wait = result === true
  } else if (instruction.type === 'loop') {
    const result = instruction_loop(Core, chunk, instruction)

    if (typeof result === 'object') return result

    wait = result === true
  }

  if (!wait) {
    if (chunk.actionData.currentIndex < action.length-1) {
      chunk.actionData.currentIndex++
    } else {
      chunk.currentAction++

      chunk.actionData.currentIndex = 0
      chunk.actionData.methods = []
    }
  }

  return { error: false, data: Core.MemoryManager.read(chunk.chunkMemoryAddress, 'Result') }
}

import { instruction_read } from './Instructions/Read.js'
import instruction_ifElse from './Instructions/IfElse.js'
import { instruction_get } from './Instructions/Get.js'
import { instruction_set } from './Instructions/Set.js'
import instruction_call from './Instructions/Call.js'
import instruction_data from './Instructions/Data.js'
import instruction_math from './Instructions/Math.js'
import instruction_loop from './Instructions/Loop.js' 
