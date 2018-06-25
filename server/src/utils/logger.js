import constants from '../constants'

/**
  * This is a logger wrapper to decouple all loggings from the lower level.
  * It's temporarily using "console.log/info/warn/error" to do the job.
  *
  * @access private
  * @todo It would be a good idea to use some logging library in the future.
  */
class LoggerWrapper {
  /**
    * It initializes private members and generates loggers for each log type
    *
    * @param {object} logOptions - the customized log options that could be set in the configuration file (see: {@link config})
    * @param {string} logOptions.logLevel - the log level set in the server
    *     It can be default or either one of these value: ['DEBUG', 'INFO', 'WARNING', 'ERROR', 'OFF'].
    *     Otherwise, a unrecognized value will turn off the log.
    */
  constructor (logOptions) {
    /**
      * It stores the settings from the log options.
      * @type {object}
      */
    this._logOptions = logOptions || {}

    /**
      * It defines the supported log types.
      * @type {Array}
      */
    this._logTypes = ['DEBUG', 'INFO', 'WARNING', 'ERROR', 'OFF']

    /**
      * It stores the preset properties for each log type.
      * @type {object}
      */
    this._logProperties = {}

    /**
      * It stores the default log level.
      * @type {string}
      */
    this._defaultLogLevel = null

    /**
      * It is a short-cut to access the preset properties for the log type: 'OFF'
      * @type {object}
      */
    this._offLogProperties = null

    const [debugLog, infoLog, warningLog, errorLog, offLog] = this._logTypes

    this._logProperties[debugLog] = { priority: 1000, loggerKey: 'debug', logger: console.log }
    this._logProperties[infoLog] = { priority: 2000, loggerKey: 'info', logger: console.info }
    this._logProperties[warningLog] = { priority: 3000, loggerKey: 'warn', logger: console.warn }
    this._logProperties[errorLog] = { priority: 4000, loggerKey: 'error', logger: console.error }
    this._logProperties[offLog] = { priority: 5000 }   // turn off the log

    this._defaultLogLevel = infoLog
    this._offLogProperties = this._logProperties[offLog]

    this._generateLogger(this._logOptions.logLevel)
  }

  /**
    * It generates an actual logger function for the particular log type.
    * If this particular log type is muted by the settings in log options,
    * then use a dumb function as its logger function to increase the speed.
    *
    * @param {string} logType - The log type that needs a generated log function
    * @param {string} logLevel - The log level set in the server
    *
    * @return {function} An actual logger function for the particular log type
    */
  _generateLogFunction (logType, logLevel) {
    let setting = this._logProperties[logLevel || this._defaultLogLevel]
    let priority = setting ? setting.priority : this._offLogProperties.priority

    if (this._logProperties[logType].priority >= priority) {
      return this._logProperties[logType].logger
    } else {
      return function () {}   // a dumb function
    }
  }

  /**
    * It pre-generates loggers for each log type according to the settings in log options.
    * Pre-generating loggers could invoke the lower level loggers directly.
    * Also, they are faster than run-time mechanism.
    *
    * @param {string} logLevel - The log level set in the server
    */
  _generateLogger (logLevel) {
    let self = this
    self._logTypes.map(type => {
      let loggerKey = self._logProperties[type].loggerKey
      if (loggerKey) {
        self[loggerKey] = self._generateLogFunction(type, logLevel)
      }
    })
  }

  /**
    * Call this function to reset the log level of the server.
    * It will regenerate all loggers for each log type.
    *
    * @param {string} newLogLevel - The new log level to be set for the server
    */
  _resetLogLevel (newLogLevel) {
    // if newLogLevel is not provided, then reset log level according to the log configuration
    let logLevel = newLogLevel || (this._logOptions.logLevel || this._defaultLogLevel)
    this._generateLogger(logLevel)
  }
}

const logger = new LoggerWrapper(constants.config.LOG_OPTIONS)

/**
  * Please use this logger to wrap all loggings.
  * It is an instance of the class {@link LoggerWrapper}
  *
  * @access public
  * @type {object}
  * @property {function} debug The logger function for the "DEBUG" level
  * @property {function} info The logger function for the "INFO" level
  * @property {function} warn The logger function for the "WARNING" level
  * @property {function} error The logger function for the "ERROR" level
  */
export default logger
