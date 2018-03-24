import { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Poster from '../common/Poster'
import TitleYear from '../common/TitleYear'
import Loading from '../common/Loading'
import Lists from '../common/Lists'
import { getRecommandedLists, getFilmShareLinks } from '../redux/selectors'
import { loadFilm, loadRelatedLists, loadRecentLists } from '../redux/actions'

class Film extends Component {
  static propTypes = {
    loadFilm: PropTypes.func.isRequired,
    loadRelatedLists: PropTypes.func.isRequired,
    loadRecentLists: PropTypes.func.isRequired,
    filmID: PropTypes.string.isRequired,
    film: PropTypes.shape({
      isFetching: PropTypes.bool,
      film: PropTypes.object,
    }),
    shareLinks: PropTypes.shape({
      twitter: PropTypes.string,
      facebook: PropTypes.string,
    }).isRequired,
    recommandedLists: PropTypes.shape({
      type: PropTypes.string,
      lists: PropTypes.arrayOf(PropTypes.shape({
        listID: PropTypes.string,
        posters: PropTypes.array,
        listedBy: PropTypes.string,
        filmCount: PropTypes.number,
        description: PropTypes.string,
      })),
    }),
  }

  static defaultProps = {
    film: null,
    recommandedLists: null,
  }

  componentDidMount() {
    this.loadData(this.props.filmID)
  }

  componentWillReceiveProps({ filmID }) {
    if (filmID !== this.props.filmID) {
      this.loadData(filmID)
    }
  }

  loadData(filmID) {
    this.props.loadFilm(filmID)
    .then(() => {
      const { Title, Year } = this.props.film.film
      document.title = `${Title} (${Year}) - FilmList`
    })
    this.props.loadRelatedLists(filmID)
    this.props.loadRecentLists()
  }

  renderFilmDetail(film) {
    const infoKeys = [
      'Genre',
      'Rated',
      'Runtime',
      'Released',
      'Language',
      'Country',
      'Production',
      'Metascore',
      'IMDb Rating',
      'Rotten Tomatoes',
    ]
    const crewKeys = [
      'Director',
      'Writers',
      'Cast',
    ]
    return (
      <div>
        <div className="row">
          <div className="col-md-5 mb-3">
            <Poster poster={film.Poster} />
          </div>
          <div className="col-md-7">
            <h1 className="mb-3">
              <TitleYear title={film.Title} year={film.Year} />
            </h1>
            <dl className="row">
              {infoKeys.map(key => (
                <Fragment key={key}>
                  <dt className="col-md-5">
                    {key}
                  </dt>
                  <dd className="col-md-7">
                    {film[key]}
                  </dd>
                </Fragment>
              ))}
            </dl>
          </div>
        </div>
        <div className="my-4">
          <h5>Plot Summary</h5>
          <p>{film.Plot}</p>
        </div>
        <div className="row">
          {crewKeys.map(key => (
            <div className="col-md mb-4" key={key}>
              <h5>{key}</h5>
              <ul className="list-unstyled">
                {film[key].map(name => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    )
  }

  renderActionButtons() {
    const { filmID, shareLinks } = this.props
    return (
      <div className="list-group mb-4">
        <Link
          className="list-group-item list-group-item-action"
          to={`/newlist/with/${filmID}`}
        >Add to List</Link>
        <Link
          className="list-group-item list-group-item-action"
          target="_blank"
          to={shareLinks.twitter}
        >Share on Twitter</Link>
        <Link
          className="list-group-item list-group-item-action"
          target="_blank"
          to={shareLinks.facebook}
        >Share on Facebook</Link>
      </div>
    )
  }

  renderRecommandedLists({ type, lists }) {
    return (
      <div>
        <h6 className="mb-0">{type} Lists</h6>
        <hr className="mt-1" />
        <Lists lists={lists} compact />
      </div>
    )
  }

  render() {
    const { film, recommandedLists } = this.props
    if (!film || film.isFetching) {
      return <Loading />
    }
    return (
      <div className="row">
        <section className="col-lg-9">
          {this.renderFilmDetail(film.film)}
        </section>
        <section className="col-lg">
          {this.renderActionButtons()}
          {recommandedLists &&
          this.renderRecommandedLists(recommandedLists)
          }
        </section>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  const { filmByID } = state
  const { filmID } = props.match.params
  return {
    filmID,
    film: filmByID[filmID],
    shareLinks: getFilmShareLinks(state, props),
    recommandedLists: getRecommandedLists(state, props),
  }
}

const mapDispatchToProps = {
  loadFilm,
  loadRecentLists,
  loadRelatedLists,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Film))
