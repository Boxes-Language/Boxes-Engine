// Execute Action
export default (Core, chunk, action) => {
  let wait = false

  const instruction = action[chunk.actionData.index]

  if (instruction.type === 'data') {
    const result = instruction_data(Core, chunk, instruction)

    if (typeof result === 'object') return result

    wait = result === true
  } else if (instruction.type === 'get') {
    const result = instruction_get(Core, chunk, instruction)

    if (typeof result === 'object') return result
  } else if (instruction.type === 'read') {
    const result = instruction_read(Core, chunk, instruction)

    if (typeof result === 'object') return result

    wait = result === true
  } else if (instruction.type === 'set') {
    const result = instruction_set(Core, chunk, instruction)

    if (typeof result === 'object') return result

    wait = result === true
  }

  if (!wait) {
    if (chunk.actionData.index < action.length-1) {
      chunk.actionData.index++
    } else chunk.currentAction++
  }

  return { error: false, data: Core.MemoryManager.read(chunk.chunkMemoryAddress, 'Result') }
}

import { instruction_read } from './Instructions/Read.js'
import { instruction_get } from './Instructions/Get.js'
import { instruction_set } from './Instructions/Set.js'
import instruction_data from './Instructions/Data.js'
