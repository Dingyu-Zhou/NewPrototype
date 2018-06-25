import { Map } from 'immutable'

import ArticleAction from '../action/article'

const INITIAL_ARTICLE_STATE = Map({
  titleMap: Map(),   // titleMap: { articleId: articleTitle }
  bodyMap: Map()   // bodyMap: { articleId: articleBody }
})

/**
  * This is a wrapper class for the article reducer.
  */
export default class ArticleReducer {
  /**
    * A static getter to get the initial article state.
    * @type {ImmutableJS_Map}
    */
  static get initialState () {
    return INITIAL_ARTICLE_STATE
  }

  /**
    * The main article reducer function that returns a updated article state after processing an action.
    *
    * @param {ImmutableJS_Map} previousState - The previous article state.
    * @param {object} currentAction - The current article action object.
    *
    * @return {ImmutableJS_Map} A updated article state after processing an action
    */
  static reducerFunction (previousState = INITIAL_ARTICLE_STATE, currentAction) {
    switch (currentAction.type) {
      // article title changed
      case ArticleAction.TITLE_CHANGED:
        const article = currentAction.payload
        let titleMap = previousState.get('titleMap')
        const newState = previousState.set('titleMap', titleMap.set(article.id, article.title))
        return newState

      // article body changed
      case ArticleAction.BODY_CHANGED:
        return previousState

      default:
        return previousState
    }
  }
}
