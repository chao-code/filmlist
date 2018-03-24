import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as ActionTypes from '../../src/redux/constants'
import * as actions from '../../src/redux/actions'
import * as mocks from '../mocks/dataMock'

jest.mock('../../src/api/filmAPI', () => ({
  getPopularFilms: jest.fn(() => Promise.resolve(mocks.mockPopularFilms)),
  getFilmDetail: jest.fn(() => Promise.resolve(mocks.mockFilmDetail)),
  searchFilms: jest.fn(() => Promise.resolve(mocks.mockSearchResults)),
}))

jest.mock('../../src/api/listAPI', () => ({
  getPopularLists: jest.fn(() => Promise.resolve(mocks.mockPopularLists)),
  getRecentLists: jest.fn(() => Promise.resolve(mocks.mockRecentLists)),
  getRelatedLists: jest.fn(() => Promise.resolve(mocks.mockRelatedLists)),
  readList: jest.fn(() => Promise.resolve(mocks.mockListDetail)),
  createList: jest.fn(() => Promise.resolve(mocks.mockListID)),
  deleteList: jest.fn(() => Promise.resolve()),
  updateList: jest.fn(() => Promise.resolve(mocks.mockEditedList)),
  updatePoster: jest.fn(() => Promise.resolve()),
}))

const middleware = [thunk]
const mockStore = configureMockStore(middleware)

describe('actions', () => {
  it('should create REQUEST_POPULAR_FILMS and RECEIVE_POPULAR_FILMS', () => {
    const store = mockStore({})
    const expectedActions = [
      { type: ActionTypes.REQUEST_POPULAR_FILMS },
      { type: ActionTypes.RECEIVE_POPULAR_FILMS, films: mocks.mockPopularFilms },
    ]

    return (
      store.dispatch(actions.fetchPopularFilms())
      .then(() => expect(store.getActions()).toEqual(expectedActions))
    )
  })

  it('should create SHOW_MORE_POPULAR_FILMS', () => {
    const increment = 8
    const expectedAction = {
      type: ActionTypes.SHOW_MORE_POPULAR_FILMS,
      increment,
    }
    expect(actions.showMorePopularFilms(increment)).toEqual(expectedAction)
  })

  it('should create SHOW_LESS_POPULAR_FILMS', () => {
    const decrement = 8
    const expectedAction = {
      type: ActionTypes.SHOW_LESS_POPULAR_FILMS,
      decrement,
    }
    expect(actions.showLessPopularFilms(decrement)).toEqual(expectedAction)
  })

  it('should create REQUEST_FILM and RECEIVE_FILM', () => {
    const store = mockStore({})
    const filmID = mocks.mockFilmID
    const expectedActions = [
      { type: ActionTypes.REQUEST_FILM, filmID },
      { type: ActionTypes.RECEIVE_FILM, filmID, film: mocks.mockFilmDetail },
    ]

    return (
      store.dispatch(actions.fetchFilm(filmID))
      .then(() => expect(store.getActions()).toEqual(expectedActions))
    )
  })

  it('should create REQUEST_SEARCH and RECEIVE_SEARCH', () => {
    const store = mockStore({})
    const query = mocks.mockQuery
    const expectedActions = [
      { type: ActionTypes.REQUEST_SEARCH, query },
      { type: ActionTypes.RECEIVE_SEARCH, query, results: mocks.mockSearchResults },
    ]

    return (
      store.dispatch(actions.fetchSearch(query))
      .then(() => expect(store.getActions()).toEqual(expectedActions))
    )
  })

  it('should create REQUEST_POPULAR_LISTS and RECEIVE_POPULAR_LISTS', () => {
    const store = mockStore({})
    const expectedActions = [
      { type: ActionTypes.REQUEST_POPULAR_LISTS },
      { type: ActionTypes.RECEIVE_POPULAR_LISTS, lists: mocks.mockPopularLists },
    ]

    return (
      store.dispatch(actions.fetchPopularLists())
      .then(() => expect(store.getActions()).toEqual(expectedActions))
    )
  })

  it('should create REQUEST_RECENT_LISTS and RECEIVE_RECENT_LISTS', () => {
    const store = mockStore({})
    const expectedActions = [
      { type: ActionTypes.REQUEST_RECENT_LISTS },
      { type: ActionTypes.RECEIVE_RECENT_LISTS, lists: mocks.mockRecentLists },
    ]

    return (
      store.dispatch(actions.fetchRecentLists())
      .then(() => expect(store.getActions()).toEqual(expectedActions))
    )
  })

  it('should create REQUEST_RELATED_LISTS and RECEIVE_RELATED_LISTS', () => {
    const store = mockStore({})
    const filmID = mocks.mockFilmID
    const expectedActions = [
      { type: ActionTypes.REQUEST_RELATED_LISTS, filmID },
      { type: ActionTypes.RECEIVE_RELATED_LISTS, filmID, lists: mocks.mockRelatedLists },
    ]

    return (
      store.dispatch(actions.fetchRelatedLists(filmID))
      .then(() => expect(store.getActions()).toEqual(expectedActions))
    )
  })

  it('should create REQUEST_LIST and RECEIVE_LIST', () => {
    const store = mockStore({})
    const listID = mocks.mockListID
    const expectedActions = [
      { type: ActionTypes.REQUEST_LIST, listID },
      { type: ActionTypes.RECEIVE_LIST, listID, list: mocks.mockListDetail },
    ]

    return (
      store.dispatch(actions.fetchList(listID))
      .then(() => expect(store.getActions()).toEqual(expectedActions))
    )
  })

  it('should create REQUEST_ADD_LIST and RECEIVE_ADD_LIST', () => {
    const store = mockStore({})
    const list = mocks.mockListDetail
    const expectedActions = [
      { type: ActionTypes.REQUEST_ADD_LIST, list },
      { type: ActionTypes.RECEIVE_ADD_LIST, list, listID: mocks.mockListID },
    ]

    return (
      store.dispatch(actions.addList(list))
      .then(() => expect(store.getActions()).toEqual(expectedActions))
    )
  })

  it('should create REQUEST_REMOVE_LIST and RECEIVE_REMOVE_LIST', () => {
    const store = mockStore({})
    const listID = mocks.mockListID
    const expectedActions = [
      { type: ActionTypes.REQUEST_REMOVE_LIST, listID },
      { type: ActionTypes.RECEIVE_REMOVE_LIST, listID },
    ]

    return (
      store.dispatch(actions.removeList(listID))
      .then(() => expect(store.getActions()).toEqual(expectedActions))
    )
  })

  it('should create REQUEST_EDIT_LIST and RECEIVE_EDIT_LIST', () => {
    const store = mockStore({})
    const listID = mocks.mockListID
    const edits = mocks.mockListEdits
    const expectedActions = [
      { type: ActionTypes.REQUEST_EDIT_LIST, listID, edits },
      { type: ActionTypes.RECEIVE_EDIT_LIST, listID, list: mocks.mockEditedList },
    ]

    return (
      store.dispatch(actions.editList(listID, edits))
      .then(() => expect(store.getActions()).toEqual(expectedActions))
    )
  })

  it('should create REQUEST_EDIT_POSTER and RECEIVE_EDIT_POSTER', () => {
    const store = mockStore({})
    const listID = mocks.mockListID
    const filmID = mocks.mockFilmID
    const poster = mocks.mockNewPoster
    const expectedActions = [
      { type: ActionTypes.REQUEST_EDIT_POSTER, listID, filmID, poster },
      { type: ActionTypes.RECEIVE_EDIT_POSTER, listID, filmID, poster },
    ]

    return (
      store.dispatch(actions.editPoster(listID, filmID, poster))
      .then(() => expect(store.getActions()).toEqual(expectedActions))
    )
  })

  it('should create INVALIDATE_POPULAR_LISTS, INVALIDATE_RECENT_LISTS, INVALIDATE_RELATED_LISTS', () => {
    const store = mockStore({})
    const filmIDs = ['tt1', 'tt2', 'tt3']
    const expectedActions = [
      { type: ActionTypes.INVALIDATE_POPULAR_LISTS },
      { type: ActionTypes.INVALIDATE_RECENT_LISTS },
      { type: ActionTypes.INVALIDATE_RELATED_LISTS, filmIDs },
    ]

    store.dispatch(actions.invalidateLists(filmIDs))
    expect(store.getActions()).toEqual(expectedActions)
  })
})
