jest.genMockFromModule('redux-persist')

/**
  * mock this function to make the code invokes it testable
  */
export let persistStore = jest.fn((store, config, callback) => {
  if (callback) {
    callback()
  }

  return {
    purge: () => {}
  }
})

/**
  * mock this function to make the code invokes it testable
  */
export let autoRehydrate = jest.fn(() => {
  return (next) => (reducer, initialState, enhancer) => {
    let store = next(reducer, initialState, enhancer)
    return store
  }
})