import { createSelector } from 'reselect'

const getFilm = ({ filmByID }, { match }) => {
  const film = filmByID[match.params.filmID]
  return (
    film && !film.isFetching
      ? film.film
      : null
  )
}

export const getFilmShareLinks = createSelector(
  [getFilm],
  film => {
    if (film) {
      const url = location.href
      return {
        twitter: `https://twitter.com/intent/tweet?text=${film.Title}%20(${film.Year})%20on%20FilmList:&url=${url}`,
        facebook: `http://www.facebook.com/sharer.php?u=${encodeURIComponent(url)}`,
      }
    }
    return {
      twitter: '',
      facebook: '',
    }
  }
)

const getRecentLists = ({ recentLists }) => (
  recentLists && !recentLists.isFetching
    ? recentLists.lists
    : null
)

const getRelatedLists = (state, { match }) => {
  const relatedLists = state.relatedListsByFilmID[match.params.filmID]
  return (
    relatedLists && !relatedLists.isFetching
      ? relatedLists.lists
      : null
  )
}

export const getRecommandedLists = createSelector(
  [getRecentLists, getRelatedLists],
  (recentLists, relatedLists) => {
    if (!relatedLists) {
      return null
    }
    if (relatedLists.length) {
      return {
        type: 'Related',
        lists: relatedLists,
      }
    }
    if (!recentLists) {
      return null
    }
    return {
      type: 'Recent',
      lists: recentLists,
    }
  }
)

const getList = ({ listByID }, { match }) => {
  const list = listByID[match.params.listID]
  return (
    list && !list.isFetching
      ? list.list
      : null
  )
}

const getURL = () => location.href

export const getListShareLinks = createSelector(
  [getList, getURL],
  (list, url) => {
    if (list) {
      return {
        twitter: `https://twitter.com/intent/tweet?text="${list.subject}"%20by%20${list.listedBy}%20on%20FilmList:&url=${url}`,
        facebook: `http://www.facebook.com/sharer.php?u=${encodeURIComponent(url)}`,
      }
    }
    return {
      twitter: '',
      facebook: '',
    }
  }
)

const getFilms = state => state.filmByID

const getFilmsInList = createSelector(
  [getList, getFilms],
  (list, films) => {
    if (!list) {
      return null
    }
    const filmsInList = {}
    list.films.forEach(({ imdbID }) => {
      const film = films[imdbID]
      if (film && !film.isFetching) {
        filmsInList[imdbID] = film.film
      }
    })
    return filmsInList
  }
)

export const getListWithFilmRatings = createSelector(
  [getList, getFilmsInList],
  (list, filmsInList) => {
    if (!list) {
      return null
    }
    const filmsWithRatings = list.films.map(film => {
      const filmDetail = filmsInList[film.imdbID]
      return (
        filmDetail
          ? {
            ...film,
            metascore: filmDetail.Metascore,
            imdbRating: filmDetail['IMDb Rating'],
            rottenTomatoes: filmDetail['Rotten Tomatoes'],
          }
          : {
            ...film,
            metascore: 'N/A',
            imdbRating: 'N/A',
            rottenTomatoes: 'N/A',
          }
      )
    })
    return {
      ...list,
      films: filmsWithRatings,
    }
  }
)
