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
      else return createError(`Cannot Perform "Add" Operation On <${chunk.returnedData[0].type}> Using <${chunk.returnedData[1].type}>`, chunk.callPath).addCallPath({ line: instruction.line, start: instruction.start })
    } else if (instruction.operation === 'subtract') {
      if (chunk.returnedData[0].type === 'number' && chunk.returnedData[1].type === 'number') result = { type: 'number', value: `${(+chunk.returnedData[0].value) - (+chunk.returnedData[1].value)}` }
      else return createError(`Cannot Perform "Subtract" Operation On <${chunk.returnedData[0].type}> Using <${chunk.returnedData[1].type}>`, chunk.callPath).addCallPath({ line: instruction.line, start: instruction.start })
    } else if (instruction.operation === 'multiply') {
      if (chunk.returnedData[0].type === 'number' && chunk.returnedData[1].type === 'number') result = { type: 'number', value: `${(+chunk.returnedData[0].value) * (+chunk.returnedData[1].value)}` }
      else if (chunk.returnedData[0].type === 'string' && chunk.returnedData[1].type === 'number') {
        if (+chunk.returnedData[1].value > 0) result = { type: 'string', value: chunk.returnedData[0].value.repeat(+chunk.returnedData[1].value) }
        else result = { type: 'string', value: '' }
      } else return createError(`Cannot Perform "Multiply" Operation On <${chunk.returnedData[0].type}> Using <${chunk.returnedData[1].type}>`, chunk.callPath).addCallPath({ line: instruction.line, start: instruction.start })
    } else if (instruction.operation === 'divide') {
      if (chunk.returnedData[0].type === 'number' && chunk.returnedData[1].type === 'number') {
        if (chunk.returnedData[1].value === '0') result = { type: 'empty', value: 'Empty' }
        else result = { type: 'number', value: `${(+chunk.returnedData[0].value) / (+chunk.returnedData[1].value)}` }
       } else return createError(`Cannot Perform "Divide" Operation On <${chunk.returnedData[0].type}> Using <${chunk.returnedData[1].type}>`, chunk.callPath).addCallPath({ line: instruction.line, start: instruction.start })
    } else if (instruction.operation === 'equal') result = { type: 'boolean', value: ((chunk.returnedData[0].type === chunk.returnedData[1].type) && (chunk.returnedData[0].value === chunk.returnedData[1].value)) ? 'Yes' : 'No' }
    else if (['greater', 'greaterEqual', 'less', 'lessEqual'].includes(instruction.operation)) {
      if (chunk.returnedData[0].type === 'number' && chunk.returnedData[1].type === 'number') {
        if (instruction.operation === 'greater') result = { type: 'boolean', value: ((+chunk.returnedData[0].value) > (+chunk.returnedData[1].value)) ? 'Yes' : 'No' }
        else if (instruction.operation === 'greaterEqual') result = { type: 'boolean', value: ((+chunk.returnedData[0].value) >= (+chunk.returnedData[1].value)) ? 'Yes' : 'No' }
        else if (instruction.operation === 'less') result = { type: 'boolean', value: ((+chunk.returnedData[0].value) < (+chunk.returnedData[1].value)) ? 'Yes' : 'No' }
        else if (instruction.operation === 'lessEqual') result = { type: 'boolean', value: ((+chunk.returnedData[0].value) <= (+chunk.returnedData[1].value)) ? 'Yes' : 'No' }
      } else return createError(`Cannot Perform "${['Is Greater', 'Is Greater Or Equal', 'Is Less', 'Is Less Or Equal'][['greater', 'greaterEqual', 'less', 'lessEqual'].indexOf(instruction.operation)]}" Operation On <${chunk.returnedData[0].type}> Using <${chunk.returnedData[1].type}>`, chunk.callPath).addCallPath({ line: instruction.line, start: instruction.start })
    } else if (instruction.operation === 'and' || instruction.operation === 'or') {
      if (chunk.returnedData[0].type === 'boolean' && chunk.returnedData[1].type === 'boolean') {
        if (instruction.operation === 'and') result = { type: 'boolean', value: (chunk.returnedData[0].value === 'Yes' && chunk.returnedData[1].value === 'Yes') ? 'Yes' : 'No' }
        else if (instruction.operation === 'or') result = { type: 'boolean', value: (chunk.returnedData[0].value === 'Yes' || chunk.returnedData[1].value === 'Yes') ? 'Yes' : 'No' }
      } else return createError(`Cannot Perform "${['And', 'Or'][['and', 'or'].indexOf(instruction.operation)]}" Operation On <${chunk.returnedData[0].type}> Using <${chunk.returnedData[1].type}>`, chunk.callPath).addCallPath({ line: instruction.line, start: instruction.start })
    } else if (instruction.operation === 'not') {
      if (chunk.returnedData[0].type === 'boolean') result = { type: 'boolean', value: (chunk.returnedData[0].value === 'Yes') ? 'No' : 'Yes' }
      else return createError(`Cannot Perform "Not" Operation On <${chunk.returnedData[0].type}>`, chunk.callPath).addCallPath({ line: instruction.line, start: instruction.start })
    }

    Core.MemoryManager.write(chunk.chunkMemoryAddress, 'Result', result, true)
  }
}

import { createError } from '../Error.js' 
