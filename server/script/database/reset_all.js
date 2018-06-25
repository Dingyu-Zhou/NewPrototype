import mongoose from 'mongoose'

import constants from '../src/constants'

if (process.env.NODE_ENV && process.env.NODE_ENV !== 'production') {
  const databaseResetAll = async () => {
    mongoose.Promise = global.Promise
    const databaseUri = constants.config.DATABASE_URI

    console.log()
    console.log(`Going to reset database: ${databaseUri}.`)
    console.log()
    console.log('---------- START ----------')
    console.log()

    let mongooseConnection = mongoose.connect(databaseUri, { useMongoClient: true })
    await mongooseConnection

    if (mongoose.connection.readyState === 1) {
      console.log(`Dropping database "${databaseUri}" ...`)
      // drop database
      await mongooseConnection.connection.dropDatabase()
      console.log('Finished Dropping.')

      // disconnect from the database
      await mongooseConnection.disconnect()
    } else {
      console.log(`Something may went wrong. Cannot connect to the database: "${databaseUri}".`)
      mongooseConnection.disconnect()
    }

    console.log()
    console.log('---------- END ----------')
  }

  databaseResetAll().then(() => {
    console.log()
  }).catch(console.error)
} else {
  console.log('This script is only runnable when NODE_ENV is set and not set to "production".')
}
