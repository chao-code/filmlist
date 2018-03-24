import { shallow } from 'enzyme'
import Poster from '../../src/common/Poster'

jest.mock('../../src/utils/cropPoster', () => jest.fn(() => 'cropped'))

describe('<Poster />', () => {
  it('should render correctly', () => {
    const poster = 'poster.jpg'
    const wrapper = shallow(<Poster poster={poster} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should crop the poster', () => {
    const poster = 'poster.jpg'
    const wrapper = shallow(<Poster poster={poster} crop />)
    const src = wrapper.find('img').prop('src')
    expect(src).toBe('cropped')
  })
})
