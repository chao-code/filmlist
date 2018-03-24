import PropTypes from 'prop-types'

const Section = ({ name, children, className, large }) => (
  <section className={className}>
    {large ? (
      <h3 className="mb-0">{name}</h3>
    ) : (
      <h6 className="mb-0">{name}</h6>
    )}
    <hr className="mt-1" />
    {children}
  </section>
)

Section.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
  large: PropTypes.bool,
}

Section.defaultProps = {
  children: null,
  className: '',
  large: false,
}

export default Section
