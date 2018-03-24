import { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import $ from 'jquery'
import Poster from '../common/Poster'
import TitleYear from '../common/TitleYear'
import Lists from '../common/Lists'
import Button from '../common/Button'
import Loading from '../common/Loading'
import Section from '../common/Section'
import ListForm from '../common/ListForm'
import formatDate from '../utils/formatDate'
import sortFilms from '../utils/sortFilms'
import { getListShareLinks, getListWithFilmRatings } from '../redux/selectors'
import {
  loadListAndFilms,
  loadRecentLists,
  removeListAndInvalidateLists,
  editListAndInvalidateLists,
} from '../redux/actions'

class List extends Component {
  static propTypes = {
    loadListAndFilms: PropTypes.func.isRequired,
    loadRecentLists: PropTypes.func.isRequired,
    removeListAndInvalidateLists: PropTypes.func.isRequired,
    editListAndInvalidateLists: PropTypes.func.isRequired,
    listID: PropTypes.string.isRequired,
    list: PropTypes.shape({
      subject: PropTypes.string,
      listedBy: PropTypes.string,
      createdOn: PropTypes.number,
      passcode: PropTypes.string,
      description: PropTypes.string,
      filmCount: PropTypes.number,
      films: PropTypes.array,
    }),
    shareLinks: PropTypes.shape({
      twitter: PropTypes.string,
      facebook: PropTypes.string,
    }).isRequired,
    recommandedLists: PropTypes.arrayOf(PropTypes.shape({
      listID: PropTypes.string,
      posters: PropTypes.array,
      listedBy: PropTypes.string,
      filmCount: PropTypes.number,
      description: PropTypes.string,
    })),
    history: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    sort: PropTypes.string,
  }

  static defaultProps = {
    list: null,
    recommandedLists: null,
    sort: 'index',
  }

  state = {
    modal: {
      invalid: false,
      text: '',
      confirm: '',
      action: null,
    },
    isEditing: false,
  }

  componentDidMount() {
    this.loadData(this.props.listID)
  }

  componentWillReceiveProps({ listID }) {
    if (listID !== this.props.listID) {
      this.loadData(listID)
    }
  }

  loadData(listID) {
    this.props.loadListAndFilms(listID)
    .then(() => {
      document.title = `${this.props.list.subject} - FilmList`
    })
    this.props.loadRecentLists()
  }

  changeSort = event => {
    const { value } = event.target
    const { history, listID } = this.props
    let path = `/list/${listID}`
    if (value !== 'index') {
      path = `${path}/sort/${value}`
    }
    history.replace(path)
  }

  showEditModal = () => {
    this.setState({
      modal: {
        invalid: false,
        text: 'Enter the Passcode to start editing',
        confirm: 'Enter',
        action: this.showListForm,
      },
    })
    this.checkPasscodeInput.value = ''
    $('#modal').modal('show')
  }

  showDeleteModal = () => {
    this.setState({
      modal: {
        invalid: false,
        text: 'Enter the Passcode to delete this list',
        confirm: 'Delete',
        action: this.deleteList,
      },
    })
    this.checkPasscodeInput.value = ''
    $('#modal').modal('show')
  }

  checkPasscode = () => {
    if (this.checkPasscodeInput.value === this.props.list.passcode) {
      $('#modal').modal('hide')
      return true
    }
    this.setState(prevState => ({
      modal: {
        ...prevState.modal,
        invalid: true,
      },
    }))
    return false
  }

  showListForm = () => {
    if (this.checkPasscode()) {
      this.setState({ isEditing: true })
    }
  }

  hideListForm = () => {
    this.setState({ isEditing: false })
  }

  updateList = editedList => {
    const removedFilms = {}
    this.props.list.films.forEach(({ imdbID }) => { removedFilms[imdbID] = true })
    editedList.films.forEach(({ imdbID }) => { removedFilms[imdbID] = false })
    const edits = {
      ...editedList,
      removedFilms,
    }
    this.props.editListAndInvalidateLists(this.props.listID, edits)
    .then(() => {
      this.loadData(this.props.listID)
      this.hideListForm()
    })
  }

  deleteList = () => {
    if (this.checkPasscode()) {
      const { listID, history } = this.props
      this.props.removeListAndInvalidateLists(listID)
      .then(() => history.replace('/'))
    }
  }

  renderFilm(film, index) {
    return (
      <li className="my-4" key={film.imdbID}>
        <div className="row">
          <div className="col-2">
            <Link to={`/film/${film.imdbID}`}>
              <Poster poster={film.poster} />
            </Link>
          </div>
          <div className="col">
            <h4 className="mb-0">
              <Link to={`/film/${film.imdbID}`} className="link">
                {`${index + 1}. `}
                <TitleYear title={film.title} year={film.year} />
              </Link>
            </h4>
            <small>
              Metascore: {film.metascore} -
              IMDb Rating: {film.imdbRating} -
              Rotten Tomatoes: {film.rottenTomatoes}
            </small>
            {film.comment &&
            <div className="mt-2">
              {`"${film.comment}"`}
            </div>
            }
          </div>
        </div>
      </li>
    )
  }

  renderListDetail(list, sort) {
    const sortOptions = [
      { label: 'List Order', value: 'index' },
      { label: 'Title', value: 'title' },
      { label: 'Year', value: '-year' },
      { label: 'Metascore', value: '-metascore' },
      { label: 'IMDb Rating', value: '-imdbRating' },
      { label: 'Rotten Tomatoes', value: '-rottenTomatoes' },
    ]
    return (
      <div>
        <h2 className="mb-0">{list.subject}</h2>
        <small className="text-muted">
          By {list.listedBy}.
          Created on { formatDate(list.createdOn) }.
          {list.editedOn &&
          ` Last edited on ${formatDate(list.editedOn)}.`
          }
        </small>
        <p className="my-4 newline">{list.description}</p>
        <hr className="mb-2" />
        <div className="d-flex">
          <span className="mr-auto">Showing All {list.filmCount} Films</span>
          Sort by: &nbsp;
          <form className="form-inline">
            <select
              className="form-control form-control-sm"
              value={sort}
              onChange={this.changeSort}
            >
              {sortOptions.map(({ label, value }) => (
                <option value={value} key={value}>{label}</option>
              ))}
            </select>
          </form>
        </div>
        <ul className="list-unstyled">
          {sortFilms(list.films, sort).map((film, index) => this.renderFilm(film, index))}
        </ul>
      </div>
    )
  }

  renderActionButtons() {
    const { shareLinks } = this.props
    return (
      <div className="list-group mb-4">
        <button
          className="list-group-item list-group-item-action cursor-pointer"
          onClick={this.showEditModal}
        >Edit List</button>
        <button
          className="list-group-item list-group-item-action cursor-pointer"
          onClick={this.showDeleteModal}
        >Delete List</button>
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

  renderRecommandedLists(lists) {
    return (
      <div>
        <h6 className="mb-0">Recent Lists</h6>
        <hr className="mt-1" />
        <Lists lists={lists} compact />
      </div>
    )
  }

  renderCheckPasscode() {
    const { invalid, text, confirm, action } = this.state.modal
    return (
      <div className="modal fade" id="modal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Enter Passcode</h5>
              <button className="close" data-dismiss="modal">
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label
                  className="form-control-label"
                  htmlFor="checkPasscodeInput"
                >Passcode:</label>
                <input
                  className={classNames('form-control', { 'is-invalid': invalid })}
                  type="text"
                  id="checkPasscodeInput"
                  ref={input => { this.checkPasscodeInput = input }}
                />
                {invalid &&
                <small className="invalid-feedback">Wrong Passcode</small>
                }
                <small className="form-text text-muted">
                  {text}
                </small>
              </div>
            </div>
            <div className="modal-footer">
              <Button secondary data-dismiss="modal">Cancel</Button>
              <Button
                primary={confirm === 'Enter'}
                danger={confirm === 'Delete'}
                onClick={action}
              >{confirm}</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderListEditing() {
    return (
      <Section name="Edit List" large>
        <ListForm
          list={this.props.list}
          onSave={this.updateList}
          onCancel={this.hideListForm}
        />
      </Section>
    )
  }

  render() {
    const { list, sort, recommandedLists } = this.props
    if (!list) {
      return <Loading />
    }
    if (this.state.isEditing) {
      return this.renderListEditing()
    }
    return (
      <div className="row">
        <section className="col-lg-9">
          {this.renderListDetail(list, sort)}
        </section>
        <section className="col-lg">
          {this.renderActionButtons()}
          {recommandedLists &&
          this.renderRecommandedLists(recommandedLists)
          }
        </section>
        {this.renderCheckPasscode()}
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  const { recentLists } = state
  const { history, match } = props
  const { listID, sort } = match.params
  return {
    listID,
    list: getListWithFilmRatings(state, props),
    shareLinks: getListShareLinks(state, props),
    recommandedLists: recentLists.lists,
    history,
    sort,
  }
}

const mapDispatchToProps = {
  loadListAndFilms,
  loadRecentLists,
  removeListAndInvalidateLists,
  editListAndInvalidateLists,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(List))
