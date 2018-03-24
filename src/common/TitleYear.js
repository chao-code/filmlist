import PropTypes from 'prop-types'

const TitleYear = ({ title, year }) => (
  <span>
    {title} <small className="text-muted">({year})</small>
  </span>
)

TitleYear.propTypes = {
  title: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired,
}

export default TitleYear
