import { createStore } from 'redux'

import RootReducer from './reducer/root'
import UserReducer from './reducer/user'

const appStateStore = createStore(
  RootReducer.reducerFunction,
  RootReducer.initialState
)

/**
  * This is a wrapper for the Redux to decouple Redux API from other code.
  */
export default class StateStore {
  /**
    * A static getter to get the Redux store instance.
    * @type {object}
    */
  static get reduxStore () {
    return appStateStore
  }

  /**
    * A static getter to get the current user state in the Redux store.
    * @type {ImmutableJS_Map}
    */
  static get user () {
    return appStateStore.getState().user || UserReducer.initialState
  }

  /**
    * Call this function to dispatch a Redux action.
    *
    * @param {object} action - A Redux action.
    */
  static dispatch (action) {
    appStateStore.dispatch(action)
  }
}
