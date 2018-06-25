/**
  * Define all action prefix here to avoid the action type collision.
  */
export default class ActionPrefix {
  /**
    * A static getter to get the prefix for all root actions
    * @type {string}
    */
  static get root () {
    return 'ROOT_'
  }

  /**
    * A static getter to get the prefix for all cookie actions
    * @type {string}
    */
  static get cookie () {
    return 'COOKIE_'
  }

  /**
    * A static getter to get the prefix for all user actions
    * @type {string}
    */
  static get user () {
    return 'USER_'
  }

  /**
    * A static getter to get the prefix for all article actions
    * @type {string}
    */
  static get article () {
    return 'ARTICLE_'
  }
}
