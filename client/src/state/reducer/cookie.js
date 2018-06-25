import CookieAction from '../action/cookie'

const DEFAULT_USER_STATE = null

const INITIAL_COOKIE_STATE = {
  user: DEFAULT_USER_STATE
}

/**
  * This is a wrapper class for the cookie reducer.
  */
export default class CookieReducer {
  /**
    * A static getter to get the initial cookie state.
    * @type {object}
    */
  static get initialState () {
    return INITIAL_COOKIE_STATE
  }

  /**
    * The main cookie reducer function that returns a updated cookie state after processing an action.
    * Using a plain JaveScript object as the cookie state is because the redux-persist doesn't support ImmutableJS natively.
    *
    * @param {object} previousState - The previous cookie state.
    * @param {object} currentAction - The current cookie action object.
    *
    * @return {object} A updated cookie state after processing an action
    */
  static reducerFunction (previousState = INITIAL_COOKIE_STATE, currentAction) {
    let newState = null

    switch (currentAction.type) {
      // set user
      case CookieAction.SET_USER:
        const user = currentAction.payload
        newState = Object.assign({}, previousState)
        newState.user = {
          id: user.id,
          username: user.username,
          nickname: user.nickname,
          hasSignedIn: true,
          jwt: user.jwt
        }
        return newState

      // clear user
      case CookieAction.CLEAR_USER:
        newState = Object.assign({}, previousState)
        newState.user = DEFAULT_USER_STATE
        return newState

      default:
        return previousState
    }
  }
}
