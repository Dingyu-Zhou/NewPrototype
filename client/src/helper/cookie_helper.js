import StateStore from '../state/store'
import CookieAction from '../state/action/cookie'
import UserAction from '../state/action/user'
import AppApollo from '../app_apollo'

const store = StateStore.reduxStore

export default class CookieHelper {
  static userSignIn (user) {
    store.dispatch(UserAction.signIn(user))
    store.dispatch(CookieAction.setUser(user))
  }

  static userSignOut () {
    store.dispatch(UserAction.signOut())
    store.dispatch(CookieAction.clearUser())
    AppApollo.client.resetStore()
  }

  static loadStateFromCookie () {
    const state = store.getState()
    if (state.cookie.user) {
      store.dispatch(UserAction.signIn(state.cookie.user))
    }
  }
}
