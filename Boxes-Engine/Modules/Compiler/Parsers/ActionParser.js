// Action Parser
export default (fragments) => {
  const actions = splitArray(fragments, (fragment) => fragment.type === 'operator' && fragment.value === '|' && fragment.layer === 0).filter((action) => action.length > 0)

  for (let [i, action] of actions.entries()) {
    const instructions = parseInstruction(action)
    if (instructions.error) return instructions

    actions[i] = instructions.data
  }

  return { error: false, data: actions }
}

import splitArray from '../../Tools/SplitArray.js'

import parseInstruction from './InstructionParser.js'
