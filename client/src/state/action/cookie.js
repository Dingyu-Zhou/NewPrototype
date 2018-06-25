import ActionPrefix from './action_prefix'

const ACTION_TYPE_SET_USER = [ActionPrefix.cookie, 'SET_USER'].join('')
const ACTION_TYPE_CLEAR_USER = [ActionPrefix.cookie, 'CLEAR_USER'].join('')

/**
  * This is a wrapper class for all cookie actions.
  */
export default class CookieAction {
  /**
    * A static getter to get the type of the action: set user
    * @type {string}
    */
  static get SET_USER () {
    return ACTION_TYPE_SET_USER
  }

  /**
    * A static getter to get the type of the action: clear user
    * @type {string}
    */
  static get CLEAR_USER () {
    return ACTION_TYPE_CLEAR_USER
  }

  /**
    * A static function to generate a SET USER action for the dispatcher.
    *
    * @param {{id: string, username: string, nickname: string, jwt: string}} user - a user object that has user's id, username, nickname, and assigned JSON Web Token in it.
    *
    * @return {object} a SET USER action for the dispatcher.
    * @property {string} type The type of the action: set user
    * @property {object} payload The payload for this action: user object
    */
  static setUser (user) {
    return {
      type: this.SET_USER,
      payload: user
    }
  }

  /**
    * A static function to generate a CLEAR USER action for the dispatcher.
    *
    * @return {object} a CLEAR USER action for the dispatcher.
    * @property {string} type The type of the action: clear user
    */
  static clearUser () {
    return {
      type: this.CLEAR_USER
    }
  }
}
