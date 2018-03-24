import { shallow } from 'enzyme'
import Section from '../../src/common/Section'

describe('<Section />', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<Section name="Name">Children</Section>)
    expect(wrapper).toMatchSnapshot()
  })
})
