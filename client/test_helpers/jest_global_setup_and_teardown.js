import 'core-js/es6/map'
import 'core-js/es6/set'
import 'raf/polyfill'

import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

beforeAll(() => {
  /**
    * configure Enzyme with correct react adapter.
    */
  Enzyme.configure({ adapter: new Adapter() })
})
