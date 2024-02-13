// Parse Target
export default (fragments) => {
  let skip = 0

  let flags = []

  if (checkFragment(fragments[0], { type: ['operator'], value: ['+', '!'] })) {
    flags.push((fragments[0].value === '+') ? 'createLocal' : 'createGlobal')

    if (checkFragment(fragments[1], { type: ['operator'], value: ['@'] })) {
      flags.push('lock')

      skip = 2
    } else skip = 1
  }

  if (checkFragment(fragments[skip], { type: ['name'] })) return { error: false, data: { name: fragments[0].value, flags }}
  else if (fragments[skip] === undefined) return { error: true, content: 'Expecting A <name>', line: fragments[fragments.length-1].line, start: fragments[fragments.length-1].end }
  else return { error: true, content: `Unexpected "${fragments[skip].value}" <${fragments[skip].type}> (Expecting A <name>)`, line: fragments[skip].line, start: fragments[skip].start }
}

import checkFragment from '../CheckFragment.js'
