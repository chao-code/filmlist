import { shallow } from 'enzyme'
import { _Header as Header } from '../../src/common/Header'

const props = {
  history: {
    push: jest.fn(),
  },
  location: {
    pathname: '/',
  },
}

describe('<Header />', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<Header {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})
