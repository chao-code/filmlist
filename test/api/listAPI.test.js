import {
  createList,
  readList,
  updateList,
  deleteList,
  incrementViewCount,
  updatePoster,
  getPopularLists,
  getRecentLists,
  getRelatedLists,
} from '../../src/api/listAPI'

describe('list API', () => {
  let films
  let lists
  let timeStamps
  let listIDs

  beforeEach(() => {
    films = []
    for (let i = 0; i < 5; i++) {
      films[i] = {
        title: `film${i}`,
        year: `200${i}`,
        poster: `${i}.img`,
        imdbID: `tt${i}`,
        comment: '',
      }
    }

    lists = []
    timeStamps = []
    for (let i = 0; i < 5; i++) {
      timeStamps[i] = Date.now() - (i * 100000)
      lists[i] = {
        subject: `list${i}`,
        listedBy: `user${i}`,
        description: '',
        createdOn: timeStamps[i],
        passcode: '123',
        films: films.slice(i),
      }
    }

    const promises = []
    lists.forEach(list => {
      promises.push(createList(list))
    })

    listIDs = []
    return (
      Promise.all(promises)
      .then(IDs => {
        listIDs = IDs
      })
    )
  })

  afterEach(() => Promise.all(listIDs.map(listID => deleteList(listID))))

  it('should create and read a list', () => {
    const listPromise = readList(listIDs[0])

    return (
      expect(listPromise)
      .resolves
      .toEqual({
        subject: 'list0',
        listedBy: 'user0',
        description: '',
        createdOn: timeStamps[0],
        editedOn: undefined,
        passcode: '123',
        filmCount: 5,
        films,
      })
    )
  })

  it('should update a list', () => {
    const editedOn = Date.now()
    const updatedList = {
      editedOn,
      subject: 'list',
      listedBy: 'user',
      passcode: '123',
      description: 'description',
      films: films.slice(2),
      removedFilms: { tt1: true },
    }
    const listPromise = updateList(listIDs[1], updatedList)

    return (
      expect(listPromise)
      .resolves
      .toEqual({
        subject: 'list',
        listedBy: 'user',
        editedOn,
        createdOn: timeStamps[1],
        passcode: '123',
        description: 'description',
        films: films.slice(2),
        filmCount: 3,
      })
    )
  })

  it('should delete a list', () => {
    const listPromise = deleteList(listIDs[0]).then(() => readList(listIDs[0]))

    return (
      expect(listPromise)
      .resolves
      .toBeNull()
    )
  })

  it('should increment view count of a list', () => {
    const promise = (
      incrementViewCount(listIDs[2])
      .then(res => res.snapshot.val())
    )

    return (
      expect(promise)
      .resolves
      .toBe(1)
    )
  })

  it('should update the poster of a film', () => {
    const imdbID = 'tt3'
    const poster = '4.img'
    films[3].poster = poster

    const listPromise = (
      updatePoster(imdbID, poster)
      .then(() => Promise.all([readList(listIDs[3]), readList(listIDs[2])]))
    )

    return (
      expect(listPromise)
      .resolves
      .toEqual([
        {
          subject: 'list3',
          listedBy: 'user3',
          description: '',
          createdOn: timeStamps[3],
          editedOn: undefined,
          passcode: '123',
          films: films.slice(3),
          filmCount: 2,
        },
        {
          subject: 'list2',
          listedBy: 'user2',
          description: '',
          createdOn: timeStamps[2],
          editedOn: undefined,
          passcode: '123',
          films: films.slice(2),
          filmCount: 3,
        },
      ])
    )
  })

  it('should get popular lists', () => {
    const listsPromise = (
      incrementViewCount(listIDs[3])
      .then(() => incrementViewCount(listIDs[2]))
      .then(() => incrementViewCount(listIDs[3]))
      .then(() => getPopularLists(2))
    )

    return (
      expect(listsPromise)
      .resolves
      .toEqual([
        {
          subject: 'list3',
          filmCount: 2,
          listedBy: 'user3',
          description: '',
          posters: ['3.img', '4.img'],
          listID: listIDs[3],
        },
        {
          subject: 'list2',
          filmCount: 3,
          listedBy: 'user2',
          description: '',
          posters: ['2.img', '3.img', '4.img'],
          listID: listIDs[2],
        },
      ])
    )
  })

  it('should get recent lists', () => {
    const listsPromise = getRecentLists(2)

    return (
      expect(listsPromise)
      .resolves
      .toEqual([
        {
          subject: 'list0',
          filmCount: 5,
          listedBy: 'user0',
          description: '',
          posters: ['0.img', '1.img', '2.img', '3.img', '4.img'],
          listID: listIDs[0],
        },
        {
          subject: 'list1',
          filmCount: 4,
          listedBy: 'user1',
          description: '',
          posters: ['1.img', '2.img', '3.img', '4.img'],
          listID: listIDs[1],
        },
      ])
    )
  })

  it('should get related lists of a film', () => {
    const listsPromise = getRelatedLists(films[2].imdbID, 5)

    return (
      expect(listsPromise)
      .resolves
      .toEqual([
        {
          subject: 'list2',
          filmCount: 3,
          listedBy: 'user2',
          description: '',
          posters: ['2.img', '3.img', '4.img'],
          listID: listIDs[2],
        },
        {
          subject: 'list1',
          filmCount: 4,
          listedBy: 'user1',
          description: '',
          posters: ['1.img', '2.img', '3.img', '4.img'],
          listID: listIDs[1],
        },
        {
          subject: 'list0',
          filmCount: 5,
          listedBy: 'user0',
          description: '',
          posters: ['0.img', '1.img', '2.img', '3.img', '4.img'],
          listID: listIDs[0],
        },
      ])
    )
  })
})
