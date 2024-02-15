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

    this.#Core.ChunkManager.createChunk(id, { type: 'workspace', id, currentOperation: 0 }, [
      { name: 'Input', data: { type: 'list', value: [] }, lock: true },
      { name: 'Result', data: { type: 'empty', value: 'Empty' }, lock: true },
      { name: 'Local', data: { type: 'empty', value: 'Empty' }, lock: false }
    ], executable.operations[0].source, false)

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
      const currentOperation = this.#workspaces[id].currentOperation

      this.#Core.ChunkManager.createChunk(id, { type: 'workspace', id, currentOperation }, [
        { name: 'Input', data: { type: 'list', value: [] }, lock: true },
        { name: 'Result', data: { type: 'empty', value: 'Empty' }, lock: true },
        { name: 'Local', data: { type: 'empty', value: 'Empty' }, lock: false }
      ], this.#workspaces[id].operations[currentOperation].source, false)
    }
  }
}

import generateAddress from '../../Tools/GenerateAddress.js'
