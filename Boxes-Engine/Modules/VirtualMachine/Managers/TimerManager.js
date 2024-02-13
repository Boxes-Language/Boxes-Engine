// Timer Manager
export default class {
  #interval

  #timers = {} 

  // Create Interval
  createInterval (interval, callback) {
    let id = generateID(5, Object.keys(this.#timers))

    this.#timers[id] = {
      interval,
      times: Infinity,

      callback,

      count: 0,
      lastUpdateTime: performance.now()
    }

    if (this.#interval === undefined) this.#startTimer()

    return id
  }

  // Delete Timer
  deleteTimer (id) {
    if (this.#timers[id] !== undefined) {
      delete this.#timers[id]

      if (Object.keys(this.#timers).length < 1) this.#stopTimer()
    }
  }

  // Delete All Timers
  deleteAllTimers () {
    Object.keys(this.#timers).forEach((id) => this.deleteTimer(id))
  }

  // Start The Timer
  #startTimer () {
    this.#interval = setInterval(() => {
      const time = performance.now()

      Object.keys(this.#timers).forEach((id) => {
        const timer = this.#timers[id]

        if (timer !== undefined && time-timer.lastUpdateTime >= timer.interval) {
          timer.callback(timer.count)

          timer.lastUpdateTime = time

          if (timer.times !== Infinity) {
            timer.count++

            if (timer.count >= timer.times) {
              if (timer.callback2 !== undefined) timer.callback2()

              delete this.#timers[id]
            }
          }
        }
      })
    }, 1)
  }

  // Stop The Timer
  #stopTimer () {
    if (this.#interval !== undefined) {
      clearInterval(this.#interval)

      this.#interval = undefined
    }
  }
}

import generateID from '../../Tools/GenerateID.js'
