export { set, instruction_set }

// Set
function set (Core, address, data) {
  let target = Core.MemoryManager.read(address.chunkID, address.name)

  if (address.path.length > 0) {
    for (let i = 0; i < address.path.length - 1; i++) target = target.value[address.path[i]]

    if (data.type === 'fire') target.value.splice(address.path[address.path.length-1], 1)
    else target.value[address.path[address.path.length-1]] = data

    return Core.MemoryManager.write(address.chunkID, address.name, target)
  }

  if (data.type === 'fire') {
    Core.MemoryManager.delete(address.chunkID, address.name)

    return { error: false }
  } else return Core.MemoryManager.write(address.chunkID, address.name, target)
}

// Set Instruction
function instruction_set (Core, chunk, instruction) {
  if (chunk.returnedData.length < 1) {
    Core.ChunkManager.createChildChunks(Core, chunk, [
      [instruction.target],
      [instruction.source]
    ])

    return true
  } else {
    const [target, source] = chunk.returnedData

    if (target.address === undefined) return { error: true, content: `Cannot Assign Value To The Target (Target Is Not In A Box)`, line: instruction.line, start: instruction.start }

    const result = set(Core, target.address, source)
    if (result.error) {
      if (result.content === 'Locked') return { error: true, content: `Box Named "${target.address.name}" Is Locked (Cannot Assign Value To A Locked Box)`, line: instruction.line, start: instruction.start }

      return result
    }

    chunk.returnedData = []

    Core.MemoryManager.write(chunk.chunkMemoryAddress, 'Result', source, true)
  }
}
