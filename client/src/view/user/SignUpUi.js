import React from 'react'

import RegisterForm from './RegisterForm'

const SignUpUi = ({ onSubmit, user }) => {
  return <RegisterForm
    onSubmit={onSubmit}
    user={user}
  />
}

export default SignUpUi
