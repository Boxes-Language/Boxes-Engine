export { createError }

// Create Error
function createError (content, callPath) {
  return {
    error: true,
    content,
    callPath,

    // Add Call Path
    addCallPath (location) {
      this.callPath.push(location)

      return this
    }
  }
}
