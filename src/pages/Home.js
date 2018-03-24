import { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Section from '../common/Section'
import Poster from '../common/Poster'
import Button from '../common/Button'
import Loading from '../common/Loading'
import Lists from '../common/Lists'
import {
  loadPopularFilms,
  loadPopularLists,
  showMorePopularFilms,
  showLessPopularFilms,
} from '../redux/actions'

class Home extends Component {
  static propTypes = {
    loadPopularFilms: PropTypes.func.isRequired,
    loadPopularLists: PropTypes.func.isRequired,
    showMorePopularFilms: PropTypes.func.isRequired,
    showLessPopularFilms: PropTypes.func.isRequired,
    popularFilms: PropTypes.shape({
      isFetching: PropTypes.bool,
      films: PropTypes.array,
      numShown: PropTypes.number,
    }).isRequired,
    popularLists: PropTypes.shape({
      isFetching: PropTypes.bool,
      lists: PropTypes.array,
    }).isRequired,
  }

  componentDidMount() {
    document.title = 'FilmList'
    this.props.loadPopularFilms()
    this.props.loadPopularLists()
  }

  renderWelcomeMessage() {
    return (
      <section>
        <h1 className="display-4 text-center">
          What are you watching?
        </h1>
        <p className="lead text-center">
          <Link to="/newlist">Create a list</Link> and share with your friends...
        </p>
      </section>
    )
  }

  renderFilm({ imdbID, poster }) {
    return (
      <div className="col-6 col-md-3 mb-3" key={imdbID}>
        <Link to={`/film/${imdbID}`}>
          <Poster poster={poster} />
        </Link>
      </div>
    )
  }

  renderPopularFilms() {
    const { isFetching, films, numShown } = this.props.popularFilms
    const step = 8
    return (
      <Section className="my-5" name="Popular Films">
        {isFetching ? (
          <Loading />
        ) : (
          <div className="row">
            {films.slice(0, numShown).map(film => this.renderFilm(film))}
          </div>
        )}
        {!isFetching && numShown < 100 &&
          <Button
            className="float-right"
            link
            small
            onClick={() => this.props.showMorePopularFilms(step)}
          >Show More</Button>
        }
        {!isFetching && numShown > 4 &&
          <Button
            className="float-right mr-3"
            link
            small
            onClick={() => this.props.showLessPopularFilms(step)}
          >Show Less</Button>
        }
      </Section>
    )
  }

  renderPopularLists() {
    const { isFetching, lists } = this.props.popularLists
    return (
      <Section name="Popular Lists">
        {isFetching ? (
          <Loading />
        ) : (
          <Lists lists={lists} />
        )}
      </Section>
    )
  }

  render() {
    return (
      <div>
        {this.renderWelcomeMessage()}
        {this.renderPopularFilms()}
        {this.renderPopularLists()}
      </div>
    )
  }
}

const mapStateToProps = ({ popularFilms, popularLists }) => ({
  popularFilms,
  popularLists,
})

const mapDispatchToProps = {
  loadPopularFilms,
  loadPopularLists,
  showMorePopularFilms,
  showLessPopularFilms,
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
