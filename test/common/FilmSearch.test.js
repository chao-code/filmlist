import { mount } from 'enzyme'
import { _FilmSearch as FilmSearch } from '../../src/common/FilmSearch'
import { mockSearchResults, mockQuery } from '../mocks/dataMock'

jest.mock('../../src/utils/debounce', () => jest.fn(func => func))

const fakePromise = { then: func => func() }
const props = {
  placeholder: 'placeholder',
  onResultClick: jest.fn(),
  loadSearch: jest.fn(() => fakePromise),
  searchResultsByQuery: {
    [mockQuery]: {
      isFetching: false,
      results: mockSearchResults,
    },
  },
}
const event = { target: { value: mockQuery } }

describe('<FilmSearch />', () => {
  it('should render the input', () => {
    const wrapper = mount(<FilmSearch {...props} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should search and render results', () => {
    const wrapper = mount(<FilmSearch {...props} />)
    wrapper.find('input').simulate('focus')
    wrapper.find('input').simulate('change', event)
    expect(wrapper.find('input').prop('value')).toBe(mockQuery)
    expect(wrapper.find('li').length).toBe(mockSearchResults.length)
    expect(wrapper).toMatchSnapshot()
  })

  it('should hide resultes when input is unfocused', () => {
    const wrapper = mount(<FilmSearch {...props} />)
    wrapper.find('input').simulate('focus')
    wrapper.find('input').simulate('change', event)
    wrapper.find('input').simulate('blur')
    expect(wrapper.find('input').prop('value')).toBe(mockQuery)
    expect(wrapper.find('li').length).toBe(0)
  })

  it('should call onResultClick', () => {
    const wrapper = mount(<FilmSearch {...props} />)
    wrapper.find('input').simulate('focus')
    wrapper.find('input').simulate('change', event)
    wrapper.find('li').first().simulate('click')
    expect(props.onResultClick.mock.calls[0][0]).toEqual(mockSearchResults[0])
    expect(wrapper.find('input').prop('value')).toBe('')
    expect(wrapper.state().isFocused).toBe(false)
  })
})
