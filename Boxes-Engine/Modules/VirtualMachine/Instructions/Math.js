// Math Instruction
export default (Core, chunk, instruction) => {
  if (chunk.returnedData.length < 1) {
    Core.ChunkManager.createChildChunks(Core, chunk, instruction.data.map((actions) => [actions]))

    return true
  } else {
    let result

    if (instruction.operation === 'add') {
      if (chunk.returnedData[0].type === 'number' && chunk.returnedData[1].type === 'number') result = { type: 'number', value: `${(+chunk.returnedData[0].value) + (+chunk.returnedData[1].value)}` }
      else if (chunk.returnedData[0].type === 'string' && chunk.returnedData[1].type === 'string')result = { type: 'string', value: chunk.returnedData[0].value + chunk.returnedData[1].value }
      else return { error: true, content: `Cannot Perform "Add" Operation On <${chunk.returnedData[0].type}> Using <${chunk.returnedData[1].type}>` }
    } else if (instruction.operation === 'subtract') {
      if (chunk.returnedData[0].type === 'number' && chunk.returnedData[1].type === 'number') result = { type: 'number', value: `${(+chunk.returnedData[0].value) - (+chunk.returnedData[1].value)}` }
      else return { error: true, content: `Cannot Perform "Subtract" Operation On <${chunk.returnedData[0].type}> Using <${chunk.returnedData[1].type}>` }
    } else if (instruction.operation === 'multiply') {
      if (chunk.returnedData[0].type === 'number' && chunk.returnedData[1].type === 'number') result = { type: 'number', value: `${(+chunk.returnedData[0].value) * (+chunk.returnedData[1].value)}` }
      else if (chunk.returnedData[0].type === 'string' && chunk.returnedData[1].type === 'number') {
        if (+chunk.returnedData[1].value > 0) result = { type: 'string', value: chunk.returnedData[0].value.repeat(+chunk.returnedData[1].value) }
        else result = { type: 'string', value: '' }
      } else return { error: true, content: `Cannot Perform "Multiply" Operation On <${chunk.returnedData[0].type}> Using <${chunk.returnedData[1].type}>` }
    } else if (instruction.operation === 'divide') {
      if (chunk.returnedData[0].type === 'number' && chunk.returnedData[1].type === 'number') {
        if (chunk.returnedData[1].value === '0') result = { type: 'number', value: `${(+chunk.returnedData[0].value) / (+chunk.returnedData[1].value)}` }
        else result = { type: 'empty', value: 'Empty' }
      }
      else return { error: true, content: `Cannot Perform "Divide" Operation On <${chunk.returnedData[0].type}> Using <${chunk.returnedData[1].type}>` }
    } else if (instruction.operation === 'equal') result = { type: 'boolean', value: ((chunk.returnedData[0].type === chunk.returnedData[1].type) && (chunk.returnedData[0].value === chunk.returnedData[1].value)) ? 'Yes' : 'No' }
    else {

    }

    Core.MemoryManager.write(chunk.chunkMemoryAddress, 'Result', result, true)
  }
}
