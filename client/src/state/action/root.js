import ActionPrefix from './action_prefix'

const ACTION_TYPE_RESET_STATE = [ActionPrefix.root, 'RESET_STATE'].join('')

/**
  * This is a wrapper class for all root actions.
  */
export default class RootAction {
  /**
    * A static getter to get the type of the action: reset root state
    * @type {string}
    */
  static get RESET_STATE () {
    return ACTION_TYPE_RESET_STATE
  }

  /**
    * A static function to generate a RESET STATE action for the dispatcher.
    *
    * @return {object} a RESET STATE action for the dispatcher.
    * @property {string} type The type of the action: reset root state
    */
  static resetState () {
    return {
      type: this.RESET_STATE
    }
  }
}
