// Execute Action
export default (Core, chunk, action) => {
  let wait = false

  if (action.length > 1) {

  } else {
    if (action[0].type === 'data') {
      if (action[0].data.type === 'list' || action[0].data.type === 'inputList') {
        if (chunk.returnedData.length < 1) {
          createChildChunks(Core, chunk, action[0].data.value.map((actions) => [actions]))

          wait = true
        } else {
          Core.MemoryManager.write(chunk.chunkMemoryAddress, 'Result', { type: action[0].data.type, value: chunk.returnedData }, true)

          chunk.returnedData = []
        }
      } else Core.MemoryManager.write(chunk.chunkMemoryAddress, 'Result', action[0].data, true)
    } else if (action[0].type === 'set') {
      if (chunk.returnedData.length < 1) {
        createChildChunks(Core, chunk, [
          [action[0].target],
          [action[0].source]
        ])

        wait = true
      } else {
        const [target, source] = chunk.returnedData

        if (target.address === undefined) return { error: true, content: `Cannot Assign Value To The Target (Target Is Not In A Box)`, line: action[0].line, start: action[0].start }

        chunk.returnedData = []
      }
    } else if (action[0].type === 'get') {
      let data = getBox(Core, chunk, action[0].name, [])
      if (data.error) return { error: true, content: data.content, line: action[0].line, start: action[0].start }

      Core.MemoryManager.write(chunk.chunkMemoryAddress, 'Result', data)
    }
  } 

  if (!wait) chunk.currentAction++

  return { error: false, data: Core.MemoryManager.read(chunk.chunkMemoryAddress, 'Result') }
}

// Create Child Chunks
function createChildChunks (Core, chunk, chunks) {
  chunk.returnedData = chunks.map(() => undefined)

  chunks.forEach((actions, index) => {
    Core.ChunkManager.createChunk(chunk.workspaceID, { type: 'chunk', id: chunk.id, returnIndex: index }, [
      { name: 'Input', data: Core.MemoryManager.read(chunk.chunkMemoryAddress, 'Input'), lock: true },
      { name: 'Result', data: Core.MemoryManager.read(chunk.chunkMemoryAddress, 'Result'), lock: true },
      { name: 'Local', data: { type: 'link', address: { chunkID: chunk.chunkMemoryAddress, name: 'Local', path: [] }}, lock: false }
    ], actions, false)
  })
}

import setBox from './SetBox.js'
import getBox from './GetBox.js'
