export { get, instruction_get }

// Get
function get (Core, chunk, name, path) {
  let data
  let memoryChunkID

  data = Core.MemoryManager.read(chunk.workspaceMemoryAddress, name)
  memoryChunkID = chunk.workspaceMemoryAddress
 
  if (data === undefined) {
    data = Core.MemoryManager.read(chunk.chunkMemoryAddress, name)
    memoryChunkID = chunk.chunkMemoryAddress
  }

  if (data === undefined) return { error: true, content: `Box Not Found: "${name}"` }

  if (path.length > 0) {
    for (let key of path) {
      if (data.type === 'list') data = data.value[key]
      else if (data === undefined) return { error: true, content: `Cannot Read ${key} from <none>` }
      else return { error: true, content: `Cannot Read ${key} from <${data.type}>` }
    }
  }

  if (data.type === 'link') return get(Core, chunk, data.value.name, data.value.path)

  return { error: false, data: { type: data.type, value: data.value, address: { chunkID: memoryChunkID, name, path: [] }}}
}

// Get Instruction
function instruction_get (Core, chunk, instruction) {
  const data = get(Core, chunk, instruction.name, [])

  if (data.error) return { error: true, content: data.content, line: instruction.line, start: instruction.start }

  Core.MemoryManager.write(chunk.chunkMemoryAddress, 'Result', data.data, true)
}
