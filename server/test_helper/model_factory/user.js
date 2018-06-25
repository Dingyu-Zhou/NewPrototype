import casual from 'casual'

import factory from 'factory-girl'
import User from '../../src/models/user'

global._USER_MODEL_FACTORY_NAMESPACE_ = {
  userUsernameSet: {},
  userEmailSet: {},

  /**
    * A generator for user attributes to ensure the username and the email are always unique
    */
  generateUserAttributes: function () {
    let username = casual.username
    while (this.userUsernameSet[username.toLowerCase()] === true) {
      username = casual.username
    }
    this.userUsernameSet[username.toLowerCase()] = true

    let email = casual.email
    while (this.userEmailSet[email.toLowerCase()] === true) {
      email = casual.email
    }
    this.userEmailSet[email.toLowerCase()] = true

    return {
      username: username,
      email: email,
      nickname: casual.name,
      password: casual.password
    }
  }
}

factory.define(User.modelName, User, () => {
  return global._USER_MODEL_FACTORY_NAMESPACE_.generateUserAttributes()
})
