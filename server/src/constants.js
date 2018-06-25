import config from '../configuration'

/**
  * Any constants of the server should be put here.
  * @access private
  */
class GlobalConstantsWrapper {
  /**
    * Read all settings from the configuration file
    *
    * @todo need some validation for configuration values
    */
  constructor () {
    /**
      * It stores the configuration for the server.
      * @type {object}
      * @property {string} DATABASE_URI the database uri, the default value is "mongodb://localhost:27017/WisdoMile"
      * @property {string} TEST_DATABASE_URI the database uri for all tests, the default value is "mongodb://localhost:27017/WisdoMile_TestDB"
      * @property {number} GRAPHQL_SERVER_PORT the port of the GraphQL server, the default value is 4000
      * @property {object} CORS_OPTIONS the options for the CORS module, the default value is an empty object. Please see details for this setting from the website: https://github.com/expressjs/cors
      * @property {number} USER_PASSWORD_SALT_ROUNDS the user password salt rounds
      * @property {string} JWT_SECRET the JWT (JSON Web Token) secret
      * @property {object} LOG_OPTIONS the options for the logger
      */
    this._config = {
      DATABASE_URI: config.DATABASE_URI || 'mongodb://localhost:27017/WisdoMile',
      TEST_DATABASE_URI: config.TEST_DATABASE_URI || 'mongodb://localhost:27017/WisdoMile_TestDB',
      GRAPHQL_SERVER_PORT: config.GRAPHQL_SERVER_PORT || 4000,
      CORS_OPTIONS: config.CORS_OPTIONS || {},
      USER_PASSWORD_SALT_ROUNDS: config.USER_PASSWORD_SALT_ROUNDS || 10,
      JWT_SECRET: config.JWT_SECRET || 'a default JWT secret',
      LOG_OPTIONS: config.LOG_OPTIONS || {}
    }
  }

  /**
    * It will return the configuration for the server.
    * Please see configuration details from {@link GlobalConstantsWrapper#_config}.
    * @todo It might be a good idea to use some config loading library in the future.
    *
    * @type {object}
    */
  get config () {
    return this._config
  }
}

const constants = new GlobalConstantsWrapper()

/**
  * Any global constants of the server could be accessable from this.
  * It is an instance of the class {@link GlobalConstantsWrapper}.
  */
export default constants
