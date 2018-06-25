import casual from 'casual'
import factory from 'factory-girl'

import { resolvers } from './resolvers'
import User from '../models/user'

/** @test {resolvers} */
describe('test the logics in resolvers that can not be covered in the schema test', () => {
  test('{ Mutation: createUser } should set the new user into the "context"', async () => {
    const createUserArgs = {
      username: casual.username,
      email: casual.email,
      nickname: casual.name,
      password: casual.password
    }

    let context = {}
    let newUser = await resolvers.Mutation.createUser({}, createUserArgs, context)
    let contextUser = await context.user   // "context.user" is a promise
    expect(contextUser).toEqual(newUser)
  })

  /** @test {resolvers} */
  test('{ Mutation: authenticateUser } should set the authenticated user into the "context"', async () => {
    let password = casual.password
    let mockUser = await factory.create(User.modelName, { password: password })

    const authenticateUserArgs = {
      username: mockUser.username,
      password: password
    }

    let context = {}
    let signedInUser = await resolvers.Mutation.authenticateUser({}, authenticateUserArgs, context)
    let contextUser = await context.user   // "context.user" is a promise
    expect(contextUser).toEqual(signedInUser)
  })
})
