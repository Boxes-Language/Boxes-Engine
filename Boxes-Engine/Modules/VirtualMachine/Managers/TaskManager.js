// Task Manager
export default class {
  #Core

  #tasks = []  
  #index = 0

  constructor (Core) {
    this.#Core = Core    
  }

  get totalTasks () {return this.#tasks.length}

  // Add Task
  addTask (id) {
    this.#tasks.push(id)
  }

  // Remove Task
  removeTask (id) {
    this.#tasks.splice(this.#tasks.indexOf(id), 1)
  }

  // Get A Task (Running Chunk) And Go To The Next Task
  next () {
    if (this.#index >= this.#tasks.length) this.#index = 0

    let task = this.#tasks[this.#index]

    this.#index++

    return (this.#Core.ChunkManager.getChunk(task).state === 'running') ? task : next()
  }
}
