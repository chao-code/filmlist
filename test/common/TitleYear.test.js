import { shallow } from 'enzyme'
import TitleYear from '../../src/common/TitleYear'

describe('<TitleYear />', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<TitleYear title="title" year="year" />)
    expect(wrapper).toMatchSnapshot()
  })
})
