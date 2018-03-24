import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import * as reducers from './reducers'

const middleware = [thunk]
if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
  middleware.push(logger)
}

const configureStore = initialState => createStore(
  combineReducers(reducers),
  initialState,
  applyMiddleware(...middleware),
)

export default configureStore
