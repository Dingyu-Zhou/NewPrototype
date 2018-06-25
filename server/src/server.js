import express from 'express'
import bodyParser from 'body-parser'
import jwt from 'express-jwt'
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express'
import cors from 'cors'
import mongoose from 'mongoose'

import constants from './constants'
import { schema } from './graphql/schema'
import logger from './utils/logger'
import User from './models/user'

mongoose.Promise = global.Promise
const databaseUri = constants.config.DATABASE_URI
const graphqlServerPort = constants.config.GRAPHQL_SERVER_PORT
let mongooseConnection = null

const startAll = async function () {
  try {
    logger.info(`Connecting to the database ...`)
    mongooseConnection = mongoose.connect(databaseUri)
    await mongooseConnection
    logger.info(`Connected to the database: ${databaseUri}`)

    let server = express()

    server.use('*', cors(constants.config.CORS_OPTIONS))
    server.use('/graphql', bodyParser.json(), jwt({
      secret: constants.config.JWT_SECRET,
      credentialsRequired: false
    }), graphqlExpress(request => {
      return {
        schema,
        context: {
          user: request.user ? User.findOne({ where: { id: request.user.id } }) : Promise.resolve(null)
        }
      }
    }))
    server.use('/graphiql', graphiqlExpress({
      endpointURL: '/graphql'
    }))

    await server.listen(graphqlServerPort)
  } catch (error) {
    logger.error('Failed to start the GraphQL server: ', error)
  }
}

// If the Node process ends, close all related applications
const closeAll = async function () {
  try {
    if (mongooseConnection) {
      logger.info(`Disconnecting from the database ...`)
      await mongooseConnection.disconnect()
      logger.info(`Disconnected from the database: ${databaseUri}`)
    }
    process.exit(0)
  } catch (error) {
    logger.error('Failed to close the GraphQL server: ', error)
  }
}

process.on('SIGINT', closeAll).on('SIGTERM', closeAll)

startAll().then(() => {
  logger.info(`The GraphQL server is listening to the port: ${graphqlServerPort}`)
})
