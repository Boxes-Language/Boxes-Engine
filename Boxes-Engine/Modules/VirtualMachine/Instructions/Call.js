// Call Instruction
export default (Core, chunk, instruction) => {
  const result = Core.MemoryManager.read(chunk.chunkMemoryAddress, 'Result')

  if (result.type === 'actionList') {
    if (chunk.actionData.calling === undefined) {
      if (chunk.returnedData.length < 1 && instruction.keys.length > 0) {
        Core.ChunkManager.createChildChunks(Core, chunk, instruction.keys.map((actions) => [actions]))

        return true
      } else {
        Core.ChunkManager.createChunk('chunk', chunk.workspaceID, { type: 'chunk', id: chunk.id, returnIndex: 0 }, [
          { name: 'Input', data: { type: 'list', value: chunk.returnedData }, lock: true },
          { name: 'Result', data: { type: 'empty', value: 'Empty' }, lock: true },
          { name: 'Local', data: { type: 'empty', value: 'Empty' }, lock: false }
        ], result.value, chunk.actionData.methods.includes('async'), { line: instruction.line, start: instruction.start })

        if (chunk.actionData.methods.includes('async')) {
          Core.MemoryManager.write(chunk.chunkMemoryAddress, 'Result', { type: 'empty', value: 'Empty' }, true)

          chunk.returnedData = []
        } else {
          chunk.actionData.calling = true
          chunk.returnedData = [undefined]

          return true
        }
      }
    } else {
      Core.MemoryManager.write(chunk.chunkMemoryAddress, 'Result', chunk.returnedData[0], true)

      chunk.actionData.calling = undefined
      chunk.returnedData = []
    }
  } else return createError(`Cannot Perform "Call" Operation On <${result.type}>`, chunk.callPath)
}

import { createError } from '../Error.js'
