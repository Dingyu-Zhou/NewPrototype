import { GraphQLScalarType } from 'graphql'
import { Kind } from 'graphql/language'

const DateType = new GraphQLScalarType({
  name: 'Date',

  description: 'Custom GraphQL Scalar Type: Date',

  /** @todo need more exception handling logic to make the function stabler */
  parseValue (value) {
    if (Number.isInteger(value)) {
      return new Date(value) // value from the client, should be a number: the Epoch time in millisecond
    }
    return null
  },

  serialize (value) {
    return value.getTime() // value sent to the client
  },

  parseLiteral (ast) {
    if (ast.kind === Kind.INT) {
      return parseInt(ast.value, 10) // ast value is always in string format
    }
    return null
  }
})

export default DateType
