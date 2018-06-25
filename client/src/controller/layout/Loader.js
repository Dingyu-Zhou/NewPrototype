import React from 'react'

import LoaderUi from '../../view/layout/LoaderUi'

const Loader = ({ controller, action }) => {
  return <LoaderUi controller={controller} action={action} />
}

export default Loader
