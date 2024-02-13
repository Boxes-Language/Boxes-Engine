// Lazy Loop
export default async (times, interval, callback) => {
  return new Promise((resolve) => {
    let count = 0

    // Tick
    async function tick () {
      count += await callback(count) 

      if (count >= times) resolve()
      else {
        if (interval > 0) setTimeout(tick, interval)
        else tick()
      }
    }

    tick()
  })
}
