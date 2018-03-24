import {
  mockRecentLists,
  mockRelatedLists,
  mockFilmDetail,
  mockListDetail,
} from '../mocks/dataMock'
import {
  getRecommandedLists,
  getFilmShareLinks,
  getListShareLinks,
  getListWithFilmRatings,
} from '../../src/redux/selectors'


describe('selectors', () => {
  describe('getFilmShareLinks', () => {
    it('should return empty strings before film is loaded', () => {
      const shareLinks = getFilmShareLinks.resultFunc(null)
      expect(shareLinks).toEqual({
        twitter: '',
        facebook: '',
      })
    })

    it('should return currect share links', () => {
      const shareLinks = getFilmShareLinks.resultFunc(mockFilmDetail)
      expect(shareLinks).not.toEqual({
        twitter: '',
        facebook: '',
      })
    })
  })

  describe('getListShareLinks', () => {
    it('should return empty strings before list is loaded', () => {
      const shareLinks = getListShareLinks.resultFunc(null)
      expect(shareLinks).toEqual({
        twitter: '',
        facebook: '',
      })
    })

    it('should return currect share links', () => {
      const shareLinks = getListShareLinks.resultFunc(mockListDetail)
      expect(shareLinks).not.toEqual({
        twitter: '',
        facebook: '',
      })
    })
  })

  describe('getRecommandedLists', () => {
    it('should return null before related lists is loaded', () => {
      const lists = getRecommandedLists.resultFunc(mockRecentLists, null)
      expect(lists).toBeNull()
    })

    it('should return related lists', () => {
      const lists = getRecommandedLists.resultFunc(mockRecentLists, mockRelatedLists)
      expect(lists).toEqual({
        type: 'Related',
        lists: mockRelatedLists,
      })
    })

    it('should return recent lists if no related lists', () => {
      const lists = getRecommandedLists.resultFunc(mockRecentLists, [])
      expect(lists).toEqual({
        type: 'Recent',
        lists: mockRecentLists,
      })
    })
  })

  describe('getListWithFilmRatings', () => {
    it('should return null before list is loaded', () => {
      const list = getListWithFilmRatings.resultFunc(null, null)
      expect(list).toBeNull()
    })

    it('should return list with film ratings', () => {
      const films = mockListDetail.films
      const filmsInList = {
        [films[0].imdbID]: {
          Metascore: '42/100',
          'IMDb Rating': '4.2',
          'Rotten Tomatoes': '42%',
        },
      }
      const list = getListWithFilmRatings.resultFunc(mockListDetail, filmsInList)
      expect(list.films[0]).toEqual({
        ...mockListDetail.films[0],
        metascore: '42/100',
        imdbRating: '4.2',
        rottenTomatoes: '42%',
      })
      expect(list.films[1]).toEqual({
        ...mockListDetail.films[1],
        metascore: 'N/A',
        imdbRating: 'N/A',
        rottenTomatoes: 'N/A',
      })
    })
  })
})
