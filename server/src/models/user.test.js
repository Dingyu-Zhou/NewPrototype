import casual from 'casual'
import bcrypt from 'bcrypt'
import factory from 'factory-girl'
import jwt from 'jsonwebtoken'

import User, { USER_LOGIN_SETTINGS, USER_LOGIN_FAILURE_REASONS } from './user'
import constants from '../constants'

/** @test {User} */
describe('test the model: User', () => {
  /** @test {User} */
  test('the saved user should have correct fields', async () => {
    const testUser = await factory.attrs(User.modelName)

    const oldUserCount = await User.count()
    const savedUser = await User.create(testUser)
    const currentUserCount = await User.count()
    expect(currentUserCount - oldUserCount).toBe(1)

    expect(savedUser.id).toBeTruthy()
    expect(savedUser.createdAt).toBeTruthy()
    expect(savedUser.updatedAt).toBeTruthy()
    expect(savedUser.email).toBe(testUser.email.toLowerCase())
    expect(savedUser.username).toBe(testUser.username.toLowerCase())
    expect(savedUser.nickname).toBe(testUser.nickname)
    expect(savedUser.password).toBeTruthy()
  })

  /** @test {User} */
  test('the username for a user is required', async () => {
    let testUser = await factory.attrs(User.modelName)
    testUser.username = null

    try {
      let savedUser = await User.create(testUser)
      expect(savedUser).toBe('the user should not be saved if the username is missing')
    } catch (error) {
      expect(error.toString()).toMatch(/username.* is required/)
    }
  })

  /** @test {User} */
  test('the email for a user is required', async () => {
    let testUser = await factory.attrs(User.modelName)
    testUser.email = null

    try {
      let savedUser = await User.create(testUser)
      expect(savedUser).toBe('the user should not be saved if the email is missing')
    } catch (error) {
      expect(error.toString()).toMatch(/email.* is required/)
    }
  })

  /** @test {User} */
  test('the username for a user should be unique', async () => {
    let sameUsername = casual.username
    let testUser1 = await factory.attrs(User.modelName, { username: sameUsername })
    let testUser2 = await factory.attrs(User.modelName, { username: sameUsername })

    await User.create(testUser1)
    try {
      let savedUser2 = await User.create(testUser2)
      expect(savedUser2).toBe('the user should not be saved if the username is not unique')
    } catch (error) {
      expect(error.toString()).toMatch(/duplicate key.* index: username/)
    }
  })

  /** @test {User} */
  test('the email for a user should be unique', async () => {
    let sameEmail = casual.email
    let testUser1 = await factory.attrs(User.modelName, { email: sameEmail })
    let testUser2 = await factory.attrs(User.modelName, { email: sameEmail })

    await User.create(testUser1)
    try {
      let savedUser2 = await User.create(testUser2)
      expect(savedUser2).toBe('the user should not be saved if the email is not unique')
    } catch (error) {
      expect(error.toString()).toMatch(/duplicate key.* index: email/)
    }
  })

  /**
   * @test {User} - test the middleware method pre('save') for User
   * @test {UserClass.comparePassword}
   */
  test('the saved user should have the password encrypted', async () => {
    let testUser = await factory.attrs(User.modelName)

    let savedUser = await User.create(testUser)
    expect(savedUser.password).toBeTruthy()
    expect(savedUser.password).not.toBe(testUser.password)
    let isCorrectPassword = await savedUser.comparePassword(testUser.password)
    expect(isCorrectPassword).toBe(true)
    isCorrectPassword = await savedUser.comparePassword(`wrong ${testUser.password}`)
    expect(isCorrectPassword).toBe(false)
  })

  /**
   * @test {User} - test the middleware method pre('save') for User
   */
  test('changing password should work as designed', async () => {
    let testUser = await factory.attrs(User.modelName)

    let user = await User.create(testUser)
    let encryptedPassword = user.password
    expect(encryptedPassword).toBeTruthy()
    expect(encryptedPassword).not.toBe(testUser.password)
    let isCorrectPassword = await user.comparePassword(testUser.password)
    expect(isCorrectPassword).toBe(true)

    // not encrypt the password if it is not modified
    user.nickname = casual.name
    await user.save()
    user = await User.findByUsername(testUser.username)
    expect(user.password).toBe(encryptedPassword)
    isCorrectPassword = await user.comparePassword(testUser.password)
    expect(isCorrectPassword).toBe(true)

    // encrypt the password if it is modified
    let newPassword = `new ${testUser.password}`
    user.nickname = casual.name
    user.password = newPassword
    await user.save()
    user = await User.findByUsername(testUser.username)
    expect(user.password).not.toBe(encryptedPassword)
    isCorrectPassword = await user.comparePassword(testUser.password)
    expect(isCorrectPassword).toBe(false)
    isCorrectPassword = await user.comparePassword(newPassword)
    expect(isCorrectPassword).toBe(true)
  })

  /**
   * @test {User} - test the middleware method pre('save') for User
   */
  test('the middleware method "pre(save)" should change username and email to lowercase', async () => {
    let testUser = await factory.attrs(User.modelName)
    testUser.username = testUser.username.toUpperCase()
    testUser.email = testUser.email.toUpperCase()

    let savedUser = await User.create(testUser)
    expect(savedUser.username).toBe(testUser.username.toLowerCase())
    expect(savedUser.email).toBe(testUser.email.toLowerCase())
  })

  /**
   * @test {User} - test the middleware method pre('save') for User
   */
  test('the middleware method "pre(save)" should handle BCrypt error well', async () => {
    let testUser = await factory.attrs(User.modelName)
    let mockErrorMessage = casual.sentence
    let bcryptHashBackup = bcrypt.hash
    bcrypt.hash = jest.fn((password, saltRounds, callback) => {
      callback(Error(mockErrorMessage))
    })

    try {
      await User.create(testUser)
    } catch (error) {
      expect(error.toString()).toMatch(mockErrorMessage)
    }

    bcrypt.hash = bcryptHashBackup
  })

  /** @test {User} */
  /** @test {UserClass#isLocked} */
  test('the virtual method "isLocked" should work correctly', async () => {
    // test the default value
    // a new user should not get locked
    let user = await factory.create(User.modelName)
    expect(user.isLocked).toBe(false)

    // should report as locked if "lockUntil" is in the future
    user.lockUntil = Date.now() + 1000000
    expect(user.isLocked).toBe(true)

    // should report as not locked if "lockUntil" is in the past
    user.lockUntil = Date.now() - 1000000
    expect(user.isLocked).toBe(false)

    // should report as not locked if "lockUntil" is "null"
    user.lockUntil = null
    expect(user.isLocked).toBe(false)
  })

  /** @test {User} */
  /** @test {UserClass#incrementLoginAttempts} */
  test('the virtual method "incrementLoginAttempts" should work correctly', async () => {
    let testUser = await factory.attrs(User.modelName)
    let wrongPassword = `wrong ${testUser.password}`
    let failureReasons = USER_LOGIN_FAILURE_REASONS

    // test the default value
    // a new user should have 0 login attempts
    let user = await User.create(testUser)
    expect(user.loginAttempts).toBe(0)

    // successfully login should not increment the login attempts
    await User.authenticate(testUser.username, testUser.password)
    user = await User.findByUsername(testUser.username)
    expect(user.loginAttempts).toBe(0)

    // failed login should increment the login attempts
    await User.authenticate(testUser.username, wrongPassword)
    user = await User.findByUsername(testUser.username)
    expect(user.loginAttempts).toBe(1)

    // lock the user
    for (let index = 1; index < USER_LOGIN_SETTINGS.MAX_LOGIN_ATTEMPTS; ++index) {
      await User.authenticate(testUser.username, wrongPassword)
    }
    let result = await User.authenticate(testUser.username, wrongPassword)
    expect(result.isAuthenticated).toBe(false)
    expect(result.user).toBe(null)
    expect(result.failureReason).toBe(failureReasons.MAX_ATTEMPTS)

    // mock "lockUntil" to make it be no longer locked
    //   to test a new incorrect password login. it should recount the "loginAttempts"
    user.lockUntil = Date.now() - 1
    await user.save()
    result = await User.authenticate(testUser.username, wrongPassword)
    expect(result.isAuthenticated).toBe(false)
    expect(result.user).toBe(null)
    expect(result.failureReason).toBe(failureReasons.PASSWORD_INCORRECT)
    user = await User.findByUsername(testUser.username)

    user = await User.findByUsername(testUser.username)
    expect(user.loginAttempts).toBe(1)
    expect(user.lockUntil).toBeFalsy()
  })

  /** @test {UserClass.findByUsername} */
  test('the static method "findByUsername" should work', async () => {
    let testUser = await factory.attrs(User.modelName)
    testUser.username = testUser.username.toUpperCase()
    await User.create(testUser)

    let savedUser = await User.findByUsername(testUser.username)
    expect(savedUser.username).not.toBe(testUser.username)
    expect(savedUser.username).toBe(testUser.username.toLowerCase())
  })

  /** @test {UserClass.authenticate} */
  test('the static method "authenticate" should work', async () => {
    let testUser = await factory.attrs(User.modelName)
    await User.create(testUser)
    let result = await User.authenticate(testUser.username, testUser.password)
    expect(result.isAuthenticated).toBe(true)
    expect(result.user.username).toBe(testUser.username.toLowerCase())
    expect(result.failureReason).toBe(null)

    let wrongUsername = `wrong ${testUser.username}`
    let wrongPassword = `wrong ${testUser.password}`
    let failureReasons = USER_LOGIN_FAILURE_REASONS

    result = await User.authenticate(wrongUsername, testUser.password)
    expect(result.isAuthenticated).toBe(false)
    expect(result.user).toBe(null)
    expect(result.failureReason).toBe(failureReasons.NOT_FOUND)

    await User.authenticate(testUser.username, testUser.password)   // reset loginAttempts
    result = await User.authenticate(testUser.username, wrongPassword)
    expect(result.isAuthenticated).toBe(false)
    expect(result.user).toBe(null)
    expect(result.failureReason).toBe(failureReasons.PASSWORD_INCORRECT)
  })

  /** @test {UserClass.authenticate} */
  test('the user should get locked if the maximum login attempts got reached', async () => {
    let testUser = await factory.attrs(User.modelName)
    await User.create(testUser)
    let wrongPassword = `wrong ${testUser.password}`
    let failureReasons = USER_LOGIN_FAILURE_REASONS

    let result = null
    let timeBeforeLock = Date.now()
    for (let index = 0; index < USER_LOGIN_SETTINGS.MAX_LOGIN_ATTEMPTS; ++index) {
      result = await User.authenticate(testUser.username, wrongPassword)
      expect(result.isAuthenticated).toBe(false)
      expect(result.user).toBe(null)
      expect(result.failureReason).toBe(failureReasons.PASSWORD_INCORRECT)
    }
    result = await User.authenticate(testUser.username, testUser.password)   // even use correct username and password
    let timeAfterLock = Date.now()

    expect(result.isAuthenticated).toBe(false)
    expect(result.user).toBe(null)
    expect(result.failureReason).toBe(failureReasons.MAX_ATTEMPTS)

    let user = await User.findByUsername(testUser.username)
    expect(user.loginAttempts).toBe(USER_LOGIN_SETTINGS.MAX_LOGIN_ATTEMPTS + 1)
    let lockUtilTime = user.lockUntil
    expect(lockUtilTime).toBeGreaterThanOrEqual(timeBeforeLock + USER_LOGIN_SETTINGS.LOCK_TIME)
    expect(lockUtilTime).toBeLessThanOrEqual(timeAfterLock + USER_LOGIN_SETTINGS.LOCK_TIME)

    // the login failure after the lock
    //   will only increment the "loginAttempts" field in the User model,
    //   but won't change the "lockUntil" field
    result = await User.authenticate(testUser.username, testUser.password)
    expect(result.isAuthenticated).toBe(false)
    expect(result.user).toBe(null)
    expect(result.failureReason).toBe(failureReasons.MAX_ATTEMPTS)
    user = await User.findByUsername(testUser.username)
    expect(user.loginAttempts).toBe(USER_LOGIN_SETTINGS.MAX_LOGIN_ATTEMPTS + 2)
    expect(user.lockUntil).toBe(lockUtilTime)
  })

  /** @test {UserClass.authenticate} */
  test('the locked user should get unlocked automatically if the lock time passed', async () => {
    let testUser = await factory.attrs(User.modelName)
    let user = await User.create(testUser)
    let wrongPassword = `wrong ${testUser.password}`

    // lock the user
    for (let index = 0; index < USER_LOGIN_SETTINGS.MAX_LOGIN_ATTEMPTS; ++index) {
      await User.authenticate(testUser.username, wrongPassword)
    }
    let result = await User.authenticate(testUser.username, wrongPassword)
    expect(result.isAuthenticated).toBe(false)
    expect(result.user).toBe(null)
    expect(result.failureReason).toBe(USER_LOGIN_FAILURE_REASONS.MAX_ATTEMPTS)

    // mock "lockUntil" to make it be no longer locked
    //   to test a new successful login. it should reset the "loginAttempts"
    user.lockUntil = Date.now() - 1
    await user.save()
    result = await User.authenticate(testUser.username, testUser.password)
    expect(result.isAuthenticated).toBe(true)
    expect(result.user.username).toBe(testUser.username.toLowerCase())
    expect(result.failureReason).toBe(null)

    user = await User.findByUsername(testUser.username)
    expect(user.loginAttempts).toBe(0)
    expect(user.lockUntil).toBeFalsy()
  })

  /** @test {UserClass.generateJwt} */
  test('the static method "generateJwt" should generate a correct JWT', async () => {
    let testUser = await factory.attrs(User.modelName)
    await User.create(testUser)

    let savedUser = await User.findByUsername(testUser.username)
    expect(User.generateJwt(savedUser)).toBe(jwt.sign({
      id: savedUser.id
    }, constants.config.JWT_SECRET))
  })
})
