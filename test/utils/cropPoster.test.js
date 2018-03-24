import cropPoster from '../../src/utils/cropPoster'

describe('cropPoster', () => {
  it('should add crop size to poster links', () => {
    expect(cropPoster(undefined)).toEqual('')

    const img = 'img@._V1_SX300.jpg'
    expect(cropPoster(img)).toEqual('img@._V1_SX300_CR0,0,300,444_AL_.jpg')
  })
})
