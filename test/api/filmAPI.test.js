import fetchMock from 'fetch-mock'
import { getPopularFilms, getFilmDetail, searchFilms } from '../../src/api/filmAPI'

describe('film API', () => {
  const api = '//bernoulli-io.herokuapp.com/api'

  afterEach(fetchMock.restore)

  it('should fetch popular films', () => {
    const url = `${api}/movies`

    fetchMock.once(url, { mostPopular: [{ title: 'some film' }] })

    return expect(getPopularFilms()).resolves.toEqual([{ title: 'some film' }])
  })

  it('should get film detail', () => {
    const filmID = '12345'
    const url = `${api}/movies/${filmID}`

    fetchMock.once(url, {
      Actors: 'actor1, actor2',
      Country: 'country',
      Director: 'director',
      Genre: 'genre',
      Language: 'language',
      Plot: 'plot',
      Poster: 'poster',
      Production: 'production',
      Rated: 'rated',
      Ratings: [
        { Source: 'Internet Movie Database', Value: '8.0/10' },
        { Source: 'Metacritic', Value: '76/100' },
      ],
      Released: 'released',
      Runtime: 'runtime',
      Title: 'title',
      Writer: 'writer',
      Year: 'year',
      imdbID: 'imdbID',
    })

    return (
      expect(getFilmDetail(filmID))
      .resolves
      .toEqual({
        Title: 'title',
        Year: 'year',
        Poster: 'poster',
        Genre: 'genre',
        Rated: 'rated',
        Runtime: 'runtime',
        Released: 'released',
        Language: 'language',
        Country: 'country',
        Production: 'production',
        Metascore: '76/100',
        'IMDb Rating': '8.0/10',
        'Rotten Tomatoes': 'N/A',
        Plot: 'plot',
        Director: ['director'],
        Writers: ['writer'],
        Cast: ['actor1', 'actor2'],
        imdbID: 'imdbID',
      })
    )
  })

  it('should search films by title', () => {
    const title = 'some film'
    const url = `${api}/search?title=${title}`

    fetchMock.once(url, {
      Response: 'True',
      Search: [{
        Poster: 'poster',
        Title: 'title',
        Type: 'type',
        Year: 'year',
        imdbID: 'imdbID',
      }],
    })

    return (
      expect(searchFilms(title))
      .resolves
      .toEqual([{
        poster: 'poster',
        title: 'title',
        year: 'year',
        imdbID: 'imdbID',
      }])
    )
  })
})
