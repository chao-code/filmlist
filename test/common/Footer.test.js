import { shallow } from 'enzyme'
import Footer from '../../src/common/Footer'

describe('<Footer />', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<Footer />)
    expect(wrapper).toMatchSnapshot()
  })
})
