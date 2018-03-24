import debounce from '../../src/utils/debounce'

describe('debounce', () => {
  it('should debouce a function', () => {
    jest.useFakeTimers()
    const func = jest.fn()
    const delay = 500
    const deboucedFunc = debounce(func, delay)
    deboucedFunc(1)
    deboucedFunc(2)
    deboucedFunc(3)

    jest.runTimersToTime(delay)
    expect(setTimeout).toHaveBeenCalledTimes(3)
    expect(func.mock.calls.length).toBe(1)
    expect(func.mock.calls[0][0]).toBe(3)
  })
})
