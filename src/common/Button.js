import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'react-router-dom'

const Button = props => {
  const { children,
    className,
    href,
    primary,
    secondary,
    danger,
    link,
    small,
    ...attrs
  } = props
  const bsClass = classNames('btn', className, {
    'btn-primary': primary,
    'btn-outline-secondary': secondary,
    'btn-danger': danger,
    'btn-link': link,
    'btn-sm': small,
  })

  return (
    href ? (
      <Link className={bsClass} to={href} {...attrs}>{children}</Link>
    ) : (
      <button className={bsClass} {...attrs}>{children}</button>
    )
  )
}

Button.propTypes = {
  children: PropTypes.string,
  className: PropTypes.string,
  href: PropTypes.string,
  primary: PropTypes.bool,
  secondary: PropTypes.bool,
  danger: PropTypes.bool,
  link: PropTypes.bool,
  small: PropTypes.bool,
}

Button.defaultProps = {
  children: ' ',
  className: '',
  href: '',
  primary: false,
  secondary: false,
  danger: false,
  link: false,
  small: false,
}

export default Button
