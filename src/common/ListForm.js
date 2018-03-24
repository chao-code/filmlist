import { Component } from 'react'
import PropTypes from 'prop-types'
import update from 'immutability-helper'
import classNames from 'classnames'
import FilmSearch from './FilmSearch'
import Button from './Button'
import Poster from './Poster'
import TitleYear from './TitleYear'

const indexArray = n => Array(n).fill().map((_, i) => `${i + 1}`)

class ListForm extends Component {
  static propTypes = {
    list: PropTypes.shape({
      subject: PropTypes.string,
      listedBy: PropTypes.string,
      passcode: PropTypes.string,
      description: PropTypes.string,
      films: PropTypes.array,
    }),
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  }

  static defaultProps = {
    list: {
      subject: '',
      listedBy: '',
      passcode: '',
      description: '',
      films: [],
    },
  }

  state = {
    ...this.props.list,
    indexInputs: indexArray(this.props.list.films.length),
    showInvalid: false,
    alert: null,
  }

  onInputChange = event => {
    const { value, name } = event.target
    this.setState({
      [name]: value,
      alert: null,
    })
  }

  onIndexInputChange = index => event => {
    const { value } = event.target
    this.setState(prevState => ({
      indexInputs: update(prevState.indexInputs, {
        [index]: { $set: value },
      }),
      alert: Number.isInteger(+value) ? null : {
        type: 'warning',
        message: `"${value}" is not a valid index. Please enter an number then press Enter.`,
      },
    }))
  }

  onCommentInputChange = index => event => {
    const { value } = event.target
    this.setState(prevState => ({
      films: update(prevState.films, {
        [index]: {
          comment: { $set: value },
        },
      }),
    }))
  }

  dismissAlert = () => this.setState({ alert: null })

  addFilm = newFilm => this.setState(prevState => {
    const { films, indexInputs } = prevState
    if (films.find(film => film.imdbID === newFilm.imdbID)) {
      return {
        alert: {
          type: 'info',
          message: `${newFilm.title} (${newFilm.year}) is already in the list.`,
        },
      }
    }
    return {
      films: [...films, newFilm],
      indexInputs: [...indexInputs, `${indexInputs.length + 1}`],
      alert: null,
    }
  })

  removeFilm = index => () => this.setState(prevState => {
    const { films } = prevState
    return {
      films: [...films.slice(0, index), ...films.slice(index + 1)],
      indexInputs: indexArray(films.length - 1),
      alert: null,
    }
  })

  moveFilm = index => event => {
    if (event.key !== 'Enter') return
    const { value } = event.target
    let newIndex = value - 1
    if (newIndex === index) return
    if (Number.isNaN(newIndex)) {
      this.setState(prevState => {
        const { indexInputs, films } = prevState
        const { title, year } = films[index]
        return {
          indexInputs: update(indexInputs, {
            [index]: { $set: `${index + 1}` },
          }),
          alert: {
            type: 'danger',
            message: `Cannot move ${title} (${year}). "${value}" is not a valid index.`,
          },
        }
      })
    } else {
      this.setState(({ films }) => {
        const film = films[index]
        if (newIndex < 0) {
          newIndex = 0
        }
        if (newIndex >= films.length) {
          newIndex = films.length - 1
        }
        return {
          films: update(films, { $splice: [[index, 1], [newIndex, 0, film]] }),
          indexInputs: indexArray(films.length),
          alert: null,
        }
      })
    }
  }

  save = () => {
    const { showInvalid, alert, indexInputs, ...list } = this.state
    if (!list.films.length) {
      this.setState({
        showInvalid: true,
        alert: {
          type: 'danger',
          message: 'Cannot save list. Please add a film.',
        },
      })
    } else if (!list.subject || !list.listedBy) {
      this.setState({
        showInvalid: true,
        alert: {
          type: 'danger',
          message: 'Cannot save list. Please fill in all required fields.',
        },
      })
    } else {
      this.props.onSave(list)
    }
  }

  cancel = () => this.props.onCancel()

  renderListInfo() {
    const { subject, listedBy, passcode, description, showInvalid } = this.state
    return (
      <div className="row">
        <div className="col-md">
          <div className="form-group">
            <label className="form-control-label" htmlFor="subjectInput">Subject</label>
            <input
              className={classNames('form-control', { 'is-invalid': showInvalid && !subject })}
              type="text"
              id="subjectInput"
              name="subject"
              value={subject || ''}
              onChange={this.onInputChange}
            />
            <small className={showInvalid && !subject ? 'invalid-feedback' : 'form-text text-muted'}>
              Required
            </small>
          </div>
          <div className="form-group">
            <label className="form-control-label" htmlFor="listedByInput">Listed By</label>
            <input
              className={classNames('form-control', { 'is-invalid': showInvalid && !listedBy })}
              type="text"
              id="listedByInput"
              name="listedBy"
              value={listedBy || ''}
              onChange={this.onInputChange}
            />
            <small className={showInvalid && !listedBy ? 'invalid-feedback' : 'form-text text-muted'}>
              Required
            </small>
          </div>
          <div className="form-group">
            <label className="form-control-label" htmlFor="passcodeInput">Passcode</label>
            <input
              className="form-control"
              type="text"
              id="passcodeInput"
              name="passcode"
              value={passcode || ''}
              onChange={this.onInputChange}
            />
            <small className="form-text text-muted">
              Use Passcode to edit or delete this list
            </small>
          </div>
        </div>
        <div className="col-md">
          <div className="form-group">
            <label className="form-control-label" htmlFor="descriptionInput">Description</label>
            <textarea
              className="form-control"
              id="descriptionInput"
              rows="10"
              name="description"
              value={description || ''}
              onChange={this.onInputChange}
            />
          </div>
        </div>
      </div>
    )
  }

  renderFormActions() {
    const { showInvalid, films } = this.state
    return (
      <div className="row my-4">
        <div className="col col-md">
          <div className="input-group">
            <div className="input-group-prepend">
              <div className="input-group-text">Add to List</div>
            </div>
            <FilmSearch
              inputClass={classNames({ 'is-invalid': showInvalid && !films.length })}
              resultsContainerClass="film-results"
              placeholder="Enter Film Name..."
              onResultClick={this.addFilm}
            />
          </div>
        </div>
        <div className="col-5 col-md">
          <Button primary className="float-right" onClick={this.save}>Save</Button>
          <Button secondary className="float-right mr-3" onClick={this.cancel}>Cancel</Button>
        </div>
      </div>
    )
  }

  renderAlertMessage() {
    const { type, message } = this.state.alert
    return (
      <div className={`alert fade show alert-${type}`}>
        {message}
        <button type="button" className="close" aria-label="Close" onClick={this.dismissAlert}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    )
  }

  renderListFilms() {
    const { films, indexInputs } = this.state
    return (
      <ul className="list-group">
        {films.map(({ title, year, poster, comment, imdbID }, index) => (
          <li className="list-group-item" key={imdbID}>
            <div className="row px-3">
              <div className="col-2 col-lg-1 px-1 px-md-2">
                <Poster poster={poster} />
              </div>
              <div className="col">
                <input
                  className="form-control text-center mr-2 py-1 px-1 mb-1 order-input"
                  type="text"
                  value={indexInputs[index]}
                  onChange={this.onIndexInputChange(index)}
                  onKeyPress={this.moveFilm(index)}
                />
                <h5 className="film-title">
                  <TitleYear title={title} year={year} />
                </h5>
                <input
                  className="form-control form-control-sm mt-3"
                  type="text"
                  placeholder="Add a Comment"
                  value={comment || ''}
                  onChange={this.onCommentInputChange(index)}
                />
              </div>
              <div className="col-1">
                <button className="close" onClick={this.removeFilm(index)}>
                  <span>&times;</span>
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    )
  }

  render() {
    return (
      <div>
        {this.renderListInfo()}
        {this.renderFormActions()}
        {this.state.alert &&
        this.renderAlertMessage()
        }
        {this.renderListFilms()}
      </div>
    )
  }
}

export default ListForm
