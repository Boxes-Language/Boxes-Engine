// Environment Manager
export default class {
  #environment

  constructor () {

  }

  get environment () {return this.#environment}

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

    this.#environment = environment
  }
}

import checkParameters from '../../Tools/CheckParameters.js'
import checkObject from '../../Tools/CheckObject.js'
