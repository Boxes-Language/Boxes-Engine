// Check Fragment
export default (fragment, condition) => {
  if (fragment === undefined) return false

  if (condition.type !== undefined && !condition.type.includes(fragment.type)) return false
  if (condition.value !== undefined && !condition.value.includes(fragment.value)) return false
  if (condition.layer !== undefined && fragment.layer !== condition.layer) return false

  return true
}
