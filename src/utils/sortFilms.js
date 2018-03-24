const toNum = string => {
  const num = Number.parseFloat(string)
  return Number.isNaN(num) ? -1 : num
}

const sortFilms = (films, sort) => {
  if (sort === 'index' || !sort) {
    return films
  }
  const sign = sort[0] === '-' ? -1 : 1
  const key = sign === 1 ? sort : sort.slice(1)
  return [...films].sort(({ [key]: a }, { [key]: b }) => {
    if (key === 'title' || key === 'year') {
      if (a < b) return -1 * sign
      if (a > b) return 1 * sign
      return 0
    }
    const numA = toNum(a)
    const numB = toNum(b)
    if (numA < numB) return -1 * sign
    if (numA > numB) return 1 * sign
    return 0
  })
}

export default sortFilms
