import React from 'react'
import { connect } from 'react-redux'

import CreateUser from '../../model/user/CreateUser'
import Error from '../layout/Error'
import Loader from '../layout/Loader'
import SignUpUi from '../../view/user/SignUpUi'

const SignUpLogic = ({ user }) => {
  const MainLogic = ({ appApi: { createUser } }) => {
    let content = null

    const createStatus = createUser.status
    if (createStatus) {
      if (createStatus.hasFinished) {
        if (createStatus.error) {
          content = <Error controller='user' action='signUp' error={createStatus.error} />
        } else {
          /* @todo redirect to some page */
          content = <SignUpUi
            onSubmit={createUser.onSubmit}
            user={user.toJS()}
          />
        }
      } else {
        content = <Loader controller='user' action='signUp' />
      }
    } else {
      content = <SignUpUi
        onSubmit={createUser.onSubmit}
        user={user.toJS()}
      />
    }
    return content
  }

  return (
    <CreateUser>
      <MainLogic />
    </CreateUser>
  )
}

const mapStateToProps = ({ user }) => ({ user })

const SignUp = connect(mapStateToProps)(SignUpLogic)

export default SignUp
