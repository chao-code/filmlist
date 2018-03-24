import deepFreeze from 'deep-freeze'
import * as ActionTypes from '../../src/redux/constants'
import * as mocks from '../mocks/dataMock'
import {
  popularFilms,
  filmByID,
  searchResultsByQuery,
  popularLists,
  recentLists,
  relatedListsByFilmID,
  listByID,
} from '../../src/redux/reducers'

describe('reducers', () => {
  describe('popularFilms reducer', () => {
    it('should return the initial state', () => {
      expect(popularFilms(undefined, {})).toEqual({
        isFetching: false,
        films: [],
        numShown: 4,
      })
    })

    it('should handle REQUEST_POPULAR_FILMS', () => {
      const action = {
        type: ActionTypes.REQUEST_POPULAR_FILMS,
      }
      deepFreeze(action)
      expect(popularFilms(undefined, action)).toEqual({
        isFetching: true,
        films: [],
        numShown: 4,
      })
    })

    it('should handle RECEIVE_POPULAR_FILMS', () => {
      const action = {
        type: ActionTypes.RECEIVE_POPULAR_FILMS,
        films: mocks.mockPopularFilms,
      }
      deepFreeze(action)
      expect(popularFilms(undefined, action)).toEqual({
        isFetching: false,
        films: action.films,
        numShown: 4,
      })
    })

    it('should handle SHOW_MORE_POPULAR_FILMS', () => {
      const state = {
        isFetching: false,
        films: mocks.mockPopularFilms,
        numShown: 96,
      }
      const action = {
        type: ActionTypes.SHOW_MORE_POPULAR_FILMS,
        increment: 8,
      }
      deepFreeze(state)
      deepFreeze(action)
      expect(popularFilms(undefined, action)).toEqual({
        isFetching: false,
        films: [],
        numShown: 12,
      })
      expect(popularFilms(state, action)).toEqual({
        isFetching: false,
        films: state.films,
        numShown: 100,
      })
    })

    it('should handle SHOW_LESS_POPULAR_FILMS', () => {
      const state = {
        isFetching: false,
        films: mocks.mockPopularFilms,
        numShown: 20,
      }
      const action = {
        type: ActionTypes.SHOW_LESS_POPULAR_FILMS,
        decrement: 8,
      }
      deepFreeze(state)
      deepFreeze(action)
      expect(popularFilms(undefined, action)).toEqual({
        isFetching: false,
        films: [],
        numShown: 4,
      })
      expect(popularFilms(state, action)).toEqual({
        isFetching: false,
        films: state.films,
        numShown: 12,
      })
    })
  })

  describe('filmByID reducer', () => {
    it('should return the initial state', () => {
      expect(filmByID(undefined, {})).toEqual({})
    })

    it('should handle REQUEST_FILM', () => {
      const filmID = mocks.mockFilmID
      const action = {
        type: ActionTypes.REQUEST_FILM,
        filmID,
      }
      deepFreeze(action)
      expect(filmByID({}, action)).toEqual({
        [filmID]: {
          isFetching: true,
          film: {},
        },
      })
    })

    it('should handle RECEIVE_FILM', () => {
      const filmID = mocks.mockFilmID
      const state = {
        [filmID]: {
          isFetching: true,
          film: {},
        },
      }
      const action = {
        type: ActionTypes.RECEIVE_FILM,
        filmID,
        film: mocks.mockFilmDetail,
      }
      deepFreeze(state)
      deepFreeze(action)
      expect(filmByID(state, action)).toEqual({
        [filmID]: {
          isFetching: false,
          film: action.film,
        },
      })
    })
  })

  describe('searchResultsByQuery reducer', () => {
    it('should return the initial state', () => {
      expect(searchResultsByQuery(undefined, {})).toEqual({})
    })

    it('should handle REQUEST_SEARCH', () => {
      const query = mocks.mockQuery
      const action = {
        type: ActionTypes.REQUEST_SEARCH,
        query,
      }
      deepFreeze(action)
      expect(searchResultsByQuery({}, action)).toEqual({
        [query]: {
          isFetching: true,
          results: [],
        },
      })
    })

    it('should handle RECEIVE_SEARCH', () => {
      const query = mocks.mockQuery
      const state = {
        [query]: {
          isFetching: true,
          results: [],
        },
      }
      const action = {
        type: ActionTypes.RECEIVE_SEARCH,
        query,
        results: mocks.mockSearchResults,
      }
      deepFreeze(state)
      deepFreeze(action)
      expect(searchResultsByQuery(state, action)).toEqual({
        [query]: {
          isFetching: false,
          results: action.results,
        },
      })
    })
  })

  describe('popularLists reducer', () => {
    it('should return the initial state', () => {
      expect(popularLists(undefined, {})).toEqual({
        isFetching: false,
        lists: [],
      })
    })

    it('should handle REQUEST_POPULAR_LISTS', () => {
      const action = {
        type: ActionTypes.REQUEST_POPULAR_LISTS,
      }
      deepFreeze(action)
      expect(popularLists(undefined, action)).toEqual({
        isFetching: true,
        lists: [],
      })
    })

    it('should handle RECEIVE_POPULAR_LISTS', () => {
      const action = {
        type: ActionTypes.RECEIVE_POPULAR_LISTS,
        lists: mocks.mockPopularLists,
      }
      deepFreeze(action)
      expect(popularLists(undefined, action)).toEqual({
        isFetching: false,
        lists: action.lists,
      })
    })

    it('should handle INVALIDATE_POPULAR_LISTS', () => {
      const state = {
        isFetching: false,
        lists: mocks.mockPopularLists,
      }
      const action = {
        type: ActionTypes.INVALIDATE_POPULAR_LISTS,
      }
      deepFreeze(state)
      deepFreeze(action)
      expect(popularLists(state, action)).toEqual({
        isFetching: false,
        lists: [],
      })
    })
  })

  describe('recentLists reducer', () => {
    it('should return the initial state', () => {
      expect(recentLists(undefined, {})).toEqual({
        isFetching: false,
        lists: [],
      })
    })

    it('should handle REQUEST_RECENT_LISTS', () => {
      const action = {
        type: ActionTypes.REQUEST_RECENT_LISTS,
      }
      deepFreeze(action)
      expect(recentLists(undefined, action)).toEqual({
        isFetching: true,
        lists: [],
      })
    })

    it('should handle RECEIVE_RECENT_LISTS', () => {
      const action = {
        type: ActionTypes.RECEIVE_RECENT_LISTS,
        lists: mocks.mockRecentLists,
      }
      deepFreeze(action)
      expect(recentLists(undefined, action)).toEqual({
        isFetching: false,
        lists: action.lists,
      })
    })

    it('should handle INVALIDATE_RECENT_LISTS', () => {
      const state = {
        isFetching: false,
        lists: mocks.mockRecentLists,
      }
      const action = {
        type: ActionTypes.INVALIDATE_RECENT_LISTS,
      }
      deepFreeze(state)
      deepFreeze(action)
      expect(recentLists(state, action)).toEqual({
        isFetching: false,
        lists: [],
      })
    })
  })

  describe('relatedListsByFilmID reducer', () => {
    it('should return the initial state', () => {
      expect(relatedListsByFilmID(undefined, {})).toEqual({})
    })

    it('should handle REQUEST_RELATED_LISTS', () => {
      const filmID = mocks.mockFilmID
      const action = {
        type: ActionTypes.REQUEST_RELATED_LISTS,
        filmID,
      }
      deepFreeze(action)
      expect(relatedListsByFilmID({}, action)).toEqual({
        [filmID]: {
          isFetching: true,
          lists: [],
        },
      })
    })

    it('should handle RECEIVE_RELATED_LISTS', () => {
      const filmID = mocks.mockFilmID
      const state = {
        [filmID]: {
          isFetching: true,
          lists: [],
        },
      }
      const action = {
        type: ActionTypes.RECEIVE_RELATED_LISTS,
        filmID,
        lists: mocks.mockRelatedLists,
      }
      deepFreeze(state)
      deepFreeze(action)
      expect(relatedListsByFilmID(state, action)).toEqual({
        [filmID]: {
          isFetching: false,
          lists: action.lists,
        },
      })
    })

    it('should handle INVALIDATE_RELATED_LISTS', () => {
      const filmID = mocks.mockFilmID
      const state = {
        [filmID]: {
          isFetching: false,
          lists: mocks.mockRelatedLists,
        },
        tt1: {
          isFetching: false,
          lists: mocks.mockRecentLists,
        },
      }
      const action = {
        type: ActionTypes.INVALIDATE_RELATED_LISTS,
        filmIDs: [filmID],
      }
      deepFreeze(state)
      deepFreeze(action)
      expect(relatedListsByFilmID(state, action)).toEqual({
        tt1: {
          isFetching: false,
          lists: mocks.mockRecentLists,
        },
      })
    })
  })

  describe('listByID reducer', () => {
    it('should return the initial state', () => {
      expect(listByID(undefined, {})).toEqual({})
    })

    it('should handle REQUEST_LIST', () => {
      const listID = mocks.mockListID
      const action = {
        type: ActionTypes.REQUEST_LIST,
        listID,
      }
      deepFreeze(action)
      expect(listByID({}, action)).toEqual({
        [listID]: {
          isFetching: true,
          list: {},
        },
      })
    })

    it('should handle RECEIVE_LIST', () => {
      const listID = mocks.mockListID
      const state = {
        [listID]: {
          isFetching: true,
          list: {},
        },
      }
      const action = {
        type: ActionTypes.RECEIVE_LIST,
        listID,
        list: mocks.mockListDetail,
      }
      deepFreeze(state)
      deepFreeze(action)
      expect(listByID(state, action)).toEqual({
        [listID]: {
          isFetching: false,
          list: action.list,
        },
      })
    })

    it('should handle REQUEST_ADD_LIST', () => {
      const action = {
        type: ActionTypes.REQUEST_ADD_LIST,
        list: mocks.mockListDetail,
      }
      deepFreeze(action)
      expect(listByID({}, action)).toEqual({})
    })

    it('should handle RECEIVE_ADD_LIST', () => {
      const listID = mocks.mockListID
      const action = {
        type: ActionTypes.RECEIVE_ADD_LIST,
        listID,
        list: mocks.mockListDetail,
      }
      deepFreeze(action)
      expect(listByID({}, action)).toEqual({
        [listID]: {
          isFetching: false,
          list: action.list,
        },
      })
    })

    it('should handle REQUEST_REMOVE_LIST', () => {
      const listID = mocks.mockListID
      const state = {
        [listID]: {
          isFetching: false,
          list: mocks.mockListDetail,
        },
      }
      const action = {
        type: ActionTypes.REQUEST_REMOVE_LIST,
        listID,
      }
      deepFreeze(state)
      deepFreeze(action)
      expect(listByID(state, action)).toEqual(state)
    })

    it('should handle RECEIVE_REMOVE_LIST', () => {
      const listID = mocks.mockListID
      const state = {
        [listID]: {
          isFetching: false,
          list: mocks.mockListDetail,
        },
      }
      const action = {
        type: ActionTypes.RECEIVE_REMOVE_LIST,
        listID,
      }
      deepFreeze(state)
      deepFreeze(action)
      expect(listByID(state, action)).toEqual({})
    })

    it('should handle REQUEST_EDIT_LIST', () => {
      const action = {
        type: ActionTypes.REQUEST_EDIT_LIST,
        listID: mocks.mockListID,
        edits: mocks.mockListEdits,
      }
      deepFreeze(action)
      expect(listByID({}, action)).toEqual({})
    })

    it('should handle RECEIVE_EDIT_LIST', () => {
      const listID = mocks.mockListID
      const state = {
        [listID]: {
          isFetching: false,
          list: mocks.mockListDetail,
        },
      }
      const action = {
        type: ActionTypes.RECEIVE_EDIT_LIST,
        listID,
        list: mocks.mockEditedList,
      }
      deepFreeze(state)
      deepFreeze(action)
      expect(listByID(state, action)).toEqual({
        [listID]: {
          isFetching: false,
          list: action.list,
        },
      })
    })

    it('should handle REQUEST_EDIT_POSTER', () => {
      const action = {
        type: ActionTypes.REQUEST_EDIT_POSTER,
        listID: mocks.mockListID,
        filmID: mocks.mockFilmID,
        poster: mocks.mockNewPoster,
      }
      deepFreeze(action)
      expect(listByID({}, action)).toEqual({})
    })

    it('should handle RECEIVE_EDIT_POSTER', () => {
      const listID = mocks.mockListID
      const state = {
        [listID]: {
          isFetching: false,
          list: mocks.mockListDetail,
        },
      }
      const action = {
        type: ActionTypes.RECEIVE_EDIT_POSTER,
        listID,
        filmID: mocks.mockFilmID,
        poster: mocks.mockNewPoster,
      }
      deepFreeze(state)
      deepFreeze(action)
      expect(listByID(state, action)).toEqual({
        [listID]: {
          isFetching: false,
          list: mocks.mockListWithNewPoster,
        },
      })
    })
  })
})
