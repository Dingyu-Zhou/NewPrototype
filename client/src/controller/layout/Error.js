import React from 'react'

import ErrorUi from '../../view/layout/ErrorUi'

const Error = ({ controller, action, error }) => {
  return <ErrorUi controller={controller} action={action} error={error} />
}

export default Error
