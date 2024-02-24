// If Else Instruction
export default (Core, chunk, instruction) => {
  //console.log(chunk)

  if (chunk.actionData.calling === undefined) {
    if (chunk.returnedData.length < 1) {
      if (instruction.condition.length > 0) Core.ChunkManager.createChildChunks(Core, chunk, [instruction.condition])
      else chunk.returnedData = [{ type: 'boolean', value: 'False' }]

      return true
    } else {
      if (chunk.returnedData[0].type === 'boolean') {
        if (chunk.returnedData[0].value === 'Yes') {
          Core.ChunkManager.createChildChunks(Core, chunk, [instruction.ifActionList])

          chunk.actionData.calling = true

          return true
        } else if (instruction.elseActionList.length > 0) {
          console.log(instruction.elseActionList)
          Core.ChunkManager.createChildChunks(Core, chunk, [instruction.elseActionList])

          chunk.actionData.calling = true

          return true
        }
      } else return { error: true, content: `Cannot Perform "If" Operation Using <${chunk.returnedData[0].type}>`, line: instruction.line, start: instruction.start }
    }
  } else {
    Core.MemoryManager.write(chunk.chunkMemoryAddress, 'Result', chunk.returnedData[0], true)

    chunk.actionData.calling = undefined
    chunk.returnedData = []  
  }
}
