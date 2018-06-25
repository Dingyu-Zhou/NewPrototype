import { Kind } from 'graphql/language'

import DateType from './date'

/** @test {resolvers} */
describe('test the custom GraphQL scalar type: Date', () => {
  test('the name should be correct', () => {
    expect(DateType.name).toBe('Date')
  })

  test('the description should be correct', () => {
    expect(DateType.description).toBe('Custom GraphQL Scalar Type: Date')
  })

  test('parseValue should work correctly', () => {
    let epochTimeInMillisecond = 1520816322223
    let parsedDate = DateType.parseValue(epochTimeInMillisecond)
    expect(parsedDate).toBeInstanceOf(Date)
    expect(parsedDate.getTime()).toBe(epochTimeInMillisecond)

    // only integer works
    let epochTimeStr = '1520816322223'
    parsedDate = DateType.parseValue(epochTimeStr)
    expect(parsedDate).toBe(null)
    let epochTimeInFloat = 1520816322223.5
    parsedDate = DateType.parseValue(epochTimeInFloat)
    expect(parsedDate).toBe(null)
  })

  test('serialize should work correctly', () => {
    let epochTimeInMillisecond = 1520816322223
    let theDate = new Date(epochTimeInMillisecond)
    expect(DateType.serialize(theDate)).toBe(epochTimeInMillisecond)
  })

  test('parseLiteral should work correctly', () => {
    let epochTimeInMillisecond = 1520816322223
    let epochTimeStr = '1520816322223'
    let ast = {
      kind: Kind.INT,
      value: epochTimeStr
    }
    expect(DateType.parseLiteral(ast)).toBe(epochTimeInMillisecond)

    // invalid ast
    ast = {
      kind: Kind.FLOAT,
      value: epochTimeStr
    }
    expect(DateType.parseLiteral(ast)).toBe(null)
  })
})
