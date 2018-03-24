import PropTypes from 'prop-types'
import cropPoster from '../utils/cropPoster'

const Poster = ({ poster, crop }) => {
  const bsClass = 'img-fluid card'
  const src = crop ? cropPoster(poster) : poster


  return (
    <img className={bsClass} src={src} alt="Poster" />
  )
}

Poster.propTypes = {
  poster: PropTypes.string,
  crop: PropTypes.bool,
}

Poster.defaultProps = {
  poster: '',
  crop: false,
}

export default Poster
