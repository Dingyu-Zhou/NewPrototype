import { AppApollo } from './app_apollo'

/** @test {AppApollo} */
describe('Test the Apollo wrapper class: AppApollo', () => {
  /** @test {AppApollo} */
  test('AppApollo.networkInterface should return the defined Apollo network interface', () => {
    const networkInterface = AppApollo.networkInterface
    expect(networkInterface).toBeTruthy()
    expect(networkInterface._uri).toBe('http://localhost:4000/graphql')
  })

  /** @test {AppApollo} */
  test('AppApollo.client should return the defined Apollo client', () => {
    const client = AppApollo.client
    expect(client).toBeTruthy()
    expect(client.networkInterface).toEqual(AppApollo.networkInterface)
  })
})