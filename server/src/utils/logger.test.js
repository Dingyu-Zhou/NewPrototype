import casual from 'casual'

const cleanUpModuleCaches = function () {
  // clean up caches for all these modules
  delete require.cache[require.resolve('../../configuration')]
  delete require.cache[require.resolve('../constants')]
  delete require.cache[require.resolve('./logger')]
}

const cleanUpMocks = function () {
  // clean up mocks
  jest.resetModules()
  jest.unmock('../constants')
  jest.unmock('../../configuration')
}

/**
  * @test {logger}
  * @test {LoggerWrapper}
  */
describe('test the log options in the configuration file', () => {
  beforeEach(() => {
    cleanUpModuleCaches()
  })

  afterEach(() => {
    cleanUpMocks()
  })

  afterAll(() => {
    cleanUpModuleCaches()
  })

  /** @test {LoggerWrapper#constructor} */
  test('the default logger options should work', () => {
    // mock the '../../configuration' module
    // default log level is 'INFO'
    jest.mock('../../configuration', () => {
      return {
        LOG_OPTIONS: null
      }
    })
    let mockLogger = require('./logger').default
    expect(mockLogger.debug).not.toEqual(mockLogger._logProperties['DEBUG'].logger)
    expect(mockLogger.info).toEqual(mockLogger._logProperties['INFO'].logger)
    expect(mockLogger.warn).toEqual(mockLogger._logProperties['WARNING'].logger)
  })

  /** @test {LoggerWrapper#constructor} */
  test('the logger options in the configuration file should work', () => {
    // mock the '../../configuration' module
    // set the log level to 'WARNING'
    jest.mock('../../configuration', () => {
      return {
        LOG_OPTIONS: { logLevel: 'WARNING' }
      }
    })
    const mockLogger = require('./logger').default
    expect(mockLogger.debug).not.toEqual(mockLogger._logProperties['DEBUG'].logger)
    expect(mockLogger.info).not.toEqual(mockLogger._logProperties['INFO'].logger)
    expect(mockLogger.warn).toEqual(mockLogger._logProperties['WARNING'].logger)
  })

  /** @test {LoggerWrapper#constructor} */
  test('the constructor of the LoggerWrapper class could handle an "null" log options', () => {
    // mock the '../../configuration' module
    // set the log level to 'WARNING'
    jest.mock('../constants', () => {
      return {
        config: { LOG_OPTIONS: null }
      }
    })
    const mockLogger = require('./logger').default
    expect(mockLogger._logOptions).toEqual({})
  })

  /** @test {LoggerWrapper#_resetLogLevel} */
  test('that reset log level without argument should reset log level to "INFO" if the log options in the configuration file is default', () => {
    // mock the '../../configuration' module
    // default log level is 'INFO'
    jest.mock('../../configuration', () => {
      return {
        LOG_OPTIONS: null
      }
    })

    let mockLogger = require('./logger').default
    mockLogger._resetLogLevel('DEBUG')
    expect(mockLogger.debug).toEqual(mockLogger._logProperties['DEBUG'].logger)
    expect(mockLogger.info).toEqual(mockLogger._logProperties['INFO'].logger)

    // reset without argument
    mockLogger._resetLogLevel()
    expect(mockLogger.debug).not.toEqual(mockLogger._logProperties['DEBUG'].logger)
    expect(mockLogger.info).toEqual(mockLogger._logProperties['INFO'].logger)
  })

  /** @test {LoggerWrapper#_resetLogLevel} */
  test('that reset log level without argument should reset log level according to the log options in the configuration file', () => {
    // mock the '../../configuration' module
    // set the log level to 'ERROR'
    jest.mock('../../configuration', () => {
      return {
        LOG_OPTIONS: { logLevel: 'ERROR' }
      }
    })

    let mockLogger = require('./logger').default
    mockLogger._resetLogLevel('INFO')
    expect(mockLogger.warn).toEqual(mockLogger._logProperties['WARNING'].logger)
    expect(mockLogger.error).toEqual(mockLogger._logProperties['ERROR'].logger)

    // reset without argument
    mockLogger._resetLogLevel()
    expect(mockLogger.warn).not.toEqual(mockLogger._logProperties['WARNING'].logger)
    expect(mockLogger.error).toEqual(mockLogger._logProperties['ERROR'].logger)
  })
})

/**
  * @test {logger}
  * @test {LoggerWrapper}
  */
describe('test the stability of the utility: logger', () => {
  let logger = null

  beforeAll(() => {
    logger = require('./logger').default
  })

  afterAll(() => {
    cleanUpModuleCaches()
  })

  /** @test {logger} */
  test('that use the logger should not cause any crash', () => {
    let logMessage = casual.sentence
    logger._resetLogLevel('DEBUG')
    logger.debug(logMessage)
    logger.info(logMessage)
    logger.warn(logMessage)
    logger.error(logMessage)
  })
})

/**
  * @test {logger}
  * @test {LoggerWrapper}
  */
describe('test the logic of the utility: logger', () => {
  let logger, logTypes, logProperties
  let debugLog, infoLog, warningLog, errorLog, offLog

  beforeAll(() => {
    logger = require('./logger').default
    logTypes = logger._logTypes
    logProperties = logger._logProperties

    debugLog = logTypes[0]
    infoLog = logTypes[1]
    warningLog = logTypes[2]
    errorLog = logTypes[3]
    offLog = logTypes[4]

    logTypes.map(type => {
      if (logProperties[type].logger) {
        logProperties[type].logger = jest.fn()
      }
    })
  })

  afterAll(() => {
    logTypes.map(type => {
      if (logProperties[type].logger) {
        logProperties[type].logger.mockRestore()
      }
    })
    cleanUpModuleCaches()
  })

  /**
    * A helper function to keep the test code DRY
    * It checks if the mock log function was called correctly.
    */
  const checkMockLogger = function (logType, callCount, logArgument) {
    let mockLogger = logProperties[logType].logger
    if (mockLogger) {
      expect(mockLogger.mock.calls.length).toBe(callCount)
      if (callCount > 0) {
        if (logArgument instanceof Array) {
          logArgument.map((argument, index) => {
            expect(mockLogger.mock.calls[0][index]).toEqual(argument)
          })
        } else {
          expect(mockLogger.mock.calls[0][0]).toEqual(logArgument)
        }
      }
      mockLogger.mockReset()
    } else {
      expect(callCount).toBe(0)
    }
  }

  /**
    * Mimic the function call like: logger.debug(...), logger.info(...), logger.warn(...), logger.error(...)
    */
  const callLogyType = function (logType, logArgument) {
    let loggerKey = logProperties[logType].loggerKey
    if (loggerKey) {
      let logFunc = logger[loggerKey]
      logFunc(logArgument)
    }
  }

  /** When the log type was enabled by the setting in log options, it should do the logging job. */
  const logTypeShouldWork = function (logType) {
    let logArgument = casual.sentence
    callLogyType(logType, logArgument)
    checkMockLogger(logType, 1, logArgument)
  }

  /** When the log type was disabled by the setting in log options, it should be muted. So it should not do the logging job. */
  const logTypeShouldNotWork = function (logType) {
    let logArgument = casual.sentence
    callLogyType(logType, logArgument)
    checkMockLogger(logType, 0)
  }

  /**
    * A helper function to keep the test code DRY
    * It goes through all log types to see if they work correctly according to the setting in log options.
    */
  const checkAllLogTypes = function (...workableLogTypes) {
    let workable = [...workableLogTypes]
    let workableMap = workable.reduce((result, type) => {
      result[type] = true
      return result
    }, {})

    let notWorkable = []
    logTypes.map(type => {
      if (!workableMap[type]) {
        notWorkable.push(type)
      }
    })

    workable.map(type => {
      logTypeShouldWork(type)
    })

    notWorkable.map(type => {
      logTypeShouldNotWork(type)
    })
  }

  /** @test {LoggerWrapper#constructor} */
  test('it should catch the change of log types', () => {
    expect(logTypes).toEqual(['DEBUG', 'INFO', 'WARNING', 'ERROR', 'OFF'])
  })

  /** @test {logger} */
  test('using logger keys directly should work', () => {
    logger._resetLogLevel(debugLog)

    let logArgument = casual.sentence
    logger.debug(logArgument)
    checkMockLogger(debugLog, 1, logArgument)

    logArgument = casual.sentence
    logger.info(logArgument)
    checkMockLogger(infoLog, 1, logArgument)

    logArgument = casual.sentence
    logger.warn(logArgument)
    checkMockLogger(warningLog, 1, logArgument)

    logArgument = casual.sentence
    logger.error(logArgument)
    checkMockLogger(errorLog, 1, logArgument)
  })

  /** @test {LoggerWrapper#_resetLogLevel} */
  test('that reset log level should work with passed argument', () => {
    logger._resetLogLevel(debugLog)
    checkAllLogTypes(debugLog, infoLog, warningLog, errorLog)

    logger._resetLogLevel(infoLog)
    checkAllLogTypes(infoLog, warningLog, errorLog)

    logger._resetLogLevel(warningLog)
    checkAllLogTypes(warningLog, errorLog)

    logger._resetLogLevel(errorLog)
    checkAllLogTypes(errorLog)

    logger._resetLogLevel(offLog)
    checkAllLogTypes()
  })

  /** @test {LoggerWrapper#_generateLogFunction} */
  test('the logger could be turned off', () => {
    logger._resetLogLevel(offLog)
    checkAllLogTypes()
  })

  /** @test {LoggerWrapper#_generateLogFunction} */
  test('that reset the log level with a undefined level will turn off all logs', () => {
    logger._resetLogLevel(debugLog)
    checkAllLogTypes(debugLog, infoLog, warningLog, errorLog)

    logger._resetLogLevel('undefined log level')
    checkAllLogTypes()
  })

  /** @test {LoggerWrapper#constructor} */
  test('it supports any number of log arguments', () => {
    logger._resetLogLevel(debugLog)
    logger.info()
    checkMockLogger(infoLog, 1)

    let logArgument1 = casual.sentence
    logger.info(logArgument1)
    checkMockLogger(infoLog, 1, logArgument1)

    let logArgument2 = casual.sentence
    logger.info(logArgument1, logArgument2)
    checkMockLogger(infoLog, 1, [logArgument1, logArgument2])

    let logArgument3 = casual.sentence
    logger.info(logArgument1, logArgument2, logArgument3)
    checkMockLogger(infoLog, 1, [logArgument1, logArgument2, logArgument3])
  })
})
