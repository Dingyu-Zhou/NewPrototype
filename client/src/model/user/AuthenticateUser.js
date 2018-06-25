import React from 'react'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import AppApollo from '../../app_apollo'
import CookieHelper from '../../helper/cookie_helper'

class AuthenticateUserLogic extends React.Component {
  constructor (props) {
    super(props)
    this.state = this.getInitialState()
  }

  getInitialState () {
    return {
      authenticateStatus: null
    }
  }

  componentWillReceiveProps () {
    if (!this.state.authenticateStatus || this.state.authenticateStatus.error) {
      this.setState(this.getInitialState())
    }
  }

  render () {
    return React.cloneElement(this.props.children, {
      appApi: {
        ...this.props.appApi,
        authenticateUser: {
          onSubmit: this.onSubmit.bind(this),
          status: this.state.authenticateStatus
        }
      }
    })
  }

  async onSubmit (username, password) {
    this.setState({
      authenticateStatus: {
        hasFinished: false,
        error: null,
        authenticatedUser: null
      }
    })

    try {
      /**
        * @todo need a maturer way to handle Apollo cache.
        */
      await AppApollo.client.resetStore()

      const response = await this.props.authenticateUserMutation({
        variables: {
          username: username,
          password: password
        }
      })
      const authenticatedUser = response.data.authenticateUser
      CookieHelper.userSignIn(authenticatedUser)
      this.setState({
        authenticateStatus: {
          hasFinished: true,
          error: null,
          authenticatedUser
        }
      })
    } catch (error) {
      this.setState({
        authenticateStatus: {
          hasFinished: true,
          error: error,
          authenticatedUser: null
        }
      })
    }
  }
}

const authenticateUserMutation = gql`
  mutation ($username: String!, $password: String!) {
    authenticateUser (username: $username, password: $password) {
      id
      jwt
      username
      nickname
    }
  }
`

const AuthenticateUser = graphql(authenticateUserMutation, {
  name: 'authenticateUserMutation'
})(AuthenticateUserLogic)

export default AuthenticateUser
