const gUsers = require('../data/user.json')

const fs = require('fs')
const Cryptr = require('cryptr')
const cryptr = new Cryptr('secret-puk-1234')

module.exports = {
    query,
    login,
    save,
    remove,
    getLoginToken,
    validateToken
}

function query(){
    return Promise.resolve(gUsers)
}

function remove(userId){
    const userIdx = gUsers.findIndex(user => user._id === userId)
    gUsers.splice(userIdx, 1)
    return _saveUsersToFile() 
}

function login({ username, password }) {
    const user = gUsers.find(user => user.username === username)
    console.log(user);
    if (user && user.password === password) return Promise.resolve({ _id: user._id, fullname: user.fullname, isAdmin: JSON.parse(user.isAdmin || false) })
    return Promise.reject('Invalid login')
}

function save(user) {
    if (user._id) {
        const idx = gUsers.findIndex((currUser) => currUser._id === user._id)
        gUsers[idx] = user
    } else {
        const existingUser = gUsers.find(currUser => currUser.username === user.username)
        if (existingUser) return Promise.reject('User already exists')
        user._id = _makeId()
        gUsers.unshift(user)
    }
    return _saveUsersToFile().then(() => ({ _id: user._id, fullname: user.fullname }))
}

function getLoginToken(user) {
    return cryptr.encrypt(JSON.stringify(user))
}

function validateToken(loginToken) {
    try {
        const json = cryptr.decrypt(loginToken)
        const loggedinUser = JSON.parse(json)
        return loggedinUser
    } catch (err) {
        console.log('Invalid login token')
    }
    return null
}

function _makeId(length = 5) {
    var txt = ''
    var possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}
function _saveUsersToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(gUsers, null, 2)

        fs.writeFile('data/user.json', data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}