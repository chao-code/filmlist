const debounce = (func, delay = 1000) => {
  let timeout
  return (...arg) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...arg), delay)
  }
}

export default debounce
