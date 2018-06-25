import ActionPrefix from './action_prefix'

const ACTION_TYPE_SIGN_IN = [ActionPrefix.user, 'SIGN_IN'].join('')
const ACTION_TYPE_SIGN_OUT = [ActionPrefix.user, 'SIGN_OUT'].join('')

/**
  * This is a wrapper class for all user actions.
  */
export default class UserAction {
  /**
    * A static getter to get the type of the action: sign in
    * @type {string}
    */
  static get SIGN_IN () {
    return ACTION_TYPE_SIGN_IN
  }

  /**
    * A static getter to get the type of the action: sign out
    * @type {string}
    */
  static get SIGN_OUT () {
    return ACTION_TYPE_SIGN_OUT
  }

  /**
    * A static function to generate a SIGN IN action for the dispatcher.
    *
    * @param {{id: string, username: string, nickname: string, jwt: string}} user - a user object that has the user id, username, nickname, and assigned JSON Web Token in it.
    *
    * @return {object} a SIGN IN action for the dispatcher.
    * @property {string} type The type of the action: sign in
    * @property {object} payload The payload for this action: user object
    */
  static signIn (user) {
    return {
      type: this.SIGN_IN,
      payload: user
    }
  }

  /**
    * A static function to generate a SIGN OUT action for the dispatcher.
    *
    * @return {object} a SIGN OUT action for the dispatcher.
    * @property {string} type The type of the action: sign out
    */
  static signOut () {
    return {
      type: this.SIGN_OUT
    }
  }
}
