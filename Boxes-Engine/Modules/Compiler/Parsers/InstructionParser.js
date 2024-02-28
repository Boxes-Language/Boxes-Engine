export default parseInstruction

import splitArray from '../../Tools/SplitArray.js'
import checkFragment from '../CheckFragment.js'

const expressionOperators = ['+', '-', '*', '/', '==', '!=', '>', '>=', '<', '<=', '&&', '||']

// Parse Instruction
function parseInstruction (fragments) {
  let instructions = []

  if (fragments.length > 1) {
    if (fragments.filter((fragment) => fragment.type === 'operator' && fragment.value === '=').length > 0) {
      for (let [index, fragment] of fragments.filter((fragment) => fragment.type === 'operator' && fragment.value === '=').entries()) {
        if (index > 0) return { error: true, content: `Unexpected "=" <operator>`, line: fragment.line, start: fragment.start }
      }

      const operator = fragments.filter((fragment) => fragment.type === 'operator' && fragment.value === '=')[0]

      const chunks = splitArray(fragments, (fragment) => fragment.type === 'operator' && fragment.value === '=')

      for (let [index, fragments2] of chunks.entries()) {
        if (fragments2.length < 1) return { error: true, content: `Expecting <any> (${(index > 0) ? 'After' : 'Before'} The <operator> "=")`, line: operator.line, start: operator.start }

        const instructions2 = parseInstruction(fragments2)
        if (instructions2.error) return instructions2

        chunks[index] = instructions2.data
      }

      instructions = [{ type: 'set', target: chunks[0], source: chunks[1], line: operator.line, start: operator.start }]
    } else if (fragments.filter((fragment) => fragment.type === 'operator' && expressionOperators.includes(fragment.value)).length > 0) {
      let operator

      for (let [index, fragment] of fragments.filter((fragment) => fragment.type === 'operator' && expressionOperators.includes(fragment.value)).entries()) {
        if (index > 0) return { error: true, content: `Unexpected "${fragment.value}" <operator> (There Should Only Be One <operator> In The Expression)`, line: fragment.line, start: fragment.start }
        else operator = fragment
      }

      let chunks = splitArray(fragments, (fragment) => fragment.type === 'operator' && expressionOperators.includes(fragment.value))

      for (let [index, fragments2] of chunks.entries()) {
        if (fragments2.length < 1) return { error: true, content: `Expecting <any> (${(index > 0) ? 'After' : 'Before'} The <operator> "${operator.value}")`, line: operator.line, start: operator.start }

        const instructions2 = parseInstruction(fragments2)
        if (instructions2.error) return instructions2

        chunks[index] = instructions2.data
      }

      instructions = [{ type: 'math', operation: ['add', 'subtract', 'multiply', 'divide', 'equal', 'notEqual', 'greater', 'greaterEqual', 'less', 'lessEqual', 'and', 'or'][expressionOperators.indexOf(operator.value)], data: [chunks[0], chunks[1]], line: operator.line, start: operator.start }]
    } else if (fragments.filter((fragment) => fragment.type === 'operator' && fragment.value === '!').length > 0) {
      for (let [index, fragment] of fragments.filter((fragment) => fragment.type === 'operator' && fragment.value === '!').entries()) {
        if (index > 0) return { error: true, content: `Unexpected "!" <operator>`, line: fragment.line, start: fragment.start }
      }

      for (let [index, fragment] of fragments.entries()) {
        if (fragment.type === 'operator' && fragment.value === '!') {
          if (index > 0) return { error: true, content: `Unexpected "!" <operator> (Should Only Appear At The Start Of The Instruction)`, line: fragment.line, start: fragment.start }
        }
      }

      const instructions2 = parseInstruction(fragments.slice(1, fragments.length))
      if (instructions2.error) return instructions2

      instructions =  [{ type: 'math', operation: 'not', data: [instructions2.data], line: fragments[0].line, start: fragments[0].start }]
    } else if (fragments[fragments.length - 1].type === 'list' || fragments[fragments.length - 1].type === 'inputList') {
      const instructions2 = parseInstruction(fragments.splice(0, fragments.length - 1))
      if (instructions2.error) return instructions2

      instructions = instructions.concat(instructions2.data)

      const fragment = fragments[fragments.length - 1]
      
      const instructions3 = parseInstruction([fragment])
      if (instructions3.error) return instructions3

      instructions.push({ type: (fragment.type === 'list') ? 'read' : 'call', keys: instructions3.data[0].data.value, line: fragment.line, start: fragment.start })
    } else if (fragments[0].type === 'inputList' && checkFragment(fragments[1], { type: ['operator'], value: ['?', ':'] })) {
      const instructions2 = parseInstruction([fragments[0]])
      if (instructions2.error) return instructions2

      if (fragments[2] === undefined) return { error: true, content: `Expecting <actionList>`, line: fragments[1].line, start: fragments[1].end }
      else {
        if (fragments[1].value === '?') {
          const instructions3 = parseInstruction([fragments[2]])
          if (instructions3.error) return instructions3

          let ifActionList = instructions3.data[0].data.value
          let elseActionList = []

          if (fragments[3] !== undefined) {
            if (fragments[3].type === 'operator' && fragments[3].value === ':') {
              if (fragments[4] === undefined || fragments[4].type !== 'actionList') return { error: true, content: `Expecting <actionList>`, line: fragments[3].line, start: fragments[3].end }
              else {
                if (fragments[5] !== undefined) return { error: true, content: `Unexpected "${fragments[5].value}" <${fragments[5].type}>`, line: fragments[5].line, start: fragments[5].start } 

                const instructions4 = parseInstruction([fragments[4]])
                if (instructions4.error) return instructions4

                elseActionList = instructions4.data[0].data.value
              }
            } else return { error: true, content: `Unexpected "${fragments[3].value}" <${fragments[3].type}>`, line: fragments[3].line, start: fragments[3].start }
          }

          instructions.push({ type: 'ifElse', condition: [instructions2.data[0].data.value[0]], ifActionList, elseActionList, line: fragments[0].line, start: fragments[0].start })
        } else {
          if (fragments[3] !== undefined) return { error: true, content: `Unexpected "${fragments[3].value}" <${fragments[3].type}>`, line: fragments[3].line, start: fragments[3].start  }

          const instructions3 = parseInstruction([fragments[2]])
          if (instructions3.error) return instructions3

          instructions.push({ type: 'loop', condition: instructions2.data[0].data.value, actionList: instructions3.data[0].data.value, line: fragments[0].line, start: fragments[0].start })
        }
      }
    } else if (fragments[0].type === 'keyword' && fragments[0].value === 'async') {
      instructions.push({ type: 'method', name: 'async' })

      const instructions2 = parseInstruction(fragments.slice(1, fragments.length))
      if (instructions2.error) return instructions2

      instructions = instructions.concat(instructions2.data)
    } else if (fragments[0].type === 'operator' && fragments[0].value === '~') {
      const instructions2 = parseInstruction(fragments.slice(1, fragments.length))
      if (instructions2.error) return instructions2

      instructions = [{ type: 'data', data: { type: 'link', value: [instructions2.data] }, line: fragments[0].line, start: fragments[0].start }]
    } else return { error: true, content: `Unexpected "${fragments[1].value}" <${fragments[1].type}>`, line: fragments[1].line, start: fragments[1].start }
  } else {
    if (['list', 'actionList', 'inputList'].includes(fragments[0].type)) {
      let items = []

      for (let fragments2 of fragments[0].value) {
        const instructions2 = parseInstruction(fragments2)
        if (instructions2.error) return instructions2

        items.push(instructions2.data)
      }

      instructions = [{ type: 'data', data: { type: fragments[0].type, value: items }, line: fragments[0].line, start: fragments[0].start }]
    } else if (fragments[0].type === 'keyword' && fragments[0].value === 'stop') {
      if (fragments.length > 1) return { error: true, content: `Unexpected "${fragments[1].value}" <${fragments[1].type}>`, line: fragments[1].line, start: fragments[1].start }

      instructions = [{ type: 'stop' }]
    } else if (fragments[0].type === 'keyword' || fragments[0].type === 'operator') return { error: true, content: `Unexpected "${fragments[0].value}" <${fragments[0].type}>`, line: fragments[0].line, start: fragments[0].start }
    else if (fragments[0].type === 'name') instructions = [{ type: 'get', name: fragments[0].value, line: fragments[0].line, start: fragments[0].start }]
    else instructions = [{ type: 'data', data: { type: fragments[0].type, value: fragments[0].value }, line: fragments[0].line, start: fragments[0].start }]
  }

  return { error: false, data: instructions }
}
