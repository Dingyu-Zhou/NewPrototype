import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import constants from '../constants'

const MODEL_NAME = 'User'
const SALT_ROUNDS = constants.config.USER_PASSWORD_SALT_ROUNDS

let userSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  nickname: {type: String},
  password: {type: String, required: true},
  loginAttempts: { type: Number, required: true, default: 0 },
  lockUntil: { type: Number }
}, {
  timestamps: true,
  validateBeforeSave: true
})

/**
 * This is internal settings for the user login functionality.
 * Export this to provide an internal convenience reference.
 *
 * @access public
 * @type {object}
 * @property {number} MAX_LOGIN_ATTEMPTS the maximum login attempts that a user is allowed in a short period of time
 * @property {number} LOCK_TIME the time (in milliseconds) a user gets locked if the maximum login attempts was reached
 */
export const USER_LOGIN_SETTINGS = {
  MAX_LOGIN_ATTEMPTS: 5,
  LOCK_TIME: 600000
}

/**
 * This a list for user login failure reasons.
 * Export this to provide an internal convenience reference.
 *
 * @access public
 * @type {object}
 * @property {string} NOT_FOUND the login failure reason: cannot find the user in the database
 * @property {string} PASSWORD_INCORRECT the login failure reason: the password of the user is incorrect
 * @property {string} MAX_ATTEMPTS the login failure reason: the user has reached the maximum login attempts in a short period of time
 */
export const USER_LOGIN_FAILURE_REASONS = {
  NOT_FOUND: 'cannot find the user in the database',
  PASSWORD_INCORRECT: 'the password of the user is incorrect',
  MAX_ATTEMPTS: 'the user has reached the maximum login attempts'
}

/**
 * UserClass defines all methods for the userSchema: userSchema.loadClass(UserClass)
 *
 * Export this class to make it recordable by ESDoc.
 *
 * @access private
 */
export class UserClass {
  /**
   * This method wraps the Mongoose method User.findOne({ username: xxx }), and convert the username to lowercase before the query.
   * It is a static method of the userSchema.
   *
   * @param {string} username - the user's username
   *
   * @return {Promise} return the founded user
   */
  static async findByUsername (username) {
    return User.findOne({ username: username.toLowerCase() })
  }

  /**
   * This method checks if a user gets authenticated or not.
   * It is a static method of the userSchema.
   *
   * Each calling of this method updates the login attempts.
   * If login successfully, then reset the login attempts.
   * Otherwise, one more login attempt will be recorded.
   *
   * @param {string} username - the user's username
   * @param {string} password - the user's password
   *
   * @return {Promise}
   * @property {object} resolve(result) the authentication result
   * @property {boolean} resolve(result.isAuthenticated) tells if the user passes the authentication or not
   * @property {object} resolve(result.user) the user details. "null" if the authentication was not passed.
   * @property {string} resolve(result.failureReason) the authentication failure reason. "null" if the authentication was passed.
   */
  static async authenticate (username, password) {
    let reasons = USER_LOGIN_FAILURE_REASONS
    let result = {
      isAuthenticated: false,
      user: null,
      failureReason: null
    }
    let user = await this.findOne({ username: username.toLowerCase() })
    if (user) {
      if (user.isLocked) {
        await user.incrementLoginAttempts()
        result.failureReason = reasons.MAX_ATTEMPTS
      } else {
        let isCorrectPassword = await user.comparePassword(password)
        if (isCorrectPassword) {
          await user.update({
            $set: { loginAttempts: 0 },
            $unset: { lockUntil: 1 }
          })
          result.isAuthenticated = true
          result.user = user
        } else {
          await user.incrementLoginAttempts()
          result.failureReason = reasons.PASSWORD_INCORRECT
        }
      }
    } else {
      result.failureReason = reasons.NOT_FOUND
    }
    return result
  }

  /**
   * This method generates a JWT (JSON Web Token) for the user.
   *
   * @param {object} user - the user that needs to generate a JWT for
   *
   * @return {string} the generated JWT (JSON Web Token)
   */
  static generateJwt (user) {
    return jwt.sign({
      id: user.id
    }, constants.config.JWT_SECRET)
  }

  /**
   * This method checks if a user gets locked or not because of too many login attempts.
   * This is a virtual method of the userSchema.
   *
   * @type {boolean}
   */
  get isLocked () {
    // check for a future lockUntil timestamp
    return !!(this.lockUntil && this.lockUntil > Date.now())
  }

  /**
   * This method checks if a user password is correct or not.
   * This is a document method of the userSchema.
   *
   * @param {string} candidatePassword - the password that will be compared to see if it is a correct one
   *
   * @return {Promise}
   * @property {boolean} resolve(isCorrectPassword) a boolean value to tell if a user password is correct or not.
   */
  async comparePassword (candidatePassword) {
    let isCorrectPassword = await bcrypt.compare(candidatePassword, this.password)
    return isCorrectPassword
  }

  /**
   * This method increment the number of login attempts for a user.
   * This is a document method of the userSchema.
   *
   * @return {Promise}
   */
  async incrementLoginAttempts () {
    // if we have a previous lock that has expired, restart at 1
    let updates = null
    if (this.lockUntil && this.lockUntil < Date.now()) {
      updates = {
        $set: { loginAttempts: 1 },
        $unset: { lockUntil: 1 }
      }
    } else {
      // otherwise we're incrementing
      updates = { $inc: { loginAttempts: 1 } }
      // lock the account if we've reached max attempts and it's not locked already
      if (this.loginAttempts + 1 >= USER_LOGIN_SETTINGS.MAX_LOGIN_ATTEMPTS && !this.isLocked) {
        updates.$set = { lockUntil: Date.now() + USER_LOGIN_SETTINGS.LOCK_TIME }
      }
    }
    await this.update(updates)
  }
}

userSchema.loadClass(UserClass)

/**
 * Encrypt the modified password just before saving a user.
 * This is a Mongoose middleware method.
 *
 * Mongoose "update" does not invoke this middleware method.
 * So please only use Mongoose "save" to update the user's password.
 * @todo to develop a dedicated password update method to make this less obscure.
 */
userSchema.pre('save', function (next) {
  var self = this

  // only store the lowercase of the username in the database
  if (self.isModified('username')) {
    self.username = self.username.toLowerCase()
  }

  // only store the lowercase of the email in the database
  if (self.isModified('email')) {
    self.email = self.email.toLowerCase()
  }

  // only hash the password if it has been modified (or is new)
  if (!self.isModified('password')) return next()

  // hash the password
  bcrypt.hash(self.password, SALT_ROUNDS, function (error, hash) {
    if (error) return next(error)

    // override the cleartext password with the hashed one
    self.password = hash
    next()
  })
})

const User = mongoose.model(MODEL_NAME, userSchema)

/**
 * This is the constructor function for the Mongoose model: User
 *
 * @access public
 * @type {function}
 */
export default User
