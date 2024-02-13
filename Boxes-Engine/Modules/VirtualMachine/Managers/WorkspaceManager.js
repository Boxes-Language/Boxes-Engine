// Workspace Manager
export default class {
  #Core

  #workspaces = {}

  constructor (Core) {
    this.#Core = Core
  }

  get workspaces () {return this.#workspaces}

  // Add Workspace
  addWorkspace (executable, location) {
    const id = generateAddress(5, Object.keys(this.#workspaces)) 

    this.#workspaces[id] = {
      location,

      memoryAddress: this.#Core.MemoryManager.registerChunk(),

      operations: executable.operations,
      currentOperation: 0
    }

    this.#Core.ChunkManager.createChunk(id, { type: 'workspace', id, currentOperation: 0 }, [], executable.operations[0].source, false)

    return id
  }

  // Get Workspace
  getWorkspace (id) {
    return this.#workspaces[id]
  }

  // Continue
  continueWorkspace (id) {
    this.#workspaces[id].currentOperation++

    if (this.#workspaces[id].currentOperation < this.#workspaces[id].operations.length) {
      const currentOperation = this.#workspaces[id].currentWorkspace

      this.#Core.ChunkManager.createChunk(id, { type: 'workspace', id, currentOperation }, [], this.#workspaces[id].operations[currentOperation].source, false)
    }
  }
}

import generateAddress from '../../Tools/GenerateAddress.js'
