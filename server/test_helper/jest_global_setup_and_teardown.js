import casual from 'casual'
import factory, { MongooseAdapter } from 'factory-girl'
import mongoose from 'mongoose'

import constants from '../src/constants'

factory.setAdapter(new MongooseAdapter())
mongoose.Promise = global.Promise
let mongooseConnection = null

beforeAll(() => {
  const randomTestDatabaseUri = `${constants.config.TEST_DATABASE_URI}__${casual.uuid}`

  // connecting to the database
  // lazy connection. Only connect and create a database if there is any database operation in tests.
  mongooseConnection = mongoose.connect(randomTestDatabaseUri, { useMongoClient: true })
})

afterAll(async () => {
  // if all tests don't need to use the database, then the "readyState" should be 2 at this stage
  if (mongoose.connection.readyState === 1) {
    // drop database
    await mongooseConnection.connection.dropDatabase()

    // disconnect from the database
    await mongooseConnection.disconnect()
  } else {
    // not sure why, but have to call "disconnect" without using "await" to terminate normally if there is no database usage for tests.
    mongooseConnection.disconnect()
  }
})
