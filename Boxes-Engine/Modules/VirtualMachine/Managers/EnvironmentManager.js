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
  }
}

import checkParameters from '../../Tools/CheckParameters.js'
