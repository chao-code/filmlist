import { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { loadSearch } from '../redux/actions'
import debounce from '../utils/debounce'
import Poster from './Poster'
import TitleYear from './TitleYear'

class FilmSearch extends Component {
  static propTypes = {
    inputClass: PropTypes.string,
    resultsContainerClass: PropTypes.string,
    placeholder: PropTypes.string,
    onResultClick: PropTypes.func,
    keepFocusOnResultClick: PropTypes.bool,
    loadSearch: PropTypes.func.isRequired,
    searchResultsByQuery: PropTypes.objectOf(PropTypes.shape({
      isFetching: PropTypes.bool,
      results: PropTypes.array,
    })).isRequired,
  }

  static defaultProps = {
    inputClass: '',
    resultsContainerClass: '',
    placeholder: '',
    onResultClick: () => {},
    keepFocusOnResultClick: false,
  }

  state = {
    value: '',
    results: null,
    isLoading: false,
    isFocused: false,
  }

  onInputChange = event => {
    const value = event.target.value
    this.setState({ value })
    this.search(value.trim())
  }

  onInputFocus = () => {
    this.setState({ isFocused: true })
  }

  onInputBlur = () => {
    if (!this.justMouseDownOnResultsContainer) {
      this.setState({ isFocused: false })
    }
  }

  onResultClick = result => {
    this.justClickedOnResult = true
    this.props.onResultClick(result)
    this.setState({
      value: '',
      results: null,
      isFocused: false,
    })
  }

  onResultsContainerMouseDown = () => {
    this.justMouseDownOnResultsContainer = true
  }

  onResultsContainerClick = () => {
    this.justMouseDownOnResultsContainer = false
    if (this.justClickedOnResult) {
      this.justClickedOnResult = false
      this.props.keepFocusOnResultClick && this.input.focus()
    } else {
      this.input.focus()
    }
  }

  search = debounce(query => {
    if (query === '') {
      this.setState({ results: null })
    } else {
      this.setState({ isLoading: true })
      this.props.loadSearch(query)
      .then(() => this.setState({
        results: this.props.searchResultsByQuery[query].results,
        isLoading: false,
      }))
    }
  }, 500)

  renderResult(result) {
    const { poster, title, year, imdbID } = result
    const liProps = {
      className: 'dropdown-item',
      onClick: () => { this.onResultClick(result) },
      key: imdbID,
    }

    return (
      <li {...liProps}>
        <div className="row cursor-pointer">
          <div className="col-3">
            <Poster poster={poster} />
          </div>
          <div className="col">
            <TitleYear title={title} year={year} />
          </div>
        </div>
      </li>
    )
  }

  renderNoResults() {
    return (
      <div className="dropdown-item no-results">
        Sorry, there are no results for that search.
      </div>
    )
  }

  renderResultsContainer() {
    const { resultsContainerClass } = this.props
    const { results } = this.state
    const containerProps = {
      className: classNames('dropdown-menu bd-search-results', resultsContainerClass),
      onMouseDown: this.onResultsContainerMouseDown,
      onClick: this.onResultsContainerClick,
    }

    return (
      <div {...containerProps}>
        {results.length > 0 ? (
          results.map(result => this.renderResult(result))
        ) : (
          this.renderNoResults()
        )}
      </div>
    )
  }

  render() {
    const { inputClass, placeholder } = this.props
    const { value, results, isLoading, isFocused } = this.state
    const inputProps = {
      className: classNames('form-control', { 'bd-search-loading': isLoading }, inputClass),
      value,
      placeholder,
      type: 'search',
      onChange: this.onInputChange,
      onFocus: this.onInputFocus,
      onBlur: this.onInputBlur,
      ref: input => { this.input = input },
    }

    return (
      <Fragment>
        <input {...inputProps} />
        {results && isFocused &&
          this.renderResultsContainer()
        }
      </Fragment>
    )
  }
}

export { FilmSearch as _FilmSearch }

const mapStateToProps = ({ searchResultsByQuery }) => ({ searchResultsByQuery })

const mapDispatchToProps = { loadSearch }

export default connect(mapStateToProps, mapDispatchToProps)(FilmSearch)
