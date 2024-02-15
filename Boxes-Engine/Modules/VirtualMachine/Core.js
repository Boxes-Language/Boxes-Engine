// Core
export default class {
  #options
  #callback
  #executable

  #result

  constructor (options, callback, executable, location) {
    this.#options = options
    this.#callback = callback
    this.#executable = executable

    this.TimerManager = new TimerManager()

    this.TaskManager = new TaskManager(this)
    this.MemoryManager = new MemoryManager(this)

    this.ChunkManager = new ChunkManager(this)
    this.WorkspaceManager = new WorkspaceManager(this)

    this.WorkspaceManager.addWorkspace(executable, location)

    const timer = this.TimerManager.createInterval(options.executionInterval, () => {
      if (this.TaskManager.totalTasks > 0) {
        const task = this.TaskManager.next()

        const result = this.ChunkManager.executeChunk(task)
        if (result.error) {
          this.TimerManager.deleteTimer(timer)

          this.#callback(result)
        } else this.#result = result.data
      } else {
        this.TimerManager.deleteTimer(timer)

        this.#callback({ error: false, data: this.#result })
      }
    })
  }

  get options () {return this.#options}
}

import WorkspaceManager from './Managers/WorkspaceManager.js'
import MemoryManager from './Managers/MemoryManager.js'
import ChunkManager from './Managers/ChunkManager.js'
import TimerManager from './Managers/TimerManager.js'
import TaskManager from './Managers/TaskManager.js'
