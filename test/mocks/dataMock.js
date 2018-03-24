export const mockPopularFilms = [
  {
    title: 'Movie 1',
    year: '2000',
    imdbRating: '6.0',
    imdbID: 'tt1111111',
    poster: 'img1.jpg',
  },
  {
    title: 'Movie 2',
    year: '2001',
    imdbRating: '7.0',
    imdbID: 'tt2222222',
    poster: 'img2.jpg',
  },
  {
    title: 'Movie 3',
    year: '2002',
    imdbRating: '8.0',
    imdbID: 'tt3333333',
    poster: 'img3.jpg',
  },
  {
    title: 'Movie 4',
    year: '2003',
    imdbRating: '9.0',
    imdbID: 'tt4444444',
    poster: 'img4.jpg',
  },
  {
    title: 'Movie 5',
    year: '2004',
    imdbRating: '10.0',
    imdbID: 'tt5555555',
    poster: 'img5.jpg',
  },
]

export const mockFilmDetail = {
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
}

export const mockFilmID = 'tt1234567'

export const mockSearchResults = [
  {
    title: 'Movie 1',
    year: '2000',
    poster: 'img1.jpg',
    imdbID: 'tt1111111',
  },
  {
    title: 'Movie 2',
    year: '2010',
    poster: 'img2.jpg',
    imdbID: 'tt2222222',
  },
  {
    title: 'Movie 3',
    year: '2012',
    poster: 'img3.jpg',
    imdbID: 'tt3333333',
  },
  {
    title: 'Movie 4',
    year: '2013',
    poster: 'img4.jpg',
    imdbID: 'tt4444444',
  },
]

export const mockQuery = 'some query'

const filmA = {
  title: 'Film A',
  year: '2000',
  poster: 'poster1.jpg',
  imdbID: 'tt0123456',
}

const filmB = {
  title: 'Film B',
  year: '2010',
  poster: 'poster2.jpg',
  imdbID: 'tt1234567',
  comment: '',
}

const filmC = {
  title: 'Film C',
  year: '2015',
  poster: 'poster3.jpg',
  imdbID: 'tt2345678',
  comment: 'no comment',
}

export const mockListID = '-KzSoHHDc8rkwuiJdv8P'

const createdOn = Date.now() - 100000
const editedOn = Date.now() - 1000

export const mockListDetail = {
  subject: 'subject',
  listedBy: 'listed by',
  createdOn,
  passcode: 'passcode',
  description: 'description',
  filmCount: 3,
  films: [filmA, filmB, filmC],
}

export const mockListEdits = {
  subject: 'subject',
  listedBy: 'listed by',
  passcode: 'passcode',
  description: 'description',
  films: [filmB, filmC, filmA],
}

export const mockEditedList = {
  subject: 'subject',
  listedBy: 'listed by',
  createdOn,
  editedOn,
  passcode: 'passcode',
  description: 'description',
  filmCount: 3,
  films: [filmB, filmC, filmA],
}

export const mockNewPoster = 'poster.jpg'

const filmBWithNewPoster = {
  title: 'Film B',
  year: '2010',
  poster: 'poster.jpg',
  imdbID: 'tt1234567',
  comment: '',
}

export const mockListWithNewPoster = {
  subject: 'subject',
  listedBy: 'listed by',
  createdOn,
  passcode: 'passcode',
  description: 'description',
  filmCount: 3,
  films: [filmA, filmBWithNewPoster, filmC],
}

const listA = {
  subject: 'List A',
  filmCount: 1,
  listedBy: 'user1',
  description: '',
  posters: ['1.jpg'],
  listID: '11111',
}

const listB = {
  subject: 'List B',
  filmCount: 3,
  listedBy: 'user2',
  description: '',
  posters: ['1.jpg', '2.jpg', '3.jpg'],
  listID: '22222',
}

const listC = {
  subject: 'List C',
  filmCount: 2,
  listedBy: 'user2',
  description: '',
  posters: ['3.jpg', '1.jpg'],
  listID: '33333',
}

export const mockPopularLists = [listA, listB, listC]

export const mockRecentLists = [listB, listC, listA]

export const mockRelatedLists = [listC, listA, listB]
