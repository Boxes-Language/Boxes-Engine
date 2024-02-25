export { createError, addPath }

// Create Error
function createError (content, callPath) {
  return { error: true, content, callPath }
}

// Add Path
function addPath (errorData, location) {
  errorData.callPath.push(location)

  return errorData
}
