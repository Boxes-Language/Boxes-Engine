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
  create (chunkID, name, data, readonly) {
    if (this.#chunks[chunkID][name] !== undefined) return { error: true, content: 'Already Exist' }

    this.#chunks[chunkID][name] = { readonly, data }

    return { error: false }
  }

  // Write
  write (chunkID, name, data) {
    if (this.#chunks[chunkID][name] === undefined) return { error: true, content: 'Not Found' }
    if (this.#chunks[chunkID][name].lock) return { error: true, content: 'Locked' }

    this.#size -= calculateDataSize(this.#chunks[chunkID][name].data)

    this.#chunks[chunkID][name] = { readonly, data }

    this.#size += calculateDataSize(data)

    return { error: false }
  }

  // Read
  read (chunkID, name) {
    return (this.#chunks[chunkID][name] === undefined) ? undefined : this.#chunks[chunkID][name].data
  }
}

// Calculate Data Size
function calculateDataSize (data) {
  if (data.type === 'boolean') return 4
  else if (data.type === 'number') return 8
  else if (data.type === 'string') return data.value.length*2
  else if (data.type === 'empty') return 1
  else if (data.type === 'list') {
    if (data.value.length < 1) return 0

    return (data.value.length > 1) ? data.value.map((item) => calculateDataSize(item)).reduce((a, b) => a+b) : calculateDataSize(data.value[0])
  }
}

import generateAddress from '../../Tools/GenerateAddress.js'
