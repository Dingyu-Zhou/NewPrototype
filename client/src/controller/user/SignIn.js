import React from 'react'
import { connect } from 'react-redux'

import AuthenticateUser from '../../model/user/AuthenticateUser'
import Error from '../layout/Error'
import Loader from '../layout/Loader'
import SignInUi from '../../view/user/SignInUi'

const SignInLogic = ({ user }) => {
  const MainLogic = ({ appApi: { authenticateUser } }) => {
    let content = null

    const authenticateStatus = authenticateUser.status
    if (authenticateStatus) {
      if (authenticateStatus.hasFinished) {
        if (authenticateStatus.error) {
          content = <Error controller='user' action='signIn' error={authenticateStatus.error} />
        } else {
          /* @todo redirect to some page */
          content = <SignInUi
            onSubmit={authenticateUser.onSubmit}
            user={user.toJS()}
          />
        }
      } else {
        content = <Loader controller='user' action='signIn' />
      }
    } else {
      content = <SignInUi
        onSubmit={authenticateUser.onSubmit}
        user={user.toJS()}
      />
    }
    return content
  }

  return (
    <AuthenticateUser>
      <MainLogic />
    </AuthenticateUser>
  )
}

const mapStateToProps = ({ user }) => ({ user })

const SignIn = connect(mapStateToProps)(SignInLogic)

export default SignIn
