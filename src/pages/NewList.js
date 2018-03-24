import { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import Section from '../common/Section'
import ListForm from '../common/ListForm'
import { loadFilm, addListAndInvalidateLists } from '../redux/actions'

class NewList extends Component {
  static propTypes = {
    loadFilm: PropTypes.func.isRequired,
    addListAndInvalidateLists: PropTypes.func.isRequired,
    filmID: PropTypes.string,
    film: PropTypes.shape({
      Title: PropTypes.string.isRequired,
      Year: PropTypes.string.isRequired,
      imdbID: PropTypes.string.isRequired,
      Poster: PropTypes.string.isRequired,
    }),
    history: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
      push: PropTypes.func.isRequired,
    }).isRequired,
  }

  static defaultProps = {
    filmID: '',
    film: null,
  }

  componentDidMount() {
    document.title = 'New List - FilmList'
    if (this.props.filmID) {
      this.props.loadFilm(this.props.filmID)
    }
  }

  onSave = list => {
    this.props.addListAndInvalidateLists(list)
    .then(listID => this.props.history.push(`/list/${listID}`))
  }

  render() {
    const { filmID, film, history } = this.props
    const list = {
      subject: '',
      listedBy: '',
      passcode: '',
      description: '',
      films: [],
    }
    if (filmID && film) {
      const { Title: title, Year: year, imdbID, Poster: poster } = film
      list.films.push({
        title,
        year,
        imdbID,
        poster,
      })
    }
    return (
      <Section name="New List" large>
        {(!filmID || (filmID && film)) &&
        <ListForm
          list={list}
          onSave={this.onSave}
          onCancel={history.goBack}
        />
        }
      </Section>
    )
  }
}

const mapStateToProps = (state, props) => {
  const { filmByID } = state
  const { history, match } = props
  const { filmID } = match.params
  const film = filmByID[filmID]
  return {
    filmID,
    film: film && !film.isFetching ? film.film : undefined,
    history,
  }
}

const mapDispatchToProps = {
  loadFilm,
  addListAndInvalidateLists,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NewList))
