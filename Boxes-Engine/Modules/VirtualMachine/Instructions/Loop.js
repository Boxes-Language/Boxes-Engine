// Loop Instruction
export default (Core, chunk, instruction) => {
  if (chunk.actionData.calling === undefined) {
    if (chunk.returnedData.length < 1 && chunk.actionData.static !== true) {
      Core.ChunkManager.createChildChunks(Core, chunk, instruction.condition.map((actions) => [actions]))

      return true
    } else {
      let loop = false

      if (chunk.actionData.static === true) chunk.returnedData = chunk.actionData.staticData

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
      } else return createError(`Cannot Perform "Loop" Operation On <${chunk.returnedData[0].type}>`, chunk.callPath).addCallPath({ line: instruction.line, start: instruction.start })
      if (loop) {
        if (chunk.returnedData[1] !== undefined) {
          if (chunk.returnedData[1].address === undefined) return { error: true, content: `Cannot Assign Value To The Target (Target Is Not In A Box)`, line: instruction.line, start: instruction.start }

          const result = set(Core, chunk.returnedData[1].address, { type: 'number', value: `${chunk.actionData.count}` })
          if (result.error) {
            if (result.content === 'Locked') return createError(`Box Named "${target.address.name}" Is Locked (Cannot Assign Value To A Locked Box)`, chunk.callPath).addCallPath({ line: instruction.line, start: instruction.start }) 
            return result
          }
        }

        if (chunk.actionData.static === undefined && chunk.returnedData[0].address === undefined) {
          chunk.actionData.static = true
          chunk.actionData.staticData = chunk.returnedData
        }

        Core.ChunkManager.createChildChunks(Core, chunk, [instruction.actionList])

        chunk.actionData.calling = true

        return true
      } else {
        chunk.returnedData = []

        chunk.actionData.static = undefined
        chunk.actionData.count = undefined
        chunk.actionData.calling = undefined
      }
    }
  } else {
    Core.MemoryManager.write(chunk.chunkMemoryAddress, 'Result', chunk.returnedData[0], true)

    chunk.returnedData = []

    chunk.actionData.calling = undefined

    return true
  }
}

import { createError } from '../Error.js'

import { set } from './Set.js'
