export { set, instruction_set }

// Set
function set (Core, address, data) {
  if (address.path.length > 0) {
    let target = Core.MemoryManager.read(address.chunkID, address.name)

    for (let i = 0; i < address.path.length - 1; i++) target = target.value[address.path[i]]

    if (data.type === 'fire') target.value.splice(address.path[address.path.length-1], 1)
    else target.value[address.path[address.path.length-1]] = data

    const result = Core.MemoryManager.write(address.chunkID, address.name, target)
    
    if (result.error) {
      if (result.content === 'Not Found') return { error: true, content: `Box Not Found: "${address.name}"` }
      else if (result.content === 'Locked') return { error: true, content: `Box Named "${target.address.name}" Is Locked (Cannot Assign Value To A Locked Box)` }
    }

    return { error: false }
  }

  if (data.type === 'fire') {
    Core.MemoryManager.delete(address.chunkID, address.name)

    return { error: false }
  } else {
    const result = Core.MemoryManager.write(address.chunkID, address.name, data)
    
    if (result.error) {
      if (result.content === 'Not Found') return { error: true, content: `Box Not Found: "${address.name}"` }
      else if (result.content === 'Locked') return { error: true, content: `Box Named "${target.address.name}" Is Locked (Cannot Assign Value To A Locked Box)` }
    }

    return { error: false }
  }
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
    if (result.error) return createError(result.content, chunk.callPath).addCallPath({ line: instruction.line, start: instruction.start})

    chunk.returnedData = []

    Core.MemoryManager.write(chunk.chunkMemoryAddress, 'Result', source, true)
  }
}

import { createError } from '../Error.js' 
