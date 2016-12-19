const fetchData = require('./fetchData')
const cloneDeep = require('lodash/cloneDeep')
require('console.table')

const sortByGpaDesc = (a, b) => {
  const gpaA = a.gpa
  const gpaB = b.gpa
  if (gpaB > gpaA) {
    return 1
  } else if (gpaA === gpaB) {
    return 0
  }
  return -1
}

const sortByTepitechDesc = (a, b) => {
  const tepA = a.highest_tepitech
  const tepB = b.highest_tepitech
  if (tepB > tepA) {
    return 1
  } else if (tepA === tepB) {
    return 0
  }
  return -1
}

const getIdxOfStudent = (student, array) => {
  const len = array.length
  for (let i = 0; i < len; i++) {
    if (array[i].login === student) {
      return i
    }
  }
  return -1
}

const getTepitechRank = (student, array) => getIdxOfStudent(student, array) + 1
const getGpaRank = (student, array) => getIdxOfStudent(student, array) + 1

const processStudent = data => {
  const orderedByTepitechArr = cloneDeep(data).sort(sortByTepitechDesc)
  const orderedByGpaArr = cloneDeep(data).sort(sortByGpaDesc)

  console.log('TOTAL STUDENTS', data.length)

  /* processing data for display.
   * Here you can shape the data before displaying it. Eg :
   * Filter by cities (cities list available in fetchData.js defaultParams)
   * Sort by anything, using one of the given sort functions for example (sortByGpaDesc...)
   * Edit map to output more data to the table
   */
  const formated = data
    .filter(student => student.location === 'FR/STG')
    .sort(sortByGpaDesc)
    .map(student => ({
        login: student.login,
        gpa: student.gpa,
        tepitech: student.highest_tepitech,
        city: student.location,
        gpaRank: getGpaRank(student.login, orderedByGpaArr),
        tepitechRank: getTepitechRank(student.login, orderedByTepitechArr),
      })
    )
  console.table(formated)
}

fetchData.fetch()
  .then(students => processStudent(students))
