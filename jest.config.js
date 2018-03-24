module.exports = {
  setupFiles: ['./test/setup.js'],
  moduleNameMapper: {
    '\\.css$': '<rootDir>/test/mocks/cssMock.js'
  },
  snapshotSerializers: ['enzyme-to-json/serializer'],
}
