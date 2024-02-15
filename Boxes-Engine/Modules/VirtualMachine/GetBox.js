// Get Box
export default (Core, chunk, name, path) => {
  let data
  let memoryChunkID

  data = Core.MemoryManager.read(chunk.workspaceMemoryAddress, action[0].name)
  memoryChunkID = chunk.workspaceMemoryAddress
 
  if (data === undefined) {
    data = Core.MemoryManager.read(chunk.chunkMemoryAddress, action[0].name)
    memoryChunkID = chunk.chunkMemoryAddress
  }

  if (data === undefined) return { error: true, content: `Box Not Found: "${action[0].name}"` }

  if (path.length > 0) {
    for (let key of path) {
      if (data.type === 'list') {

      } else return { error: true, content: `Cannot Read ${path[0]} from <${data.type}>` }
    }
  }

  return { error: false, data: { type: data.type, value: data.value, address: { chunkID: memoryChunkID, name, path: [] }}}
}
