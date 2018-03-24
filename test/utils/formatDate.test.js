import formatDate from '../../src/utils/formatDate'

describe('formatDate', () => {
  it('should format a timestamp', () => {
    const timestamp = new Date(2000, 0, 1).valueOf()
    expect(formatDate(timestamp)).toEqual('Jan 1, 2000')
  })
})
