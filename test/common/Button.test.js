import { shallow } from 'enzyme'
import Button from '../../src/common/Button'

describe('<Button />', () => {
  it('should render Link', () => {
    const path = '/path/to'
    const wrapper = shallow(<Button href={path}>link</Button>)
    const href = wrapper.find('Link').prop('to')
    expect(href).toBe(path)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render button', () => {
    const onClick = jest.fn()
    const wrapper = shallow(<Button onClick={onClick}>button</Button>)
    wrapper.simulate('click')
    expect(onClick.mock.calls.length).toBe(1)
    expect(wrapper).toMatchSnapshot()
  })
})
