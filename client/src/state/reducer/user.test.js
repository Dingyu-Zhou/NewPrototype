import casual from 'casual'
import { Map } from 'immutable'

import UserReducer from './user'
import UserAction from '../action/user'

/** @test {UserReducer} */
describe('Test the class: UserReducer', () => {
  /** @test {UserReducer} */
  test('The user reducer should have a proper initial state', () => {
    let initialUserState = UserReducer.initialState
    expect(initialUserState).toBeInstanceOf(Map)
    expect(initialUserState.get('id')).toBe(null)
    expect(initialUserState.get('hasSignedIn')).toBe(false)
    expect(initialUserState.get('jwt')).toBe(null)
  })

  /** @test {UserReducer} */
  test('UserReducer.reducerFunction should return the default initial user state correctly', () => {
    let undefinedPreviousUserState = undefined
    let unmatchedAction = {}
    let defaultUserState = UserReducer.reducerFunction(undefinedPreviousUserState, unmatchedAction)
    expect(defaultUserState).toBe(UserReducer.initialState)
  })

  /** @test {UserReducer} */
  test('UserReducer.reducerFunction should return the previous state if there is no matching action', () => {
    let previousUserState = Map({
      id: casual.uuid,
      username: casual.username,
      nickname: casual.name,
      hasSignedIn: true,
      jwt: casual.string
    })
    let unmatchedAction = {}
    let userState = UserReducer.reducerFunction(previousUserState, unmatchedAction)
    expect(userState).toBe(previousUserState)
  })

  /** @test {UserReducer} */
  test('UserReducer.reducerFunction should generate a updated user state after processing a sign in action', () => {
    let user = {
      id: casual.uuid,
      username: casual.username,
      nickname: casual.name,
      jwt: casual.string
    }
    let mockPreviousUserState = {}
    let signInAction = UserAction.signIn(user)
    let userState = UserReducer.reducerFunction(mockPreviousUserState, signInAction)
    expect(userState).toBeInstanceOf(Map)
    expect(userState.get('id')).toBe(user.id)
    expect(userState.get('username')).toBe(user.username)
    expect(userState.get('nickname')).toBe(user.nickname)
    expect(userState.get('hasSignedIn')).toBe(true)
    expect(userState.get('jwt')).toBe(user.jwt)
  })
})