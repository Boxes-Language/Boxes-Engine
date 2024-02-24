export { read, instruction_read }

// Read
function read (data, path) {
  for (let key of path) {
    if (data === undefined) return { error: true, content: 'Cannot Perform "Read" Operation On <none>' }
    else if (data.type === 'string' || data.type === 'list') {
      if (Array.isArray(key)) {
        if (data.type === 'string') data.value = data.value.substring(key[0], key[1]+1)
        else {
          if (key[1] > key[0])  {
            const chunk = []

            const start = Math.min(key[0], key[1])
            const end = Math.max(key[0], key[1])

            for (let i = start; i <= end; i++) {
              if (data.value[i] !== undefined) chunk.push(data.value[i])
            }

            data.value = chunk
          }
        }

        data.address = undefined
      } else {
        if (data.type === 'string') data = { type: 'string', value: data.value[key] }
        else {
          if (data.address !== undefined) data.address.path.push(key)

          if (data.value[key] === undefined) data = { type: 'empty', value: 'Empty' }
          else {
            data.type = data.value[key].type
            data.value = data.value[key].value
          }
        }
      }
    } else return { error: true, content: `Cannot Perform "Read" Operation On <${data.type}>` }
  }

  return { error: false, data }
}

// Read Instruction
function instruction_read (Core, chunk, instruction) {
  if (chunk.returnedData.length < 1) {
    Core.ChunkManager.createChildChunks(Core, chunk, instruction.keys.map((actions) => [actions]))

    return true
  } else {
    let result = Core.MemoryManager.read(chunk.chunkMemoryAddress, 'Result')

    let path

    if (chunk.returnedData[0].type === 'number') {
      if (chunk.returnedData.length > 1) {
        if (chunk.returnedData[1].type === 'number') path = [[+chunk.returnedData[0].value, +chunk.returnedData[1].value]]
        else return { error: true, content: `Cannot Perform "Read" Operation Using <${chunk.returnedData[1].type}>`, line: instruction.line, start: instruction.start }
      } else path = [+chunk.returnedData[0].value]
    } else if (chunk.returnedData[0].type === 'list') {
      path = []

      for (let i = 0; i < chunk.returnedData[0].value.length; i++) {
        if (chunk.returnedData[0].value[i].type === 'number') path.push(+chunk.returnedData[0].value[i].value)
        else return { error: true, content: `Cannot Perform "Read" Operation Using [${chunk.returnedData[0].value.map((data) => `<${data.type}>`).join(', ')}] (Item ${i} Is A <${chunk.returnedData[0].value[i].type}>, Expecting A <number>)`, line: instruction.line, start: instruction.start }
      }
    } else return { error: true, content: `Cannot Perform "Read" Operation Using <${chunk.returnedData[0].type}>`, line: instruction.line, start: instruction.start }

    result = read(result, path)
    if (result.error) return result

    Core.MemoryManager.write(chunk.chunkMemoryAddress, 'Result', result.data, true)

    chunk.returnedData = []
  }
}
