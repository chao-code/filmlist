const formatDate = timestamp => {
  const date = new Date(timestamp)
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  const m = months[date.getMonth()]
  const d = date.getDate()
  const y = date.getFullYear()
  return `${m} ${d}, ${y}`
}

export default formatDate
