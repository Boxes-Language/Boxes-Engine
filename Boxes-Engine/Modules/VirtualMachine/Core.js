// Core
export default class {
  #state = 'idle'
  #options

  #callback
  #result

  #listeners = {}

  constructor (options) {
    this.#options = options

    this.TimerManager = new TimerManager()

    this.TaskManager = new TaskManager(this)
    this.MemoryManager = new MemoryManager(this)

    this.ChunkManager = new ChunkManager(this)
    this.WorkspaceManager = new WorkspaceManager(this)
  }

  get state () {return this.#state}
  get options () {return this.#options}

  // Start The Virtual Machine
  async start (executable, location) {
    if (this.#state === 'idle') {
      return new Promise((resolve) => {
        this.#callback = (result) => resolve(result)

        this.WorkspaceManager.addWorkspace(executable, location)

        this.timer = this.TimerManager.createInterval(this.#options.executionInterval, () => {
          for (let i = 0; i < this.#options.chunkPerExecution; i++) {
            if (this.TaskManager.totalTasks > 0) {
              const task = this.TaskManager.next()

              const result = this.ChunkManager.executeChunk(task)
              if (result.error) {
                this.stop()

                break
              } else if (result.data !== undefined) this.#result = result.data
            } else {
              this.stop()
          
              break
            }
          }
        })

        this.callEvent('start')
      })
    }
    else throw new Error(`Cannot Start The Virtual Machine (State: ${this.#state})`)
  }

  // Stop The Virtual Machine
  stop () {
    this.TimerManager.deleteTimer(this.timer)

    this.#callback({ error: false, data: this.#result })

    this.callEvent('stop')
  }

  // Listen To An Event
  listen (name, callback) {
    const id = generateID(5, Object.keys(this.#listeners))

    if (this.#listeners[name] === undefined) this.#listeners[name] = {}

    this.#listeners[name][id] = callback

    return {
      stop: () => {
        if (this.#listeners[name][id] === undefined) throw new Error(`Listener Not Found (${id})`)

        delete this.#listeners[name][id]
      }
    }
  }

  // Call An Event
  callEvent (name, data) {
    if (this.#listeners[name] !== undefined) Object.keys(this.#listeners[name]).forEach((id) => this.#listeners[name][id](data))
  }
}

import generateID from '../Tools/GenerateID.js'

import WorkspaceManager from './Managers/WorkspaceManager.js'
import MemoryManager from './Managers/MemoryManager.js'
import ChunkManager from './Managers/ChunkManager.js'
import TimerManager from './Managers/TimerManager.js'
import TaskManager from './Managers/TaskManager.js'

