import React from 'react'
import { Message } from 'semantic-ui-react'

const ErrorMessage = ({ message }) => {
  return (
    <Message negative>
      <Message.Header>Oops!</Message.Header>
      <div>
        <br />
        <p>{message}</p>
      </div>
    </Message>
  )
}

const ErrorUi = ({ controller, action, error }) => {
  switch (controller) {
    case 'article':
      switch (action) {
        case 'fetch':
          return <ErrorMessage message='Sorry, something went wrong while loading the article.' />
        case 'fetchList':
          return <ErrorMessage message='Sorry, something went wrong while loading articles.' />
        case 'save':
          return <ErrorMessage message='Sorry, something went wrong while saving the article.' />
        case 'delete':
          return <ErrorMessage message='Sorry, something went wrong while deleting the article.' />
        default:
          return <ErrorMessage message={`Sorry, something went wrong. ${error ? error.message : ''}`} />
      }

    case 'user':
      switch (action) {
        case 'signIn':
          return <ErrorMessage message='Sorry, your username or password may not be correct.' />
        case 'signUp':
          return <ErrorMessage message='Sorry, something went wrong while creating a new account.' />
        default:
          return <ErrorMessage message={`Sorry, something went wrong. ${error ? error.message : ''}`} />
      }

    default:
      return <ErrorMessage message={`Sorry, something went wrong. ${error ? error.message : ''}`} />
  }
}

export default ErrorUi
