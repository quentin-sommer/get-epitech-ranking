const fs = require('fs')
const axios = require('axios')

const searchParams = {
  format: 'json',
  location: 'FR/BDX|FR/LIL|FR/LYN|FR/MAR|FR/MPL|FR/NCY|FR/NAN|FR/NCE|FR/PAR|FR/REN|FR/STG|FR/TLS',
  year: 2016,
  course: 'bachelor/classic|bachelor/tek2ed',
  active: true,
  promo: 'tek3',
  offset: 0,
}
const axiosOpt = {
  headers: {
    'Cookie': `auth=${fs.readFileSync('./authcookie.txt').toString().trim()}`
  }
}

const getTek4Score = (gpa, tepitech) => {
  const gpaModifier = (((gpa * 100) / 4) * 0.5)
  const tepitechModifier = (((tepitech * 100) / 990) * 0.15)
  return Math.round((gpaModifier + tepitechModifier) * 100) / 100
}

const processTek4Score = students => {
  students.forEach(student => {
    student.tek4Score = getTek4Score(student.gpa, student.highest_tepitech)
  })
  return Promise.resolve(students)
}

const getModulesGrades = students => {
  console.log('Fetching modules info...')
  const promises = students.map(student => {
    return axios.get(`https://intra.epitech.eu/user/${student.login}/notes?format=json`, axiosOpt)
      .then(res => res.data)
      .catch(err => console.log(err))
  })
  return Promise.all(promises).then(promises => {
    console.log('Fetched modules info')
    for (let i = 0; i < students.length; i++) {
      const grades = promises[i].notes
      if (grades !== undefined) {
        let max = -1
        let tmp = -1
        grades.forEach(grade => {
          if (grade.titlemodule.includes('TEPitech')
            && grade.scolaryear === searchParams.year
            && !grade.title.includes('Self-assessment')) {
            tmp = grade.final_note
            if (tmp > max) {
              max = tmp
            }
          }
        })
        students[i].highest_tepitech = max
      } else {
        students[i].highest_tepitech = -1
      }
    }
    return students
  })
}

const getProfiles = basicProfiles => {
  console.log('Fetching students profiles...')
  const promises = basicProfiles.map(student => {
      return axios.get(`https://intra.epitech.eu/user/${student.login}?format=json`, axiosOpt)
        .then(res => res.data)
        .catch(err => console.log(err))
    }
  )

  return Promise.all(promises).then(profiles => {
    console.log('Fetched students profiles')
    return profiles.map(profile => {
      const ret = profile
      ret.gpa = parseFloat(profile.gpa[0].gpa)
      return ret
    })
  })
}

const getStudents = ({total, pageSize}) => {
  console.log(`Fetching ${total} students...`)
  let offset = 0
  const promises = []
  while (offset < total) {
    const params = Object.assign({}, searchParams)
    params.offset = offset
    offset += pageSize
    promises.push(
      axios.get('https://intra.epitech.eu/user/filter/user', {
        params: params
      }).then(response => response.data.items)
    )
  }
  return Promise.all(promises).then(promises => {
    console.log('Fetched students')
    let items = []
    promises.forEach(res => items.push(...res))
    return items
  })
}

const fetch = () => {
  console.log('Starting')
  if (fs.existsSync('./res.json')) {
    console.log('Using local res.json')
    return Promise.resolve(JSON.parse(fs.readFileSync('./res.json', 'utf8')))
  }

  return axios.get('https://intra.epitech.eu/user/filter/user', {
    params: searchParams
  })
    .then(response => {
      const total = response.data.total
      const pageSize = response.data.items.length
      return {total, pageSize}
    })
    .then(getStudents)
    .then(getProfiles)
    .then(getModulesGrades)
    .then(processTek4Score)
    .then(students => {
      fs.writeFileSync('./res.json', JSON.stringify(students), {encoding: 'utf8'})
      console.log('Wrote fetched data to res.json for faster processing')
      return students
    })
    .catch(error => console.log(error))
}

exports.fetch = fetch
