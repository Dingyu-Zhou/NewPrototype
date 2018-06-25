import React from 'react'
import { Link } from 'react-router-dom'
import { Message } from 'semantic-ui-react'

const SignInCheck = ({ user, expectedUserId, children }) => {
  let signInNeeded = false
  let hasPermission = true

  if (!user || user.hasSignedIn !== true) {
    signInNeeded = true
    hasPermission = false
  }

  if (!signInNeeded) {
    if (expectedUserId && expectedUserId !== user.id) {
      hasPermission = false
    }
  }

  if (signInNeeded) {
    return (
      <Message warning>
        <Message.Header>Oops! Please sign in first.</Message.Header>
        <div>
          <br />
          <p><Link to='/users/signIn'>Sign In</Link> &#160; &#160; OR &#160; &#160; <Link to='/users/signUp'>Sign Up</Link></p>
        </div>
      </Message>
    )
  } else {
    if (hasPermission) {
      return children
    } else {
      return (
        <Message warning>
          <Message.Header>Oops!</Message.Header>
          <div>
            <br />
            <p>You may not have the permission to do this.</p>
            <p>Click <Link to='/'>here</Link> to go back to the home page.</p>
          </div>
        </Message>
      )
    }
  }
}

export default SignInCheck