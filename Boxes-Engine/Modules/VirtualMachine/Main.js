// Vitual Machine
export default class {
  #state = 'idle'
  #options

  #Core

  constructor (options) {
    checkParameters({
      options: { type: ['undefined', 'object'] }
    }, { options })

    this.#options = Object.assign({
      chunkPerExecution: 10,
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
    }, this.#options)
  }

  get state () {return this.#state}

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


    if (this.#state === 'idle') {
      return new Promise((resolve) => {
        this.#Core = new Core(this.#options, (data) => resolve(data), executable, location)
      })
    } else throw new Error(`Cannot Start The Virtual Machine (State: ${this.#state})`)
  }

  // Stop The Virtual Machine
  stop () {
    if (this.#state === 'running') {

    } else throw new Error(`Cannot Stop The Virtual Machine (State: ${this.#state})`)
  }
}

import checkParameters from '../Tools/CheckParameters.js'
import checkObject from '../Tools/CheckObject.js'

import Core from './Core.js'

