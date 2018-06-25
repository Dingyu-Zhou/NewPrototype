/**
  * This is the configuration file for the server.
  * Naming this file as "configuration.js" instead of "config.js" to avoid the ignorance from Standard JS.
  * @type {object}
  * @property {string} DATABASE_URI Set the database uri
  * @property {string} TEST_DATABASE_URI Set the database uri for all tests
  * @property {string|number} GRAPHQL_SERVER_PORT Set the port of the GraphQL server
  * @property {object} CORS_OPTIONS Set the options for the CORS module
  * @property {string} JWT_SECRET Set the JWT (JSON Web Token) secret
  * @property {object} LOG_OPTIONS set the log options for the logger
  */
const config = {
  /**
    * set the database uri
    * @type {string}
    * @example
    * DATABASE_URI: 'mongodb://localhost:27017/WisdoMile'
    */
  DATABASE_URI: null,

  /**
    * set the database uri for all tests
    * @type {string}
    * @example
    * DATABASE_URI: 'mongodb://localhost:27017/WisdoMile_TestDB'
    */
  TEST_DATABASE_URI: null,

  /**
    * set the port of the GraphQL server
    * @type {number}
    * @example
    * GRAPHQL_SERVER_PORT: 4000
    */
  GRAPHQL_SERVER_PORT: null,

  /**
    * set the options for the CORS module
    * please see details for this setting from: https://github.com/expressjs/cors
    * @type {object}
    * @example
    * CORS_OPTIONS: { origin: 'http://localhost:3000' }
    */
  CORS_OPTIONS: null,

  /**
    * set the user password salt rounds. it must be an integer.
    * @type {number}
    * @example
    * USER_PASSWORD_SALT_ROUNDS: 10
    */
  USER_PASSWORD_SALT_ROUNDS: null,

  /**
    * set the JWT (JSON Web Token) secret
    * @type {string}
    * @example
    * JWT_SECRET: 'a private jwt secret'
    */
  JWT_SECRET: null,

  /**
    * set the log options for the logger
    * @type {object}
    * @example
    * LOG_OPTIONS: { logLevel: 'DEBUG' }
    */
  LOG_OPTIONS: null,
}

export default config
