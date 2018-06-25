import ActionPrefix from './action_prefix'

/** @test {ActionPrefix} */
describe('Test the class: ActionPrefix', () => {
  /** @test {ActionPrefix} */
  test('All action prefix should not repetitive.', () => {
    let dict = {}

    expect(dict[ActionPrefix.user]).toBeFalsy()
    dict[ActionPrefix.user] = true
  })
})