// Chunk Manager
export default class {
  #Core

  #chunks = {}

  constructor (Core) {
    this.#Core = Core
  }

  get totalChunks () {return Object.keys(this.#chunks).length}

  // Create Chunk
  createChunk (type, workspaceID, parent, localBoxes, actions, async, callLocation) {
    const id = generateAddress(this.#Core.options.addressLength, Object.keys(this.#chunks))

    let callPath = []

    if (parent.type === 'chunk') {
      const chunk = this.getChunk(parent.id)

      callPath = (callLocation === undefined) ? chunk.callPath : chunk.callPath.concat([callLocation])

      if (callPath.length > 10) callPath.splice(0, 1)

      if (!async) chunk.state = 'waiting'
    }

    this.#Core.TaskManager.addTask(id)

    this.#chunks[id] = {
      id,
      type,
      state: 'running',

      async,
      workspaceID,
      parent,

      workspaceMemoryAddress: this.#Core.WorkspaceManager.getWorkspace(workspaceID).memoryAddress,
      chunkMemoryAddress: this.#Core.MemoryManager.registerChunk(),

      actions,

      currentAction: 0,
      actionData: {
        currentIndex: 0,
        methods: []
      },
      returnedData: [],

      callPath
    }

    localBoxes.forEach((box) => this.#Core.MemoryManager.create(this.#chunks[id].chunkMemoryAddress, box.name, box.data, box.lock))

    return id
  }

  // Create Child Chunks
  createChildChunks (Core, chunk, chunks) {
    chunk.returnedData = chunks.map(() => undefined)

    chunks.forEach((actions, index) => {
      this.createChunk('childChunk', chunk.workspaceID, { type: 'chunk', id: chunk.id, returnIndex: index }, [
        { name: 'Input', data: Core.MemoryManager.read(chunk.chunkMemoryAddress, 'Input'), lock: true },
        { name: 'Result', data: Core.MemoryManager.read(chunk.chunkMemoryAddress, 'Result'), lock: true },
        { name: 'Local', data: { type: 'link', address: { chunkID: chunk.chunkMemoryAddress, name: 'Local', path: [] }}, lock: false }
      ], actions, false)
    })
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
        const parentChunk = this.#chunks[chunk.parent.id]

        parentChunk.returnedData[chunk.parent.returnIndex] = this.#Core.MemoryManager.read(chunk.chunkMemoryAddress, 'Result')

        if (parentChunk.returnedData.filter((data) => data === undefined).length < 1) parentChunk.state = 'running'
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

    if (chunk.currentAction >= chunk.actions.length) {
      const result = this.deleteChunk(id)
      if (result.error) return result

      return { error: false, data: { type: 'empty', value: 'Empty' }}
    } else return executeAction(this.#Core, chunk, chunk.actions[chunk.currentAction])
  }
}

import generateAddress from '../../Tools/GenerateAddress.js'

import executeAction from '../ExecuteAction.js'
