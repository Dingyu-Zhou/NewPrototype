import React from 'react'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import AppApollo from '../../app_apollo'
import CookieHelper from '../../helper/cookie_helper'

class CreateUserLogic extends React.Component {
  constructor (props) {
    super(props)
    this.state = this.getInitialState()
  }

  getInitialState () {
    return {
      createStatus: null
    }
  }

  componentWillReceiveProps () {
    if (!this.state.createStatus || this.state.createStatus.error) {
      this.setState(this.getInitialState())
    }
  }

  render () {
    return React.cloneElement(this.props.children, {
      appApi: {
        ...this.props.appApi,
        createUser: {
          onSubmit: this.onSubmit.bind(this),
          status: this.state.createStatus
        }
      }
    })
  }

  async onSubmit (newUser) {
    this.setState({
      createStatus: {
        hasFinished: false,
        error: null,
        createdUser: null
      }
    })

    try {
      /**
        * @todo need a maturer way to handle Apollo cache.
        */
      await AppApollo.client.resetStore()

      const response = await this.props.createUserMutation({
        variables: {
          username: newUser.username,
          email: newUser.email,
          nickname: newUser.nickname,
          password: newUser.password
        }
      })
      const createdUser = response.data.createUser
      CookieHelper.userSignIn(createdUser)
      this.setState({
        createStatus: {
          hasFinished: true,
          error: null,
          createdUser
        }
      })
    } catch (error) {
      this.setState({
        createStatus: {
          hasFinished: true,
          error: error,
          createdUser: null
        }
      })
    }
  }
}

const createUserMutation = gql`
  mutation ($username: String!, $email: String!, $nickname: String!, $password: String!) {
    createUser (username: $username, email: $email, nickname: $nickname, password: $password) {
      id
      jwt
      username
      nickname
    }
  }
`

const CreateUser = graphql(createUserMutation, {
  name: 'createUserMutation'
})(CreateUserLogic)

export default CreateUser
