import configureStore from '../../src/redux/store'
import * as actions from '../../src/redux/actions'
import * as filmAPI from '../../src/api/filmAPI'
import * as listAPI from '../../src/api/listAPI'
import {
  mockPopularFilms,
  mockFilmDetail,
  mockSearchResults,
  mockPopularLists,
  mockRecentLists,
  mockRelatedLists,
  mockListDetail,
  mockListEdits,
  mockEditedList,
  mockFilmID,
  mockListID,
  mockQuery,
} from '../mocks/dataMock'

jest.mock('../../src/api/filmAPI', () => ({
  getPopularFilms: jest.fn(() => Promise.resolve(mockPopularFilms)),
  getFilmDetail: jest.fn(() => Promise.resolve(mockFilmDetail)),
  searchFilms: jest.fn(() => Promise.resolve(mockSearchResults)),
}))

jest.mock('../../src/api/listAPI', () => ({
  getPopularLists: jest.fn(() => Promise.resolve(mockPopularLists)),
  getRecentLists: jest.fn(() => Promise.resolve(mockRecentLists)),
  getRelatedLists: jest.fn(() => Promise.resolve(mockRelatedLists)),
  readList: jest.fn(() => Promise.resolve(mockListDetail)),
  createList: jest.fn(() => Promise.resolve(mockListID)),
  deleteList: jest.fn(() => Promise.resolve()),
  updateList: jest.fn(() => Promise.resolve(mockEditedList)),
  updatePoster: jest.fn(() => Promise.resolve()),
  incrementViewCount: jest.fn(),
}))

describe('store', () => {
  let store

  beforeEach(() => {
    store = configureStore()
  })

  afterEach(() => {
    Object.keys(filmAPI.default).forEach(key => filmAPI[key].mockClear())
    Object.keys(listAPI.default).forEach(key => listAPI[key].mockClear())
  })

  it('should have initial state', () => {
    const initialState = {
      popularFilms: {
        isFetching: false,
        films: [],
        numShown: 4,
      },
      filmByID: {},
      searchResultsByQuery: {},
      popularLists: {
        isFetching: false,
        lists: [],
      },
      recentLists: {
        isFetching: false,
        lists: [],
      },
      relatedListsByFilmID: {},
      listByID: {},
    }
    expect(store.getState()).toEqual(initialState)
  })

  it('should load and cache popular films', () => (
    store.dispatch(actions.loadPopularFilms())
    .then(() => {
      const popularFilms = store.getState().popularFilms.films
      expect(popularFilms).toEqual(mockPopularFilms)
    })
    .then(() => store.dispatch(actions.loadPopularFilms()))
    .then(() => {
      expect(filmAPI.getPopularFilms.mock.calls.length).toBe(1)
    })
  ))

  it('should load and cache a film', () => (
    store.dispatch(actions.loadFilm(mockFilmID))
    .then(() => {
      const filmDetail = store.getState().filmByID[mockFilmID].film
      expect(filmDetail).toEqual(mockFilmDetail)
    })
    .then(() => store.dispatch(actions.loadFilm(mockFilmID)))
    .then(() => {
      expect(filmAPI.getFilmDetail.mock.calls.length).toBe(1)
    })
  ))

  it('should load and cache search results', () => (
    store.dispatch(actions.loadSearch(mockQuery))
    .then(() => {
      const results = store.getState().searchResultsByQuery[mockQuery].results
      expect(results).toEqual(mockSearchResults)
    })
    .then(() => store.dispatch(actions.loadSearch(mockQuery)))
    .then(() => {
      expect(filmAPI.searchFilms.mock.calls.length).toBe(1)
    })
  ))

  it('should load and cache popular lists', () => (
    store.dispatch(actions.loadPopularLists())
    .then(() => {
      const popularLists = store.getState().popularLists.lists
      expect(popularLists).toEqual(mockPopularLists)
    })
    .then(() => store.dispatch(actions.loadPopularLists()))
    .then(() => {
      expect(listAPI.getPopularLists.mock.calls.length).toBe(1)
    })
  ))

  it('should load and cache recent lists', () => (
    store.dispatch(actions.loadRecentLists())
    .then(() => {
      const recentLists = store.getState().recentLists.lists
      expect(recentLists).toEqual(mockRecentLists)
    })
    .then(() => store.dispatch(actions.loadRecentLists()))
    .then(() => {
      expect(listAPI.getRecentLists.mock.calls.length).toBe(1)
    })
  ))

  it('should load and cache related lists', () => (
    store.dispatch(actions.loadRelatedLists(mockFilmID))
    .then(() => {
      const relatedLists = store.getState().relatedListsByFilmID[mockFilmID].lists
      expect(relatedLists).toEqual(mockRelatedLists)
    })
    .then(() => store.dispatch(actions.loadRelatedLists(mockFilmID)))
    .then(() => {
      expect(listAPI.getRelatedLists.mock.calls.length).toBe(1)
    })
  ))

  it('should load and cache a list', () => (
    store.dispatch(actions.loadList(mockListID))
    .then(() => {
      const listDetail = store.getState().listByID[mockListID].list
      expect(listDetail).toEqual(mockListDetail)
    })
    .then(() => store.dispatch(actions.loadList(mockListID)))
    .then(() => {
      expect(listAPI.readList.mock.calls.length).toBe(1)
      expect(listAPI.incrementViewCount.mock.calls.length).toBe(2)
    })
  ))

  it('should add a list', () => (
    store.dispatch(actions.addList(mockListDetail))
    .then(({ listID }) => {
      const listDetail = store.getState().listByID[listID].list
      expect(listDetail).toEqual(mockListDetail)
      expect(listAPI.createList.mock.calls.length).toBe(1)
    })
  ))

  it('should delete a list', () => (
    store.dispatch(actions.loadList(mockListID))
    .then(() => store.dispatch(actions.removeList(mockListID)))
    .then(() => {
      const list = store.getState().listByID[mockListID]
      expect(list).toBeUndefined()
      expect(listAPI.deleteList.mock.calls.length).toBe(1)
    })
  ))

  it('should edit a list', () => (
    store.dispatch(actions.loadList(mockListID))
    .then(() => store.dispatch(actions.editList(mockListID, mockListEdits)))
    .then(() => {
      const listDetail = store.getState().listByID[mockListID].list
      expect(listDetail).toEqual(mockEditedList)
      expect(listAPI.updateList.mock.calls.length).toBe(1)
    })
  ))

  it('should load a list and its films', () => (
    store.dispatch(actions.loadListAndFilms(mockListID))
    .then(() => {
      const listDetail = store.getState().listByID[mockListID].list
      expect(listDetail).toEqual(mockListDetail)
      expect(listAPI.readList.mock.calls.length).toBe(1)
      expect(filmAPI.getFilmDetail.mock.calls.length).toBe(mockListDetail.films.length)
    })
  ))

  it('should add a list and invalidate lists', () => (
    store.dispatch(actions.loadPopularLists())
    .then(() => store.dispatch(actions.loadRecentLists()))
    .then(() => store.dispatch(actions.loadRelatedLists(mockListDetail.films[0].imdbID)))
    .then(() => store.dispatch(actions.addListAndInvalidateLists(mockListDetail)))
    .then(listID => {
      const { listByID, popularLists, recentLists, relatedListsByFilmID } = store.getState()
      const emptyLists = {
        isFetching: false,
        lists: [],
      }
      expect(listByID[listID].list).toEqual(mockListDetail)
      expect(popularLists).toEqual(emptyLists)
      expect(recentLists).toEqual(emptyLists)
      expect(relatedListsByFilmID[mockListDetail.films[0].imdbID]).toBeUndefined()
    })
  ))

  it('should remove a list and invalidate lists', () => (
    store.dispatch(actions.loadList(mockListID))
    .then(() => store.dispatch(actions.loadPopularLists()))
    .then(() => store.dispatch(actions.loadRecentLists()))
    .then(() => store.dispatch(actions.loadRelatedLists(mockListDetail.films[1].imdbID)))
    .then(() => store.dispatch(actions.removeListAndInvalidateLists(mockListID)))
    .then(() => {
      const { listByID, popularLists, recentLists, relatedListsByFilmID } = store.getState()
      const emptyLists = {
        isFetching: false,
        lists: [],
      }
      expect(listByID[mockListID]).toBeUndefined()
      expect(popularLists).toEqual(emptyLists)
      expect(recentLists).toEqual(emptyLists)
      expect(relatedListsByFilmID[mockListDetail.films[1].imdbID]).toBeUndefined()
    })
  ))

  it('should edit a list and invalidate lists', () => (
    store.dispatch(actions.loadList(mockListID))
    .then(() => store.dispatch(actions.loadPopularLists()))
    .then(() => store.dispatch(actions.loadRecentLists()))
    .then(() => store.dispatch(actions.loadRelatedLists(mockListDetail.films[2].imdbID)))
    .then(() => store.dispatch(actions.editListAndInvalidateLists(mockListID, {
      ...mockListEdits,
      removedFilms: {},
    })))
    .then(() => {
      const { listByID, popularLists, recentLists, relatedListsByFilmID } = store.getState()
      const emptyLists = {
        isFetching: false,
        lists: [],
      }
      expect(listByID[mockListID].list).toEqual(mockEditedList)
      expect(popularLists).toEqual(emptyLists)
      expect(recentLists).toEqual(emptyLists)
      expect(relatedListsByFilmID[mockListDetail.films[2].imdbID]).toBeUndefined()
    })
  ))
})
