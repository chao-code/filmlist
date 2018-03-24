import * as firebase from 'firebase/app'
import 'firebase/database'

const prodConfig = {
  apiKey: 'AIzaSyBfwfEXqRd__lhAeDhM83-D3Z-lL_eCSiQ',
  authDomain: 'cinelist-2612d.firebaseapp.com',
  databaseURL: 'https://cinelist-2612d.firebaseio.com',
  projectId: 'cinelist-2612d',
  storageBucket: 'cinelist-2612d.appspot.com',
  messagingSenderId: '574208852611',
}
const devConfig = {
  apiKey: 'AIzaSyCh0LphfDDtGfGT9k9WfDq2VC-jo2-Gtb8',
  authDomain: 'test-datebase-43b05.firebaseapp.com',
  databaseURL: 'https://test-datebase-43b05.firebaseio.com',
  projectId: 'test-datebase-43b05',
  storageBucket: 'test-datebase-43b05.appspot.com',
  messagingSenderId: '395662642236',
}
const config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig
const app = firebase.initializeApp(config)

const root = firebase.database(app).ref()
const listInfosRef = root.child('list_infos')
const listFilmsRef = root.child('list_films')
const listsByFilmRef = root.child('lists_by_film')

export function createList(list) {
  const infos = {
    subject: list.subject,
    listedBy: list.listedBy,
    description: list.description || '',
    passcode: list.passcode || '',
    createdOn: list.createdOn || Date.now(),
    viewCount: 0,
    filmCount: list.films.length,
    posters: {},
  }
  const films = {}
  const imdbIDs = []

  list.films.forEach((film, index) => {
    if (index < 5) {
      infos.posters[film.imdbID] = {
        index,
        poster: film.poster,
      }
    }
    films[film.imdbID] = {
      index,
      title: film.title,
      year: film.year,
      poster: film.poster,
      comment: film.comment || '',
      imdbID: film.imdbID,
    }
    imdbIDs[index] = film.imdbID
  })

  const listID = listInfosRef.push().key

  return (
    Promise.all([
      listInfosRef.child(listID).set(infos),
      listFilmsRef.child(listID).set(films),
      addListsByFilms(listID, imdbIDs),
    ])
    .then(() => listID)
  )
}

function addListsByFilms(listID, imdbIDs) {
  const promises = []

  imdbIDs.forEach((imdbID, index) => {
    promises.push(listsByFilmRef.child(`${imdbID}/${listID}`).set(index))
  })

  return Promise.all(promises)
}

function removeListsByFilms(listID, films) {
  const promises = []

  Object.keys(films).forEach(imdbID => {
    if (films[imdbID]) {
      promises.push(listsByFilmRef.child(`${imdbID}/${listID}`).remove())
    }
  })

  return Promise.all(promises)
}

export function readList(listID) {
  return (
    Promise.all([
      listInfosRef.child(listID).once('value'),
      listFilmsRef.child(listID).once('value'),
    ])
    .then(([infosSnapshot, filmsSnapshot]) => {
      if (!infosSnapshot.exists() || !filmsSnapshot.exists()) {
        return null
      }

      const infos = infosSnapshot.val()
      const list = {
        subject: infos.subject,
        listedBy: infos.listedBy,
        description: infos.description,
        passcode: infos.passcode,
        createdOn: infos.createdOn,
        editedOn: infos.editedOn,
        filmCount: infos.filmCount,
        films: [],
      }

      filmsSnapshot.forEach(filmSnapshot => {
        const film = filmSnapshot.val()
        list.films[film.index] = {
          title: film.title,
          year: film.year,
          poster: film.poster,
          comment: film.comment,
          imdbID: film.imdbID,
        }
      })

      return list
    })
  )
}

export function updateList(listID, edits) {
  const infos = {
    subject: edits.subject,
    listedBy: edits.listedBy,
    description: edits.description || '',
    passcode: edits.passcode || '',
    editedOn: edits.editedOn || Date.now(),
    filmCount: edits.films.length,
    posters: {},
  }
  const films = {}
  const imdbIDs = []

  edits.films.forEach((film, index) => {
    if (index < 5) {
      infos.posters[film.imdbID] = {
        index,
        poster: film.poster,
      }
    }
    films[film.imdbID] = {
      index,
      title: film.title,
      year: film.year,
      poster: film.poster,
      comment: film.comment || '',
      imdbID: film.imdbID,
    }
    imdbIDs[index] = film.imdbID
  })

  return (
    Promise.all([
      listInfosRef.child(listID).update(infos),
      listFilmsRef.child(listID).set(films),
      removeListsByFilms(listID, edits.removedFilms),
      addListsByFilms(listID, imdbIDs),
    ])
    .then(() => readList(listID))
  )
}

export function deleteList(listID) {
  return (
    listFilmsRef.child(listID).once('value')
    .then(filmsSnapshot => {
      const promises = []

      filmsSnapshot.forEach(filmSnapshot => {
        const imdbID = filmSnapshot.key
        promises.push(listsByFilmRef.child(`${imdbID}/${listID}`).remove())
      })

      return (
        Promise.all([
          ...promises,
          listInfosRef.child(listID).remove(),
          listFilmsRef.child(listID).remove(),
        ])
      )
    })
  )
}

export function incrementViewCount(listID) {
  return (
    listInfosRef
    .child(`${listID}/viewCount`)
    .transaction(count => count + 1)
  )
}

export function updatePoster(imdbID, poster) {
  return (
    listsByFilmRef
    .child(imdbID)
    .once('value')
    .then(snapshots => {
      const promises = []
      snapshots.forEach(snapshot => {
        const listID = snapshot.key
        const indexInList = snapshot.val()
        if (indexInList < 5) {
          promises.push(listInfosRef.child(`${listID}/posters/${imdbID}/poster`).set(poster))
        }
        promises.push(listFilmsRef.child(`${listID}/${imdbID}/poster`).set(poster))
      })

      return Promise.all(promises)
    })
  )
}

function toListBrief(listInfo) {
  const list = {
    subject: listInfo.subject,
    filmCount: listInfo.filmCount,
    listedBy: listInfo.listedBy,
    description: listInfo.description,
    posters: [],
  }
  Object.keys(listInfo.posters).forEach(imdbID => {
    const film = listInfo.posters[imdbID]
    list.posters[film.index] = film.poster
  })
  return list
}

export function getPopularLists(num = 4) {
  return (
    listInfosRef
    .orderByChild('viewCount')
    .limitToLast(num)
    .once('value')
    .then(snapshots => {
      const lists = []
      snapshots.forEach(snapshot => {
        const listInfo = snapshot.val()
        const list = toListBrief(listInfo)
        list.listID = snapshot.key
        lists.unshift(list)
      })
      return lists
    })
  )
}

export function getRecentLists(num = 4) {
  return (
    listInfosRef
    .orderByChild('createdOn')
    .limitToLast(num)
    .once('value')
    .then(snapshots => {
      const lists = []
      snapshots.forEach(snapshot => {
        const listInfo = snapshot.val()
        const list = toListBrief(listInfo)
        list.listID = snapshot.key
        lists.unshift(list)
      })
      return lists
    })
  )
}

export function getRelatedLists(imdbID, num = 4) {
  return (
    listsByFilmRef
    .child(imdbID)
    .orderByKey()
    .limitToLast(num)
    .once('value')
    .then(snapshots => {
      const promises = []
      snapshots.forEach(snapshot => {
        const listID = snapshot.key
        promises.push(listInfosRef.child(listID).once('value'))
      })

      return (
        Promise.all(promises)
        .then(listsSnapshots => {
          const lists = []
          listsSnapshots.forEach(snapshot => {
            const listInfo = snapshot.val()
            const list = toListBrief(listInfo)
            list.listID = snapshot.key
            lists.unshift(list)
          })
          return lists
        })
      )
    })
  )
}
