import 'isomorphic-fetch'

const api = '//film-info.herokuapp.com/api/v1'

export function getPopularFilms() {
  const url = `${api}/films/`

  return (
    fetch(url)
    .then(res => res.json())
  )
}

const processFilmDetail = data => {
  const film = {
    Title: data.Title,
    Year: data.Year,
    Poster: data.Poster,
    Genre: data.Genre,
    Rated: data.Rated,
    Runtime: data.Runtime,
    Released: data.Released,
    Language: data.Language,
    Country: data.Country,
    Production: data.Production,
    Plot: data.Plot,
    Director: data.Director.split(', '),
    Writers: data.Writer.split(', '),
    Cast: data.Actors.split(', '),
    imdbID: data.imdbID,
  }

  data.Ratings.forEach(rating => {
    switch (rating.Source) {
      case 'Internet Movie Database':
        film['IMDb Rating'] = rating.Value
        break
      case 'Rotten Tomatoes':
        film['Rotten Tomatoes'] = rating.Value
        break
      case 'Metacritic':
        film.Metascore = rating.Value
        break
      default:
    }
  })
  ;['IMDb Rating', 'Rotten Tomatoes', 'Metascore'].forEach(key => {
    if (!film[key]) {
      film[key] = 'N/A'
    }
  })

  return film
}

export function getFilmDetail(filmID) {
  return (
    fetch(`${api}/films/${filmID}`)
    .then(res => res.json())
    .then(processFilmDetail)
  )
}

const processSearchResults = data => {
  if (data.Response === 'True') {
    return data.Search.map(film => ({
      poster: film.Poster,
      title: film.Title,
      year: film.Year,
      imdbID: film.imdbID,
    }))
  }
  return []
}

export function searchFilms(title) {
  return (
    fetch(`${api}/films/search?title=${title}`)
    .then(res => res.json())
    .then(processSearchResults)
  )
}
