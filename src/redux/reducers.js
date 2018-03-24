import update from 'immutability-helper'
import * as ActionTypes from './constants'

export const popularFilms = (state = {
  isFetching: false,
  films: [],
  numShown: 4,
}, action) => {
  switch (action.type) {
    case ActionTypes.REQUEST_POPULAR_FILMS:
      return {
        ...state,
        isFetching: true,
      }
    case ActionTypes.RECEIVE_POPULAR_FILMS:
      return {
        ...state,
        isFetching: false,
        films: action.films,
      }
    case ActionTypes.SHOW_MORE_POPULAR_FILMS:
      return {
        ...state,
        numShown: Math.min(100, state.numShown + action.increment),
      }
    case ActionTypes.SHOW_LESS_POPULAR_FILMS:
      return {
        ...state,
        numShown: Math.max(4, state.numShown - action.decrement),
      }
    default:
      return state
  }
}

const film = (state = {
  isFetching: false,
  film: {},
}, action) => {
  switch (action.type) {
    case ActionTypes.REQUEST_FILM:
      return {
        ...state,
        isFetching: true,
      }
    case ActionTypes.RECEIVE_FILM:
      return {
        ...state,
        isFetching: false,
        film: action.film,
      }
    default:
      return state
  }
}

export const filmByID = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.REQUEST_FILM:
    case ActionTypes.RECEIVE_FILM:
      return {
        ...state,
        [action.filmID]: film(state[action.filmID], action),
      }
    default:
      return state
  }
}

const searchResults = (state = {
  isFetching: false,
  results: [],
}, action) => {
  switch (action.type) {
    case ActionTypes.REQUEST_SEARCH:
      return {
        ...state,
        isFetching: true,
      }
    case ActionTypes.RECEIVE_SEARCH:
      return {
        ...state,
        isFetching: false,
        results: action.results,
      }
    default:
      return state
  }
}

export const searchResultsByQuery = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.REQUEST_SEARCH:
    case ActionTypes.RECEIVE_SEARCH:
      return {
        ...state,
        [action.query]: searchResults(state[action.query], action),
      }
    default:
      return state
  }
}

export const popularLists = (state = {
  isFetching: false,
  lists: [],
}, action) => {
  switch (action.type) {
    case ActionTypes.REQUEST_POPULAR_LISTS:
      return {
        ...state,
        isFetching: true,
      }
    case ActionTypes.RECEIVE_POPULAR_LISTS:
      return {
        ...state,
        isFetching: false,
        lists: action.lists,
      }
    case ActionTypes.INVALIDATE_POPULAR_LISTS:
      return {
        ...state,
        isFetching: false,
        lists: [],
      }
    default:
      return state
  }
}

export const recentLists = (state = {
  isFetching: false,
  lists: [],
}, action) => {
  switch (action.type) {
    case ActionTypes.REQUEST_RECENT_LISTS:
      return {
        ...state,
        isFetching: true,
      }
    case ActionTypes.RECEIVE_RECENT_LISTS:
      return {
        ...state,
        isFetching: false,
        lists: action.lists,
      }
    case ActionTypes.INVALIDATE_RECENT_LISTS:
      return {
        ...state,
        isFetching: false,
        lists: [],
      }
    default:
      return state
  }
}

const relatedLists = (state = {
  isFetching: false,
  lists: [],
}, action) => {
  switch (action.type) {
    case ActionTypes.REQUEST_RELATED_LISTS:
      return {
        ...state,
        isFetching: true,
      }
    case ActionTypes.RECEIVE_RELATED_LISTS:
      return {
        ...state,
        isFetching: false,
        lists: action.lists,
      }
    case ActionTypes.INVALIDATE_POPULAR_LISTS:
      return update(state, { $unset: action.filmIDs })
    default:
      return state
  }
}

export const relatedListsByFilmID = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.REQUEST_RELATED_LISTS:
    case ActionTypes.RECEIVE_RELATED_LISTS:
      return {
        ...state,
        [action.filmID]: relatedLists(state[action.filmID], action),
      }
    case ActionTypes.INVALIDATE_RELATED_LISTS:
      return update(state, { $unset: action.filmIDs })
    default:
      return state
  }
}

const list = (state = {
  isFetching: false,
  list: {},
}, action) => {
  switch (action.type) {
    case ActionTypes.REQUEST_LIST:
      return {
        ...state,
        isFetching: true,
      }
    case ActionTypes.RECEIVE_LIST:
    case ActionTypes.RECEIVE_ADD_LIST:
    case ActionTypes.RECEIVE_EDIT_LIST:
      return {
        ...state,
        isFetching: false,
        list: action.list,
      }
    case ActionTypes.RECEIVE_EDIT_POSTER:
      return update(state, {
        list: {
          films: films => films.map(filmInfo => (
            filmInfo.imdbID === action.filmID
              ? { ...filmInfo, poster: action.poster }
              : filmInfo
          )),
        },
      })
    default:
      return state
  }
}

export const listByID = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.REQUEST_LIST:
    case ActionTypes.RECEIVE_LIST:
    case ActionTypes.RECEIVE_ADD_LIST:
    case ActionTypes.RECEIVE_EDIT_LIST:
    case ActionTypes.RECEIVE_EDIT_POSTER:
      return {
        ...state,
        [action.listID]: list(state[action.listID], action),
      }
    case ActionTypes.RECEIVE_REMOVE_LIST:
      return update(state, { $unset: [action.listID] })
    default:
      return state
  }
}
