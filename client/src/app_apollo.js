import ApolloClient from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

import StateStore from './state/store'

const httpLink = createHttpLink({ uri: 'http://localhost:4000/graphql' })   // hard coded now. should be moved to the configuration file later
const middlewareLink = new ApolloLink((operation, forward) => {
  const jwt = StateStore.user.jwt
  if (jwt) {
    operation.setContext({
      headers: {
        authorization: `Bearer ${jwt}`
      }
    })
  }
  return forward(operation)
})

const appApolloClient = new ApolloClient({
  link: middlewareLink.concat(httpLink),
  cache: new InMemoryCache().restore(window.__APOLLO_STATE__)
})

/**
  * This is a wrapper for defined Apollo variables in this application.
  */
export default class AppApollo {
  /**
    * A static getter to get the defined Apollo client in this application.
    * @type {object}
    */
  static get client () {
    return appApolloClient
  }
}
