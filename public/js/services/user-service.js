const STORAGE_KEY_LOGGEDIN_USER = 'loggedInUser'
const BASE_URL = '/api/auth/'

export const userService = {
    remove,
    query,
    login,
    signup,
    getLoggedInUser,
    logout,
}

function query(){
    return axios.get('/api/users')
            .then(({data})=> data)
}

function getLoggedInUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function remove(userId){
    return axios.delete('/api/users/:' + userId)
}


function login({ username, password }) {
    return axios.post(BASE_URL + 'login', { username, password })
        .then(({ data: user }) => _setLoggedinUser(user))
}

function signup({ fullname, username, password }) {
    const newUser = { fullname, username, password }
    return axios.post(BASE_URL + 'signup', newUser)
        .then(({ data: user }) => _setLoggedinUser(user))
}

function logout() {
    axios.post(BASE_URL + 'logout')
        .then(() => sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER))

}

function _setLoggedinUser(user) {
    const userToSave = { _id: user._id, fullname: user.fullname , isAdmin: user.isAdmin }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(userToSave))
    return userToSave
}

signup({ fullname: 'Kuki Ra', username: 'kuku', password: '1234' })
signup({ fullname: 'Mimi Na', username: 'mimuna', password: '1234' })
signup({ fullname: 'Bubi Ba', username: 'bubu', password: '1234' })