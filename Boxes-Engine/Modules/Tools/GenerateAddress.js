// Generate Address
export default (length, keys) => {
  let count = 0

  while (keys.includes(count.toString().padStart(length, '0'))) {
    count++

    if (count > +('9'.repeat(length))) throw new Error('Run Out Of Address')
  }

  return count.toString().padStart(length, '0')
}
