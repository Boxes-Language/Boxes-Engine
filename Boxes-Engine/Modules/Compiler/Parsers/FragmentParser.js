// Parse Fragment
export default async (Compiler, string) => {
  const operations = [[]]
  let errors = []

  // Add Fragment To The Current Operation
  function addFragment (fragment) {
    operations[operations.length-1].push(fragment)

    state = {}
  }

  let state = {}
  let line = 1
  let layer = 0

  await lazyLoop(string.length, Compiler.options.loopInterval, (i) => {
    if (string[i] === '\n') {
      if (state.type === 'string') state.value += '\n'
      else {
        if (state.type !== undefined) addFragment({ type: state.type, value: state.value, line: state.line, start: state.start, end: i - 1 })

        if (layer < 1) operations.push([])

        line++ 
      }
    } else if (string[i] === ' ') {
      if (state.type === 'string') state.value += ' '
      else if (state.type !== undefined) addFragment({ type: state.type, value: state.value, line: state.line, start: state.start, end: i - 1 })
    } else if (string[i] === '#') {
      if (state.type === 'string') state.value += ' '
      else {
        if (state.type !== undefined) addFragment({ type: state.type, value: state.value, line: state.line, start: state.start, end: i - 1 })

        let skip = 0

        while (string[i+skip] !== '\n' && string[i+skip] !== undefined) skip++

        return skip
      }
    } else if ('[{('.includes(string[i])) {
      if (state.type === 'string') state.value += string[i]
      else {
        if (state.type !== undefined) addFragment({ type: state.type, value: state.value, line: state.line, start: state.start, end: i - 1})

        addFragment({ type: 'bracket', value: string[i], line, layer, start: i, end: i })

        layer++
      }
    } else if (']})'.includes(string[i])) {
      if (state.type === 'string') state.value += string[i]
      else {
        if (state.type !== undefined) addFragment({ type: state.type, value: state.value, line: state.line, start: state.start, end: i - 1})

        layer--

        addFragment({ type: 'bracket', value: string[i], line, layer, start: i, end: i })
      }
    } else if (state.type === undefined) {
      const start = i

      if (string.substring(i, i + 3) === 'Yes' || string.substring(i, i + 2) === 'No') {
        const value = (string.substring(i, i + 3) === 'Yes') ? 'Yes' : 'No'

        addFragment({ type: 'boolean', value, line, start, end: i+(value.length - 1) })

        return value.length
      } else if ('0123456789'.includes(string[i])) {
        let operation = operations[operations.length - 1]

        let value

        if (checkFragment(operation[operation.length - 1], { type: ['operator'], value: ['-'] }) && checkFragment(operation[operation.length - 2], { type: ['operator'], value: expressionOperators })) {
          operation.splice(operation.length - 1, 1)

          value = `-${string[i]}`
        } else value = string[i]

        state = { type: 'number', value, line, start }
      } else if (string.substring(i, i + 8) === 'Infinity') {
        addFragment({ type: 'number', value: 'Infinity', line, start, end: i + 8 })

        return 8
      } else if (string[i] === "'" || string[i] === '"') state = { type: 'string', closeType: string[i], value: '', line, start }
      else if (string.substring(i, i + 5) === 'Empty') {
        addFragment({ type: 'empty', value: 'Empty', line, start, end: i + 4 })

        return 5
      } else if (string.substring(i, i + 4) === 'Fire') {
        addFragment({ type: 'fire', value: 'Fire', line, start, end: i + 3 })

        return 4
      } else if (i < string.length - 1 && operators.includes(string.substring(i, i + 2))) {
        addFragment({ type: 'operator', value: string.substring(i, i + 2), line, start, end: i + 1 })

        return 2
      } else if (operators.includes(string[i])) {
        if (',|'.includes(string[i])) addFragment({ type: 'operator', value: string[i], line, layer, start, end: i })
        else addFragment({ type: 'operator', value: string[i], line, start, end: i })
      } else state = { type: 'name', value: string[i], line, start }
    } else {
      if (state.type === 'number') {
        if ('0123456789.'.includes(string[i])) state.value+=string[i]
        else {
          if (state.value[state.value.length - 1] === '.') errors.push({ content: 'Unexpected "." <operator>', line: state.line, start: state.start + (state.value.length - 1) })

          for (let i2 = 0; i2 < state.value.length; i2++) {
            if (state.value[i2] === '.' && state.value[i2 + 1] === '.') errors.push({ content: 'Unexpected "." <operator>', line: state.line, start: state.start + i2 })
          }

          addFragment({ type: 'number', value: state.value, line: state.line, start: state.start, end: i - 1 })

          return 0
        }
      } else if (state.type === 'string') {
        if (string[i] === state.closeType) addFragment({ type: 'string', value: state.value, line: state.line, start: state.start, end: i - 1 })
        else state.value += string[i]
      } else if (state.type === 'name') {
        if (string[i] === "'" || string[i] === '"' || operators.includes(string[i])) {
          addFragment({ type: 'name', value: state.value, line: state.line, start: state.start, end: i-- })

          return 0
        } else state.value+=string[i]
      }
    }

    return 1
  })

  if (state.type !== undefined) {
    if (state.type === 'string') errors.push({ content: '<string> Cannot Be Closed', line: state.line, start: state.start })
    else addFragment({ type: state.type, value: state.value, line: state.line, start: state.start, end: string.length-1 })
  }

  await lazyLoop(operations.length, Compiler.options.loopInterval, async (i) => {
    if (operations[i] === undefined) return 1
    else if (operations[i].length > 0) {
      const fragments = operations[i].map((fragment) => (checkFragment(fragment, { type: ['name'], value: keywords })) ? { type: 'keyword', value: fragment.value, line: fragment.line, start: fragment.start, end: fragment.end } : fragment)

      const fragments2 = await parseList(Compiler, fragments)

      if (fragments2.error) errors = errors.concat(fragments2.errors)
      else operations[i] = fragments2.data

      return 1
    } else {
      operations.splice(i, 1)

      return 0
    }
  })

  return { error: errors.length > 0, errors, data: operations }
}

// Parse List
async function parseList (Compiler, fragments) {
  const fragments2 = []
  let errors = []

  let state = {}

  await lazyLoop(fragments.length, Compiler.options.loopInterval, async (i) => {
    if (state.type === undefined) {
      if (checkFragment(fragments[i], { type: ['bracket'], value: ['[', '{', '('] })) state = { type: ['list', 'actionList', 'inputList']['[{('.indexOf(fragments[i].value)], value: [[]], line: fragments[i].line, layer: fragments[i].layer, start: fragments[i].start }
      else fragments2.push(fragments[i])
    } else {
      if (checkFragment(fragments[i], { type: ['bracket'], value: [']})'[['list', 'actionList', 'inputList'].indexOf(state.type)]], layer: state.layer })) {
        if (state.value[0].length < 1) state.value = []

        for (let i = 0; i < state.value.length; i++) {
          const fragments3 = await parseList(Compiler, state.value[i])
          if (fragments3.error) errors = errors.concat(fragments3.errors)

          state.value[i] = fragments3.data
        }

        fragments2.push({ type: state.type, value: state.value, line: state.line, start: state.start, end: fragments[i].end })

        state = {}
      } else {
        if (checkFragment(fragments[i], { type: ['operator'], value: [(state.type === 'actionList') ? '|' : ','], layer: state.layer + 1 })) {
          if (state.value[state.value.length - 1].length > 0) state.value.push([])
          else errors.push({ content: `Unexpected "${fragments[i].value}" <operator>`, line: fragments[i].line, start: fragments[i].start })
        } else state.value[state.value.length - 1].push(fragments[i])
      }
    }

    return 1
  })

  return { error: errors.length > 0, errors, data: fragments2 }
}

import lazyLoop from '../../Tools/LazyLoop.js'

import checkFragment from '../CheckFragment.js'

const operators = ['@', '!', '?', ':', '<-', '->', '+', '-', '*', '/', '=', '==', '>', '>=', '<', '<=', '&&', '||', ',', '|', '~']
const keywords = ['import', 'as', 'async', 'return']

const expressionOperators = ['+', '-', '*', '/', '==', '!=', '>', '>=', '<', '<=', '&&', '||']
