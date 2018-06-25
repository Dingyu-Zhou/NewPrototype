import '../../view/layout/css'

import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { ApolloProvider } from 'react-apollo'
import { persistStore } from 'redux-persist'

import AppApollo from '../../app_apollo'
import StateStore from '../../state/store'

import CookieHelper from '../../helper/cookie_helper'

import Home from './Home'
import Header from './Header'
import Loader from './Loader'
import SignUp from '../user/SignUp'
import SignIn from '../user/SignIn'
import ShowUser from '../user/ShowUser'
import NewArticle from '../article/NewArticle'
import EditArticle from '../article/EditArticle'
import ShowArticle from '../article/ShowArticle'

import AppUi from '../../view/layout/AppUi'

/**
  * The root component of this web application.
  */
class App extends Component {
  /**
    * The constructor of this component.
    */
  constructor () {
    super()

    /**
      * The component state.
      * @type {object}
      * @property {boolean} reduxPersistRehydrated The indicator to show if the Redux state from the local storage has been loaded or not.
      */
    this.state = { reduxPersistRehydrated: false }
  }

  /**
    * The React component lifecycle function: componentDidMount.
    * It invokes persistStore from 'redux-persist' to read the Redux state from the local storage.
    */
  componentDidMount () {
    // ensure that the Redux Persist rehydration has completed before routing.
    persistStore(StateStore.reduxStore, null, () => {
      AppApollo.client.resetStore()
      CookieHelper.loadStateFromCookie()
      this.setState({ reduxPersistRehydrated: true })
    })
  }

  /**
    * The render function for this component.
    * It renders as loading busy before the local Redux state is loaded.
    * Then, after the Redux state is ready, it works as a URL router.
    *
    * @return {ReactElement} The root React element.
    */
  render () {
    if (!this.state.reduxPersistRehydrated) {
      return (
        <AppUi>
          <Loader controller='layout' type='initialize' />
        </AppUi>
      )
    }

    return (
      <ApolloProvider client={AppApollo.client}>
        <Provider store={StateStore.reduxStore}>
          <BrowserRouter>
            <AppUi>
              <Header />

              <Switch>
                <Route exact path='/' component={Home} />
                <Route exact path='/:username' component={ShowUser} />
                <Route exact path='/articles/new' component={NewArticle} />
                <Route exact path='/article/:id' component={ShowArticle} />
                <Route exact path='/article/:id/edit' component={EditArticle} />
                <Route exact path='/users/signUp' component={SignUp} />
                <Route exact path='/users/signIn' component={SignIn} />
              </Switch>
            </AppUi>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    )
  }
}

export default App
