// Parse Operation
export default async (Compiler, operations) => {
  const operations2 = []
  let errors = []

  const imports = []

  await lazyLoop(operations.length, Compiler.options.loopInterval, (i) => {
    const fragments = operations[i]

    if (checkFragment(fragments[0], { type: ['keyword'], value: ['import'] })) {
      if (checkFragment(fragments[1], { type: ['string'] })) {
        if (checkFragment(fragments[2], { type: ['keyword'], value: ['as'] })) {
          if (checkFragment(fragments[3], { type: ['name'] })) imports.push({ source: fragments[1].value, as: fragments[3].value })
          else errors.push({ content: 'Expecting A <name>', line: fragments[2].line, start: fragments[2].end })
        } else imports.push({ source: fragments[1].value })
      } else errors.push({ content: 'Expecting A <string>', line: fragments[0].line, start: fragments[0].end })
    } else {
      const directions = fragments.filter((fragment) => fragment.type === 'operator' && (fragment.value === '->' || fragment.value === '<-'))

      if (directions.length < 1) errors.push({ content: 'Cannot Find Any Directions', line: fragments[0].line, start: 0 })
      else {
        directions.forEach((fragment, index) => {
          if (index > 0) errors.push({ content: `Unexpected "${fragment.value}" / <operator> (Too Many Directions)`, line: fragment.line, start: fragment.start })
        })

        const direction = directions[0].value

        const chunks2 = splitArray(fragments, (fragment) => fragment.type === 'operator' && fragment.value === direction)

        if (chunks2[0].length < 1 || chunks2[1].length < 1) errors.push({ content: `Expecting <any> (${(chunks2[0].length < 1) ? 'Before' : 'After'} The <operator> "${direction}")` })
        else {
          const [target, source] = (direction === '->') ? [parseTarget(chunks2[1]), parseAction(chunks2[0])] : [parseTarget(chunks2[0]), parseAction(chunks2[1])]
          if (target.error) errors.push({ content: target.content, line: target.line, start: target.start })
          if (source.error) errors.push({ content: source.content, line: source.line, start: source.start })

          operations2.push({ target: target.data, source: source.data })
        }
      }
    }

    return 1
  })

  return { error: errors.length > 0, errors, data: { operations: operations2, imports }}
}

import splitArray from '../../Tools/SplitArray.js'
import lazyLoop from '../../Tools/LazyLoop.js'

import checkFragment from '../CheckFragment.js'
import parseAction from './ActionParser.js'
import parseTarget from './TargetParser.js'
