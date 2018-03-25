import * as ActionTypes from './constants'
import * as filmAPI from '../api/filmAPI'
import * as listAPI from '../api/listAPI'

const requestPopularFilms = () => ({
  type: ActionTypes.REQUEST_POPULAR_FILMS,
})

const receivePopularFilms = films => ({
  type: ActionTypes.RECEIVE_POPULAR_FILMS,
  films,
})

export const fetchPopularFilms = () => dispatch => {
  dispatch(requestPopularFilms())
  return (
    filmAPI.getPopularFilms()
    .then(films => dispatch(receivePopularFilms(films)))
  )
}

export const loadPopularFilms = () => (dispatch, getState) => {
  if (getState().popularFilms.films.length) {
    return Promise.resolve()
  }
  return dispatch(fetchPopularFilms())
}

export const showMorePopularFilms = increment => ({
  type: ActionTypes.SHOW_MORE_POPULAR_FILMS,
  increment,
})

export const showLessPopularFilms = decrement => ({
  type: ActionTypes.SHOW_LESS_POPULAR_FILMS,
  decrement,
})

const requestFilm = filmID => ({
  type: ActionTypes.REQUEST_FILM,
  filmID,
})

const receiveFilm = (filmID, film) => ({
  type: ActionTypes.RECEIVE_FILM,
  filmID,
  film,
})

export const fetchFilm = filmID => dispatch => {
  dispatch(requestFilm(filmID))
  return (
    filmAPI.getFilmDetail(filmID)
    .then(film => dispatch(receiveFilm(filmID, film)))
  )
}

export const loadFilm = filmID => (dispatch, getState) => {
  if (getState().filmByID[filmID]) {
    return Promise.resolve()
  }
  return dispatch(fetchFilm(filmID))
}

const requestSearch = query => ({
  type: ActionTypes.REQUEST_SEARCH,
  query,
})

const receiveSearch = (query, results) => ({
  type: ActionTypes.RECEIVE_SEARCH,
  query,
  results,
})

export const fetchSearch = query => dispatch => {
  dispatch(requestSearch(query))
  return (
    filmAPI.searchFilms(query)
    .then(results => dispatch(receiveSearch(query, results)))
  )
}

export const loadSearch = query => (dispatch, getState) => {
  if (getState().searchResultsByQuery[query]) {
    return Promise.resolve()
  }
  return dispatch(fetchSearch(query))
}

const requestPopularLists = () => ({
  type: ActionTypes.REQUEST_POPULAR_LISTS,
})

const receivePopularLists = lists => ({
  type: ActionTypes.RECEIVE_POPULAR_LISTS,
  lists,
})

export const fetchPopularLists = () => dispatch => {
  dispatch(requestPopularLists())
  return (
    listAPI.getPopularLists()
    .then(lists => dispatch(receivePopularLists(lists)))
  )
}

export const loadPopularLists = () => (dispatch, getState) => {
  if (getState().popularLists.lists.length) {
    return Promise.resolve()
  }
  return dispatch(fetchPopularLists())
}

const requestRecentLists = () => ({
  type: ActionTypes.REQUEST_RECENT_LISTS,
})

const receiveRecentLists = lists => ({
  type: ActionTypes.RECEIVE_RECENT_LISTS,
  lists,
})

export const fetchRecentLists = () => dispatch => {
  dispatch(requestRecentLists())
  return (
    listAPI.getRecentLists()
    .then(lists => dispatch(receiveRecentLists(lists)))
  )
}

export const loadRecentLists = () => (dispatch, getState) => {
  if (getState().recentLists.lists.length) {
    return Promise.resolve()
  }
  return dispatch(fetchRecentLists())
}

const requestRelatedLists = filmID => ({
  type: ActionTypes.REQUEST_RELATED_LISTS,
  filmID,
})

const receiveRelatedLists = (filmID, lists) => ({
  type: ActionTypes.RECEIVE_RELATED_LISTS,
  filmID,
  lists,
})

export const fetchRelatedLists = filmID => dispatch => {
  dispatch(requestRelatedLists(filmID))
  return (
    listAPI.getRelatedLists(filmID)
    .then(lists => dispatch(receiveRelatedLists(filmID, lists)))
  )
}

export const loadRelatedLists = filmID => (dispatch, getState) => {
  if (getState().relatedListsByFilmID[filmID]) {
    return Promise.resolve()
  }
  return dispatch(fetchRelatedLists(filmID))
}

const requestList = listID => ({
  type: ActionTypes.REQUEST_LIST,
  listID,
})

const receiveList = (listID, list) => ({
  type: ActionTypes.RECEIVE_LIST,
  listID,
  list,
})

export const fetchList = listID => dispatch => {
  dispatch(requestList(listID))
  return (
    listAPI.readList(listID)
    .then(list => dispatch(receiveList(listID, list)))
  )
}

export const loadList = listID => (dispatch, getState) => {
  listAPI.incrementViewCount(listID)
  if (getState().listByID[listID]) {
    return Promise.resolve()
  }
  return dispatch(fetchList(listID))
}

const requestAddList = list => ({
  type: ActionTypes.REQUEST_ADD_LIST,
  list,
})

const receiveAddList = (listID, list) => ({
  type: ActionTypes.RECEIVE_ADD_LIST,
  listID,
  list,
})

export const addList = list => dispatch => {
  dispatch(requestAddList(list))
  return (
    listAPI.createList(list)
    .then(listID => dispatch(receiveAddList(listID, list)))
  )
}

const requestRemoveList = listID => ({
  type: ActionTypes.REQUEST_REMOVE_LIST,
  listID,
})

const receiveRemoveList = listID => ({
  type: ActionTypes.RECEIVE_REMOVE_LIST,
  listID,
})

export const removeList = listID => dispatch => {
  dispatch(requestRemoveList(listID))
  return (
    listAPI.deleteList(listID)
    .then(() => dispatch(receiveRemoveList(listID)))
  )
}

const requestEditList = (listID, edits) => ({
  type: ActionTypes.REQUEST_EDIT_LIST,
  listID,
  edits,
})

const receiveEditList = (listID, list) => ({
  type: ActionTypes.RECEIVE_EDIT_LIST,
  listID,
  list,
})

export const editList = (listID, edits) => dispatch => {
  dispatch(requestEditList(listID, edits))
  return (
    listAPI.updateList(listID, edits)
    .then(list => dispatch(receiveEditList(listID, list)))
  )
}

const requestEditPoster = (listID, filmID, poster) => ({
  type: ActionTypes.REQUEST_EDIT_POSTER,
  listID,
  filmID,
  poster,
})

const receiveEditPoster = (listID, filmID, poster) => ({
  type: ActionTypes.RECEIVE_EDIT_POSTER,
  listID,
  filmID,
  poster,
})

export const editPoster = (listID, filmID, poster) => dispatch => {
  dispatch(requestEditPoster(listID, filmID, poster))
  return (
    listAPI.updatePoster(filmID, poster)
    .then(() => dispatch(receiveEditPoster(listID, filmID, poster)))
  )
}

export const loadListAndFilms = listID => (dispatch, getState) => (
  dispatch(loadList(listID))
  .then(() => {
    const { films } = getState().listByID[listID].list
    films.forEach(({ imdbID: filmID, poster }) => {
      dispatch(loadFilm(filmID)).then(() => {
        const { Poster } = getState().filmByID[filmID].film
        if (poster !== Poster) {
          dispatch(editPoster(listID, filmID, Poster))
        }
      })
    })
  })
)

const invalidatePopularLists = () => ({
  type: ActionTypes.INVALIDATE_POPULAR_LISTS,
})

const invalidateRecentLists = () => ({
  type: ActionTypes.INVALIDATE_RECENT_LISTS,
})

const invalidateRelatedLists = filmIDs => ({
  type: ActionTypes.INVALIDATE_RELATED_LISTS,
  filmIDs,
})

export const invalidateLists = filmIDs => dispatch => {
  dispatch(invalidatePopularLists())
  dispatch(invalidateRecentLists())
  dispatch(invalidateRelatedLists(filmIDs))
}

export const addListAndInvalidateLists = list => dispatch => {
  const filmIDs = list.films.map(film => film.imdbID)
  return (
    dispatch(addList(list))
    .then(({ listID }) => {
      dispatch(invalidateLists(filmIDs))
      return listID
    })
  )
}

export const removeListAndInvalidateLists = listID => (dispatch, getState) => {
  const { films } = getState().listByID[listID].list
  const filmIDs = films.map(film => film.imdbID)
  return (
    dispatch(removeList(listID))
    .then(() => dispatch(invalidateLists(filmIDs)))
  )
}

export const editListAndInvalidateLists = (listID, edits) => dispatch => {
  const { films, removedFilms } = edits
  const filmIDs = films.map(film => film.imdbID)
  const removedFilmIDs = Object.keys(removedFilms).filter(filmID => removedFilms[filmID])
  return (
    dispatch(editList(listID, edits))
    .then(() => dispatch(invalidateLists([...filmIDs, ...removedFilmIDs])))
  )
}
