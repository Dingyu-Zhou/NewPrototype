import React from 'react'
import { shallow } from 'enzyme'
import { Route } from 'react-router-dom'
import { persistStore } from 'redux-persist'

import App from './App'

/** @test {App} */
describe('Test <App />', () => {
  /** @test {App} */
  test('<App /> should shallowly render correctly.', () => {
    const wrapper = shallow(<App />, { disableLifecycleMethods: true })
    expect(wrapper.text()).toBe('Loading...')
    wrapper.setState({ reduxPersistRehydrated: true })
    expect(wrapper.find(Route).length).toBe(5)
  })

  /** @test {App} */
  test('<App /> componentDidMount should invoke persistStore.', () => {
    const wrapper = shallow(<App />, { disableLifecycleMethods: true })
    expect(wrapper.state('reduxPersistRehydrated')).toBe(false)
    const instance = wrapper.instance()
    instance.componentDidMount()
    expect(persistStore.mock.calls.length).toBe(1)
    expect(wrapper.state('reduxPersistRehydrated')).toBe(true)
  })
})