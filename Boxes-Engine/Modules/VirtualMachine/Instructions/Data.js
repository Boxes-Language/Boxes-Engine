// Data Instruction
export default (Core, chunk, instruction) => {
  if (instruction.data.type === 'link') {
    if (chunk.returnedData.length < 1) {
      Core.ChunkManager.createChildChunks(Core, chunk, [instruction.data.value])

      return true
    } else {
      if (chunk.returnedData[0].address === undefined) return { error: true, content: `Cannot Link <${chunk.returnedData[0].type}> (Target Is Not In A Box)` }

      Core.MemoryManager.write(chunk.chunkMemoryAddress, 'Result', { type: 'link', value: chunk.returnedData[0].address }, true)

      chunk.returnedData = []
    }
  } else if (instruction.data.type === 'list' || instruction.data.type === 'inputList') {
    if (chunk.returnedData.length < 1) {
      if (instruction.data.value.length > 0) {
        Core.ChunkManager.createChildChunks(Core, chunk, instruction.data.value.map((actions) => [actions]))

        return true
      } else Core.MemoryManager.write(chunk.chunkMemoryAddress, 'Result', { type: instruction.data.type, value: [] }, true)
    } else {
      Core.MemoryManager.write(chunk.chunkMemoryAddress, 'Result', { type: instruction.data.type, value: chunk.returnedData }, true)

      chunk.returnedData = []
    }
  } else Core.MemoryManager.write(chunk.chunkMemoryAddress, 'Result', instruction.data, true)
}
