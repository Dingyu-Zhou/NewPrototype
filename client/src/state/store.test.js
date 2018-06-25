import casual from 'casual'

import { StateStore } from './store'
import UserReducer from './reducer/user'

/** @test {StateStore} */
describe('Test the Redux wrapper class: StateStore', () => {
  /** @test {StateStore} */
  test('StateStore.reduxStore should return a Redux store instance', () => {
    const reduxStore = StateStore.reduxStore
    expect(reduxStore.dispatch).toBeTruthy()
    expect(reduxStore.subscribe).toBeTruthy()
    expect(reduxStore.getState).toBeTruthy()
  })

  /** @test {StateStore} */
  test('StateStore.user should return the current user state in the Redux store', () => {
    let reduxStore = StateStore.reduxStore

    // new initialized Redux store should only have the initial user state
    expect(StateStore.user).toBe(UserReducer.initialState)

    // StateStore.user should be only a wrapper for reduxStore.getState().user
    const mockUserState = { username: casual.username }
    reduxStore.getState = jest.fn()
    reduxStore.getState.mockReturnValue({ user: mockUserState })
    let userState = StateStore.user
    expect(reduxStore.getState.mock.calls.length).toBe(1)
    expect(userState).toBe(mockUserState)
    expect(userState).toEqual(mockUserState)

    // test the default value logic
    reduxStore.getState.mockReturnValue({ user: null })
    userState = StateStore.user
    expect(reduxStore.getState.mock.calls.length).toBe(2)
    expect(StateStore.user).toBe(UserReducer.initialState)
  })

  /** @test {StateStore} */
  test('StateStore.dispatch should be only a wrapper for reduxStore.dispatch', () => {
    let reduxStore = StateStore.reduxStore

    const mockAction = { type: casual.word, payload: casual.sentence }
    reduxStore.dispatch = jest.fn()
    StateStore.dispatch(mockAction)
    expect(reduxStore.dispatch.mock.calls.length).toBe(1)
    const passedArgument = reduxStore.dispatch.mock.calls[0][0]
    expect(passedArgument).toBe(mockAction)
    expect(passedArgument).toBe(mockAction)
  })
})