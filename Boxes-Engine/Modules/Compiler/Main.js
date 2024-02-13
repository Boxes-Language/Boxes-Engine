// Compiler
export default class {
  #options

  constructor (options) {
    checkParameters({
      options: { type: ['undefined', 'object'] }
    }, { options })

    this.#options = Object.assign({
      loopInterval: 0
    })

    checkObject('options', {
      loopInterval: { type: ['number'] }
    }, this.#options)
  }

  get options () {return this.#options}

  // Compile
  async compile (string) {
    checkParameters({
      string: { type: ['string'] }
    }, { string })

    let operations = await parseFragment(this, string)
    if (operations.error) return { error: true, errors: operations.errors }

    operations = await parseOperation(this, operations.data)
    if (operations.error) return { error: true, errors: operations.errors }

    return { error: false, data: operations.data }
  }
}

import checkParameters from '../Tools/CheckParameters.js'
import checkObject from '../Tools/CheckObject.js'

import parseOperation from './Parsers/OperationParser.js'
import parseFragment from './Parsers/FragmentParser.js'
