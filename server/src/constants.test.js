/**
  * @test {constants}
  * @test {GlobalConstantsWrapper}
  */
describe('test if the configuration file is read correctly', () => {
  const configKeys = {
    DATABASE_URI: true,
    TEST_DATABASE_URI: true,
    GRAPHQL_SERVER_PORT: true,
    CORS_OPTIONS: true,
    USER_PASSWORD_SALT_ROUNDS: true,
    JWT_SECRET: true,
    LOG_OPTIONS: true
  }
  const configKeyArray = Object.keys(configKeys)

  const cleanUpModuleCaches = function () {
    // clean up caches for all related modules
    delete require.cache[require.resolve('../configuration')]
    delete require.cache[require.resolve('./constants')]
    delete require.cache[require.resolve('../configuration_template.js')]
  }

  const cleanUpMocks = function () {
    // clean up mocks
    jest.resetModules()
    jest.unmock('../configuration')
  }

  beforeEach(() => {
    cleanUpModuleCaches()
  })

  afterEach(() => {
    cleanUpMocks()
  })

  afterAll(() => {
    cleanUpModuleCaches()
  })

  /** @test {GlobalConstantsWrapper#constructor} */
  test('it should use the default value if there is no setting in the configuration file', () => {
    // mock the '../configuration' module
    jest.mock('../configuration', () => {
      return {
        DATABASE_URI: null,
        TEST_DATABASE_URI: null,
        GRAPHQL_SERVER_PORT: null,
        CORS_OPTIONS: null,
        USER_PASSWORD_SALT_ROUNDS: null,
        JWT_SECRET: null,
        LOG_OPTIONS: null
      }
    })
    const constants = require('./constants').default

    expect(Object.keys(constants.config).length).toBe(configKeyArray.length)
    expect(constants.config.DATABASE_URI).toBe('mongodb://localhost:27017/WisdoMile')
    expect(constants.config.TEST_DATABASE_URI).toBe('mongodb://localhost:27017/WisdoMile_TestDB')
    expect(constants.config.GRAPHQL_SERVER_PORT).toBe(4000)
    expect(constants.config.CORS_OPTIONS).toEqual({})
    expect(constants.config.USER_PASSWORD_SALT_ROUNDS).toEqual(10)
    expect(constants.config.JWT_SECRET).toBe('a default JWT secret')
    expect(constants.config.LOG_OPTIONS).toEqual({})
  })

  /** @test {GlobalConstantsWrapper#constructor} */
  test('it should not use the default value if there is a setting in the configuration file', () => {
    // mock the '../configuration' module
    jest.mock('../configuration', () => {
      const casual = require('casual')

      return {
        DATABASE_URI: casual.sentence,
        TEST_DATABASE_URI: casual.sentence,
        GRAPHQL_SERVER_PORT: casual.sentence,
        CORS_OPTIONS: casual.sentence,
        USER_PASSWORD_SALT_ROUNDS: casual.sentence,
        JWT_SECRET: casual.sentence,
        LOG_OPTIONS: casual.sentence
      }
    })
    const config = require('../configuration')
    const constants = require('./constants').default

    configKeyArray.map((key) => {
      expect(constants.config[key]).toBe(config[key])
    })
  })

  /**
    * @test {GlobalConstantsWrapper#constructor}
    * @test {config}
    */
  test('the configuration template file should have same keys as those used by the "constants" module', () => {
    const configTemplate = require('../configuration_template.js').default
    expect(Object.keys(configTemplate).length).toBe(configKeyArray.length)
    Object.keys(configTemplate).map((key) => {
      expect(configKeys[key]).toBe(true)
    })
  })

  /**
    * @test {GlobalConstantsWrapper#constructor}
    * @test {config}
    */
  test('the configuration file should have a subset of keys of those used by the "constants" module', () => {
    const realConfig = require('../configuration').default
    expect(Object.keys(realConfig).length).toBeLessThanOrEqual(configKeyArray.length)
    Object.keys(realConfig).map((key) => {
      expect(configKeys[key]).toBe(true)
    })
  })
})
