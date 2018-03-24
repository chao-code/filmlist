import { shallow } from 'enzyme'
import Lists from '../../src/common/Lists'
import { mockRecentLists as mockLists } from '../mocks/dataMock'

describe('<Lists />', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<Lists lists={mockLists} />)
    expect(wrapper.find('li').length).toBe(mockLists.length)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render compact correctly', () => {
    const wrapper = shallow(<Lists lists={mockLists} compact />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should show the posters of each list', () => {
    const wrapper = shallow(<Lists lists={mockLists} />)
    const list = wrapper.find('li').first()
    expect(list.find('Poster').length).toBe(mockLists.length)
  })

  it('should link to a list path', () => {
    const wrapper = shallow(<Lists lists={mockLists} />)
    const list = wrapper.find('li').first()
    const path = list.find('Link').first().prop('to')
    expect(path).toBe(`/list/${mockLists[0].listID}`)
  })
})
