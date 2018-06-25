import React from 'react'

import SignInForm from './SignInForm'

const SignInUi = ({ onSubmit, user }) => {
  return <SignInForm
    onSubmit={onSubmit}
    user={user}
  />
}

export default SignInUi
