import casual from 'casual'

import ActionPrefix from './action_prefix'
import UserAction from './user'

/** @test {UserAction} */
describe('Test the class: UserAction', () => {
  /** @test {UserAction} */
  test('All user action types should use the defined user prefix in ActionPrefix, and should not repetitive.', () => {
    let userPrefixReg = new RegExp(`^${ActionPrefix.user}\\S+`)
    let dict = {}

    expect(UserAction.SIGN_IN).toMatch(userPrefixReg)
    expect(dict[UserAction.SIGN_IN]).toBeFalsy()
    dict[UserAction.SIGN_IN] = true
  })

  /** @test {UserAction} */
  test('UserAction.signIn should generate a sign in action for the dispatcher', () => {
    let user = {
      id: casual.uuid,
      username: casual.username,
      nickname: casual.name,
      jwt: casual.string
    }
    let signInAction = UserAction.signIn(user)
    expect(signInAction.type).toBe(UserAction.SIGN_IN)
    expect(signInAction.payload).toEqual(user)
  })
})