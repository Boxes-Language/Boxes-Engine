// Memory Manager
export default class {
  #Core

  #chunks = {}
  #size = 0

  constructor (Core) {
    this.#Core = Core
  }

  // Register Chunk
  registerChunk () {
    const id = generateAddress(this.#Core.options.addressLength, Object.keys(this.#chunks))

    this.#chunks[id] = {}

    return id
  }

  // Delete Chunk
  deleteChunk (id) {
    Object.keys(this.#chunks[id]).forEach((name) => this.#size -= calculateDataSize(this.#chunks[id][name].data))

    delete this.#chunks[id]
  }

  // Get All Chunks
  getAllChunks () {
    return this.#chunks
  }

  // Create
  create (chunkID, name, data, lock) {
    if (this.#chunks[chunkID][name] !== undefined) return { error: true, content: 'Already Exist' }

    this.#chunks[chunkID][name] = { lock, data }

    return { error: false }
  }

  // Delete
  delete (chunkID, name) {
    this.#size -= calculateDataSize(this.#chunks[chunkID][name].data)

    delete this.#chunks[chunkID][name]
  }

  // Write
  write (chunkID, name, data, force) {
    if (this.#chunks[chunkID][name] === undefined) return { error: true, content: 'Not Found' }
    if (this.#chunks[chunkID][name].lock && force !== true) return { error: true, content: 'Locked' }

    this.#size -= calculateDataSize(this.#chunks[chunkID][name].data)

    this.#chunks[chunkID][name].data = data

    this.#size += calculateDataSize(data)

    return { error: false }
  }

  // Read
  read (chunkID, name) {
    return (this.#chunks[chunkID][name] === undefined) ? undefined : this.#chunks[chunkID][name].data
  }

  // Get Box
  getBox (Core, chunk, name, path) {
    let data
    let memoryChunkID

    data = Core.MemoryManager.read(chunk.workspaceMemoryAddress, name)
    memoryChunkID = chunk.workspaceMemoryAddress
 
    if (data === undefined) {
      data = Core.MemoryManager.read(chunk.chunkMemoryAddress, name)
      memoryChunkID = chunk.chunkMemoryAddress
    }

    if (data === undefined) return { error: true, content: `Box Not Found: "${name}"` }

    if (path.length > 0) {
      for (let key of path) {
        if (data.type === 'list') data = data.value[key]
        else if (data === undefined) return { error: true, content: `Cannot Read ${key} from <none>` }
        else return { error: true, content: `Cannot Read ${key} from <${data.type}>` }
      }
    }

    return { error: false, data: { type: data.type, value: data.value, address: { chunkID: memoryChunkID, name, path: [] }}}
  }
}

// Calculate Data Size
function calculateDataSize (data) {
  if (data.type === 'boolean') return 4
  else if (data.type === 'number' || data.type === 'link') return 8
  else if (data.type === 'string') return data.value.length*2
  else if (data.type === 'empty') return 1
  else if (data.type === 'list') {
    if (data.value.length < 1) return 0

    return (data.value.length > 1) ? data.value.map((item) => calculateDataSize(item)).reduce((a, b) => a+b) : calculateDataSize(data.value[0])
  }
}

import generateAddress from '../../Tools/GenerateAddress.js'
