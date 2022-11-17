const fs = require('fs')
const gBugs = require('../data/bugs.json')
const defaultBugs = require('../data/default-bugs.json')

module.exports = {
    query,
    getById,
    remove,
    save
}

const itemsPerPage = 2


function query(filterBy) {
    const regex = new RegExp(filterBy.title, 'i')
    let filteredBugs = gBugs.filter(bug => regex.test(bug.title))
    if (filterBy.creatorId) filteredBugs = filteredBugs.filter(bug => bug.creator._id === filterBy.creatorId)
    else {
        const startIdx = filterBy.page * itemsPerPage
        filteredBugs = filteredBugs.slice(startIdx, startIdx + itemsPerPage)
    }
    const totalPageCount = Math.ceil(gBugs.length / itemsPerPage)
    return Promise.resolve({ filteredBugs, totalPageCount })
}

function getById(bugId) {
    const bug = gBugs.find(bug => bug._id === bugId)
    return Promise.resolve(bug)
}

function remove(bugId, credentials) {
    const bugIdx = gBugs.findIndex(bug => bug._id === bugId)
    console.log(gBugs[bugIdx]);
    if (gBugs[bugIdx].creator._id !== credentials._id && !credentials.isAdmin) return Promise.reject('Not authorized')
    gBugs.splice(bugIdx, 1)
    return gBugs.length ? _saveBugsToFile() : _createDefaultBugs()
}

function save(bug, credentials) {
    if (bug._id) {
        const bugIdx = gBugs.findIndex(currBug => currBug._id === bug._id)
        if (gBugs[bugIdx].creator._id !== credentials._id && !credentials.isAdmin) return Promise.reject('Not authorized')
        gBugs[bugIdx].description = bug.description
        gBugs[bugIdx].severity = bug.severity
    } else {
        bug.createdAt = Date.now() + ''
        bug._id = _makeId()
        bug.creator = { ...credentials }
        gBugs.unshift(bug)
    }
    return _saveBugsToFile()
        .then(() => bug)
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(gBugs, null, 2)

        fs.writeFile('data/bugs.json', data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}

function _createDefaultBugs() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(defaultBugs, null, 2)

        fs.writeFile('data/bugs.json', data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}

function _makeId(length = 5) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}