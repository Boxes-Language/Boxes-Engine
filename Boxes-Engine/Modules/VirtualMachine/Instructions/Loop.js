// Loop Instruction
export default (Core, chunk, instruction) => {
  if (chunk.actionData.calling === undefined) {
    if (chunk.returnedData.length < 1) {
      Core.ChunkManager.createChildChunks(Core, chunk, instruction.condition.map((actions) => [actions]))

      return true
    } else {
      let loop = false

      if (chunk.returnedData[0].type === 'boolean') {
        if (chunk.returnedData[0].value === 'Yes') {
          chunk.actionData.count = 0 

          loop = true
        }
      } else if (chunk.returnedData[0].type === 'number') {
        if (chunk.actionData.count === undefined) chunk.actionData.count = 0

        if (chunk.actionData.count < +chunk.returnedData[0].value) {
          chunk.actionData.count++

          loop = true
        }
      } else return { error: true, content: `Cannot Perform "Loop" Operation On <${chunk.returnedData[0].type}>`, line: instruction.line, start: instruction.start }

      if (loop) {
        if (chunk.returnedData[1] !== undefined) {
          if (chunk.returnedData[1].address === undefined) return { error: true, content: `Cannot Assign Value To The Target (Target Is Not In A Box)`, line: instruction.line, start: instruction.start }

          const result = set(Core, chunk.returnedData[1].address, { type: 'number', value: `${chunk.actionData.count}` })
          if (result.error) {
            if (result.content === 'Locked') return { error: true, content: `Box Named "${target.address.name}" Is Locked (Cannot Assign Value To A Locked Box)`, line: instruction.line, start: instruction.start }

            return result
          }
        }

        Core.ChunkManager.createChildChunks(Core, chunk, [instruction.actionList])

        chunk.actionData.calling = true

        return true
      }
    }
  } else {
    Core.MemoryManager.write(chunk.chunkMemoryAddress, 'Result', chunk.returnedData[0], true)

    chunk.returnedData = []

    chunk.actionData.calling = undefined

    return true
  }
}

import { set } from './Set.js'