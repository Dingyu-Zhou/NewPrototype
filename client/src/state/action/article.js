import ActionPrefix from './action_prefix'

const ACTION_TYPE_TITLE_CHANGED = [ActionPrefix.article, 'TITLE_CHANGED'].join('')
const ACTION_TYPE_BODY_CHANGED = [ActionPrefix.article, 'BODY_CHANGED'].join('')

/**
  * This is a wrapper class for all article actions.
  */
export default class ArticleAction {
  /**
    * A static getter to get the type of the action: article title changed
    * @type {string}
    */
  static get TITLE_CHANGED () {
    return ACTION_TYPE_TITLE_CHANGED
  }

  /**
    * A static getter to get the type of the action: article body changed
    * @type {string}
    */
  static get BODY_CHANGED () {
    return ACTION_TYPE_BODY_CHANGED
  }

  /**
    * A static function to generate a TITLE CHANGED action for the dispatcher.
    *
    * @param {{id: string, title: string}} article - an article object that has the article id, and the article title in it.
    *
    * @return {object} a TITLE CHANGED action for the dispatcher.
    * @property {string} type The type of the action: article title changed
    * @property {object} payload The payload for this action: article object
    */
  static titleChanged (article) {
    return {
      type: this.TITLE_CHANGED,
      payload: article
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
      type: this.BODY_CHANGED
    }
  }
}
