import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // default: localStorage if web, AsyncStorage if react-native

import CookieReducer from './cookie'
import UserReducer from './user'
import ArticleReducer from './article'

import RootAction from '../action/root'

const cookiePersistConfig = {
  key: 'cookie',
  storage
}

const appReducer = combineReducers({
  cookie: persistReducer(cookiePersistConfig, CookieReducer.reducerFunction),
  user: UserReducer.reducerFunction,
  article: ArticleReducer.reducerFunction
})

const INITIAL_ROOT_STATE = {
  cookie: undefined,
  user: undefined,
  article: undefined
}

/**
  * This is a wrapper class for the root reducer.
  */
export default class RootReducer {
  /**
    * A static getter to get the initial root state.
    * @type {ImmutableJS_Map}
    */
  static get initialState () {
    return INITIAL_ROOT_STATE
  }

  /**
    * The main root reducer function that modifies the previous root state according to some global actions before dispatch.
    *
    * @param {ImmutableJS_Map} previousState - The previous root state.
    * @param {object} currentAction - The current action object.
    *
    * @return {object} The app reducer with the modified previous state.
    */
  static reducerFunction (previousState = INITIAL_ROOT_STATE, currentAction) {
    let modifiedPreviousState = null

    switch (currentAction.type) {
      // sign out user
      case RootAction.RESET_STATE:
        modifiedPreviousState = Object.assign({}, previousState, INITIAL_ROOT_STATE)
        break

      default:
        modifiedPreviousState = previousState
    }

    return appReducer(modifiedPreviousState, currentAction)
  }
}
