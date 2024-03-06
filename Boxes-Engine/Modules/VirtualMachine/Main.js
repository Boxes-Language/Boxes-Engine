// Vitual Machine
export default class {
  #Core

  constructor (options) {
    checkParameters({
      options: { type: ['undefined', 'object'] }
    }, { options })

    options = Object.assign({
      chunkPerExecution: 100,
      executionInterval: 0,

      maxMemory: Infinity,
      maxChunks: Infinity,

      addressLength: 5
    }, (options === undefined) ? {} : options)

    checkObject('options', {
      chunkPerExecution: { type: ['number'] },
      executionInterval: { type: ['number'] },

      maxMemory: { type: ['number'] },
      maxChunks: { type: ['number'] },

      addressLength: { type: ['number'] }
    }, options)

    this.#Core = new Core(options)
  }

  get state () {return this.#Core.state}
  get options () {return this.#Core.options}

  // Start The Virtual Machine
  async start (executable, location) {
    checkParameters({
      executable: { type: ['object'] },
      location: { type: ['string'] }
    }, { executable })

    checkObject('executable', {
      operations: { type: ['array'] },
      imports: { type: ['array'] }
    }, executable)

    return await this.#Core.start(executable, location)
  }

  // Stop The Virtual Machine
  stop () {
    this.#Core.stop()
  }

  // Set Environment
  setEnvironment (environment) {
    checkParameters({
      environment: { type: ['object'] }
    }, { environment })

    checkObject('environment', {
      import: { type: ['boolean'] },
      importFinder: { type: ['undefined', 'function'] },

      environmentBoxes: { type: ['array'] }
    }, environment)

    this.#Core.setEnvironment(environment)
  }

  // Listen To Event
  listen (name, callback) {
    checkParameters({
      name: { type: ['string'], value: ['start', 'stop'] },
      callback: { type: ['function'] }
    }, { name, callback })
  }
}

import checkParameters from '../Tools/CheckParameters.js'
import checkObject from '../Tools/CheckObject.js'

import Core from './Core.js'

