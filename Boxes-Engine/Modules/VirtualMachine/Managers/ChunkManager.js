// Chunk Manager
export default class {
  #Core

  #chunks = {}

  constructor (Core) {
    this.#Core = Core
  }

  get totalChunks () {return Object.keys(this.#chunks).length}

  // Create Chunk
  createChunk (workspaceID, parent, input, actions, async, callLocation) {
    const id = generateID(10, Object.keys(this.#chunks))

    let callPath = []

    if (parent.type === 'chunk') {
      const chunk = this.getChunk(parent.id)

      callPath = chunk.callPath.concat([callLocation])

      if (callPath.length > 10) callPath.splice(0, 1)

      if (!async) chunk.state = 'waiting'
    }

    this.#Core.TaskManager.addTask(id)

    this.#chunks[id] = {
      id,
      state: 'running',

      async,
      workspaceID,
      parent,

      workspaceMemoryAddress: this.#Core.WorkspaceManager.getWorkspace(workspaceID).memoryAddress,
      chunkMemoryAddress: this.#Core.MemoryManager.registerChunk(),

      actions,

      currentAction: 0,
      actionData: {},
      returnedData: [],

      callPath
    }

    this.#Core.MemoryManager.write(this.#chunks[id].chunkMemoryAddress, 'Input', { type: 'list', value: input }, true)
    this.#Core.MemoryManager.write(this.#chunks[id].chunkMemoryAddress, 'Result', { type: 'none', value: 'none' }, true)
    this.#Core.MemoryManager.write(this.#chunks[id].chunkMemoryAddress, 'Local', { type: 'none', value: 'none' }, false)

    return id
  }

  // Delete Chunk
  deleteChunk (id) {
    const chunk = this.getChunk(id)

    if (!chunk.async) {
      if (chunk.parent.type === 'workspace') {
        const workspace = this.#Core.WorkspaceManager.getWorkspace(chunk.workspaceID)
    
        const target = workspace.operations[workspace.currentOperation].target
        const source = this.#Core.MemoryManager.read(chunk.chunkMemoryAddress, 'Result')

        if (target.flags.includes('createLocal') && target.flags.includes('createLocal')) {
          const result = this.#Core.MemoryManager.create(workspace.memoryAddress, target.name, source, target.flags.includes('lock'))
          if (result.error) return { error: true, content: `Box Named "${target.name}" Already Exist` }
        } else {
          const result = this.#Core.MemoryManager.write(workspace.memoryAddress, target.name, source)

          if (result.error) {
            if (result.content === 'Not Found') return { error: true, content: `Box Named "${target.name}" Not Found` }
            else if (result.content === 'Locked') return { error: true, content: `Box Named "${target.name}" Is Locked (Cannot Assign Value To A Locked Box)` }
          }
        }

        this.#Core.WorkspaceManager.continueWorkspace(chunk.workspaceID)
      } else if (chunk.parent.type === 'chunk') {
        const chunk = this.#chunks[chunk.parent.id]
      }
    }

    delete this.#chunks[id]

    this.#Core.TaskManager.removeTask(id)

    return { error: false }
  }

  // Get Chunk
  getChunk (id) {
    return this.#chunks[id]
   }

  // Execute Chunk
  executeChunk (id) {
    const chunk = this.#chunks[id]

    console.log(id)

    const result = executeAction(this.#Core, chunk, chunk.actions[chunk.currentAction])

    if (chunk.currentAction >= chunk.actions.length) {
      return this.deleteChunk(id)
    }

    return result
  }
}

import generateID from '../../Tools/GenerateID.js'

import executeAction from '../ExecuteAction.js'
import setBox from '../SetBox.js'
