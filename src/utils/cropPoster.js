const cropPoster = img => {
  if (!img) return ''

  const prefix = img.slice(0, img.length - 4)
  return `${prefix}_CR0,0,300,444_AL_.jpg`
}

export default cropPoster
