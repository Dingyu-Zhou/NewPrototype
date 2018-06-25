import React from 'react'
import { Loader } from 'semantic-ui-react'

const SimpleLoader = () => {
  return <Loader active>Loading</Loader>
}

const LoaderUi = ({ controller, action, error }) => {
  switch (controller) {
    case 'layout':
      switch (action) {
        case 'initialize':
          return <SimpleLoader />
        default:
          return <SimpleLoader />
      }

    case 'article':
      switch (action) {
        case 'fetch':
          return <SimpleLoader />
        case 'fetchList':
          return <SimpleLoader />
        case 'save':
          return <SimpleLoader />
        case 'delete':
          return <SimpleLoader />
        default:
          return <SimpleLoader />
      }

    case 'user':
      switch (action) {
        case 'signIn':
          return <SimpleLoader />
        case 'signUp':
          return <SimpleLoader />
        default:
          return <SimpleLoader />
      }

    default:
      return <SimpleLoader />
  }
}

export default LoaderUi
