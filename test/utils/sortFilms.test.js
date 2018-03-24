import sortFilms from '../../src/utils/sortFilms'

describe('sortFilms', () => {
  const film1 = {
    title: 'B C',
    year: '2001',
    metascore: '34/100',
    imdbRating: '3.4',
    rottenTomatoes: '34%',
  }
  const film2 = {
    title: 'B D',
    year: '1997',
    metascore: 'N/A',
    imdbRating: 'N/A',
    rottenTomatoes: 'N/A',
  }
  const film3 = {
    title: 'A B',
    year: '2007',
    metascore: '5/100',
    imdbRating: '0.5',
    rottenTomatoes: '5%',
  }
  const film4 = {
    title: 'D A',
    year: '1999',
    metascore: '91/100',
    imdbRating: '9.1',
    rottenTomatoes: '91%',
  }
  const films = [film1, film2, film3, film4]

  it('should sort by index', () => {
    const sortedFilms = [film1, film2, film3, film4]
    expect(sortFilms(films, 'index')).toEqual(sortedFilms)
  })

  it('should sort by title', () => {
    const sortedFilms = [film3, film1, film2, film4]
    expect(sortFilms(films, 'title')).toEqual(sortedFilms)
  })

  it('should sort by year', () => {
    const sortedFilms = [film3, film1, film4, film2]
    expect(sortFilms(films, '-year')).toEqual(sortedFilms)
  })

  it('should sort by rating', () => {
    const sortedFilms = [film4, film1, film3, film2]
    expect(sortFilms(films, '-metascore')).toEqual(sortedFilms)
  })
})
