// Execute Action
export default (Core, chunk, action) => {
  if (action.length > 1) {

  } else {
    if (action[0].type === 'set') {
      if (chunk.actionData.state === undefined) {
        chunk.actionData = { state: 'waitingTarget', target: undefined, source: undefined }

        Core.ChunkManager.createChunk(chunk.workspaceID, { type: 'chunk', id: chunk.id }, Core.MemoryManager.read(chunk.chunkMemoryAddress, 'Input').value, [action[0].target], false)

        return { error: false }
      } else {

      }
    } else if (action[0].type === 'get') {
      let data
      let memoryChunkID

      data = Core.MemoryManager.read(chunk.workspaceMemoryAddress, action[0].name)
      memoryChunkID = chunk.workspaceMemoryAddress
 
      if (data === undefined) {
        data = Core.MemoryManager.read(chunk.chunkMemoryAddress, action[0].name)
        memoryChunkID = chunk.chunkMemoryAddress
      }

      if (data === undefined) return { error: true, content: `Box Not Found: "${action[0].name}"`, line: action[0].line, start: action[0].start }

      Core.MemoryManager.write(chunk.id, chunkMemoryAddress, 'Result', { type: data.type, value: data.value, address: { chunkID: memoryChunkID, name: action[0].name, path: [] }})
    }

  } 
  chunk.currentAction++

  return { error: false }
}
