import { shallow } from 'enzyme'
import ListForm from '../../src/common/ListForm'
import { mockListDetail } from '../mocks/dataMock'

const { createdOn, filmCount, ...listDetail } = mockListDetail

describe('<ListForm />', () => {
  it('should shallow the empty form', () => {
    const props = {
      onSave: () => {},
      onCancel: () => {},
    }
    const wrapper = shallow(<ListForm {...props} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should shallow the form filled with list', () => {
    const props = {
      list: listDetail,
      onSave: () => {},
      onCancel: () => {},
    }
    const wrapper = shallow(<ListForm {...props} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should add a film to the list', () => {
    const props = {
      list: {
        ...listDetail,
        films: listDetail.films.slice(0, 2),
      },
      onSave: () => {},
      onCancel: () => {},
    }
    const wrapper = shallow(<ListForm {...props} />)
    expect(wrapper.find('li').length).toBe(2)
    wrapper.instance().addFilm(listDetail.films[2])
    wrapper.update()
    expect(wrapper.find('li').length).toBe(3)
    expect(wrapper.find('Poster').at(2).prop('poster')).toBe(listDetail.films[2].poster)
  })

  it('should change comment input', () => {
    const props = {
      list: listDetail,
      onSave: () => {},
      onCancel: () => {},
    }
    const event = { target: { value: 'a comment' } }
    const wrapper = shallow(<ListForm {...props} />)
    let input = wrapper.find('input[placeholder="Add a Comment"]').at(2)
    expect(input.prop('value')).toBe(listDetail.films[2].comment)
    input.simulate('change', event)
    input = wrapper.find('input[placeholder="Add a Comment"]').at(2)
    expect(input.prop('value')).toBe(event.target.value)
  })

  it('should change index input', () => {
    const props = {
      list: listDetail,
      onSave: () => {},
      onCancel: () => {},
    }
    const event = { target: { value: '2' } }
    const wrapper = shallow(<ListForm {...props} />)
    let input = wrapper.find('input.order-input').first()
    expect(input.prop('value')).toBe('1')
    input.simulate('change', event)
    input = wrapper.find('input.order-input').first()
    expect(input.prop('value')).toBe('2')
  })

  it('should move a film to the new index', () => {
    const props = {
      list: listDetail,
      onSave: () => {},
      onCancel: () => {},
    }
    const event = {
      key: 'Enter',
      target: { value: '1' },
    }
    const wrapper = shallow(<ListForm {...props} />)
    wrapper.find('input.order-input').at(2).simulate('keyPress', event)
    expect(wrapper.find('Poster').at(0).prop('poster')).toBe(listDetail.films[2].poster)
    expect(wrapper.find('Poster').at(1).prop('poster')).toBe(listDetail.films[0].poster)
    expect(wrapper.find('Poster').at(2).prop('poster')).toBe(listDetail.films[1].poster)
  })

  it('should remove a film from the list', () => {
    const props = {
      list: listDetail,
      onSave: () => {},
      onCancel: () => {},
    }
    const wrapper = shallow(<ListForm {...props} />)
    expect(wrapper.find('li').length).toBe(listDetail.films.length)
    wrapper.find('button.close').at(1).simulate('click')
    expect(wrapper.find('Poster').at(0).prop('poster')).toBe(listDetail.films[0].poster)
    expect(wrapper.find('Poster').at(1).prop('poster')).toBe(listDetail.films[2].poster)
  })

  it('should validate before save', () => {
    const onSave = jest.fn()
    const props = {
      onSave,
      onCancel: () => {},
    }
    const wrapper = shallow(<ListForm {...props} />)
    wrapper.find('Button').first().simulate('click')
    expect(wrapper.find('#subjectInput').hasClass('is-invalid')).toBeTruthy()
    expect(wrapper.find('#listedByInput').hasClass('is-invalid')).toBeTruthy()
    expect(wrapper.find('Connect(FilmSearch)').prop('inputClass')).toBe('is-invalid')
    expect(wrapper.find('.alert').length).toBe(1)
    expect(onSave.mock.calls.length).toBe(0)
  })

  it('should save the list', () => {
    const onSave = jest.fn()
    const props = {
      list: listDetail,
      onSave,
      onCancel: () => {},
    }
    const wrapper = shallow(<ListForm {...props} />)
    wrapper.find('Button').first().simulate('click')
    expect(onSave.mock.calls[0][0]).toEqual(listDetail)
  })

  it('should cancel editing the list', () => {
    const onCancel = jest.fn()
    const props = {
      list: listDetail,
      onSave: () => {},
      onCancel,
    }
    const wrapper = shallow(<ListForm {...props} />)
    wrapper.find('Button').at(1).simulate('click')
    expect(onCancel.mock.calls.length).toBe(1)
  })
})
