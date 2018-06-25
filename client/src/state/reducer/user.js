import { Map } from 'immutable'

import UserAction from '../action/user'

const INITIAL_USER_STATE = Map({
  id: null,
  hasSignedIn: false,
  jwt: null
})

/**
  * This is a wrapper class for the user reducer.
  */
export default class UserReducer {
  /**
    * A static getter to get the initial user state.
    * @type {ImmutableJS_Map}
    */
  static get initialState () {
    return INITIAL_USER_STATE
  }

  /**
    * The main user reducer function that returns a updated user state after processing an action.
    *
    * @param {ImmutableJS_Map} previousState - The previous user state.
    * @param {object} currentAction - The current user action object.
    *
    * @return {ImmutableJS_Map} A updated user state after processing an action
    */
  static reducerFunction (previousState = INITIAL_USER_STATE, currentAction) {
    switch (currentAction.type) {
      // sign in user
      case UserAction.SIGN_IN:
        const user = currentAction.payload
        return Map({
          id: user.id,
          username: user.username,
          nickname: user.nickname,
          hasSignedIn: true,
          jwt: user.jwt
        })

      // sign out user
      case UserAction.SIGN_OUT:
        return INITIAL_USER_STATE

      default:
        return previousState
    }
  }
}
