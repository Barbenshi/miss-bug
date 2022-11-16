const BASE_URL = `/api/bug/`

export const bugService = {
  query,
  getById,
  getEmptyBug,
  save,
  remove,
  downloadBugs
}

function query(filterBy) {
  return axios.get(BASE_URL, { params: filterBy }).then(({ data }) => data)
}

function getById(bugId) {
  return axios.get(BASE_URL + bugId).then(({ data }) => data)
}

function getEmptyBug() {
  return {
    title: '',
    severity: '',
    description: '',
  }
}

function remove(bugId) {
  return axios.delete(BASE_URL + bugId)
}

function save(bug) {
  return bug._id ? axios.put(BASE_URL + bug._id, bug)
    : axios.post(BASE_URL, bug)
}

function downloadBugs() {
  return axios.get(BASE_URL + 'download').then(console.log)
}
