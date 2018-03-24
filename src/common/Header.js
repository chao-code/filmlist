import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import Button from './Button'
import FilmSearch from './FilmSearch'

const Header = ({ history, location }) => {
  const onResultClick = film => history.push(`/film/${film.imdbID}`)

  const filmSearchProps = {
    inputClass: 'form-control-sm',
    placeholder: 'Search...',
    onResultClick,
  }

  return (
    <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">FilmList</Link>
        <button className="navbar-toggler" data-toggle="collapse" data-target="#navbarMenu">
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarMenu">
          <form className="form-inline my-2 mr-sm-3 bd-search">
            <FilmSearch {...filmSearchProps} />
          </form>
          <Button
            className="my-2 my-md-auto"
            primary
            small
            href="/newlist"
            replace={location.pathname.slice(0, 8) === '/newlist'}
          >Create a List</Button>
        </div>
      </div>
    </nav>
  )
}

Header.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
  location: PropTypes.shape({ pathname: PropTypes.string }).isRequired,
}

export { Header as _Header }

export default withRouter(Header)
