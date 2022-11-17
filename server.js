const express = require('express')
const cookieParser = require('cookie-parser')

const pdfService = require('./services/pdfService')
const bugService = require('./services/bug.service')
const userService = require('./services/user.service')

const app = express()

if (process.env.NODE_ENV === 'production') logger.setLevel('ERROR')

const PORT = process.env.PORT || 3030

// Express Config:
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

// Express Routing:
app.get('/api/bug/download', (req, res) => {
    bugService.query()
        .then(bugs => res.send(pdfService.buildBugsPdf(bugs)))
})

app.get('/api/bug', (req, res) => {
    const { title, page, creatorId } = req.query
    const filterBy = {
        title: title || '',
        page: page || 0,
        creatorId: creatorId || null,
    }
    bugService.query(filterBy)
        .then(({ filteredBugs, totalPageCount }) => res.send({ filteredBugs, totalPageCount }))
})

app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    var visitedBugs = JSON.parse(req.cookies.visitedBugs || '[]')
    if (!visitedBugs.find(id => id === bugId)) {
        if (visitedBugs.length === 3) return res.status(401).send('Wait for a bit')
        visitedBugs.push(bugId)
        res.cookie('visitedBugs', JSON.stringify(visitedBugs), { maxAge: 7 * 1000 })
    } else {

    }
    bugService.getById(bugId)
        .then(bug => res.send(bug))
})

app.post('/api/bug/', (req, res) => {
    const { title, severity, description } = req.body

    const bug = { title, severity, description }
    const credentials = userService.validateToken(req.cookies.loginToken)
    bugService.save(bug, credentials)
        .then(bug => res.send(bug))
})

app.put('/api/bug/:bugId', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot delete car')
    const { _id, title, severity, description, createdAt } = req.body
    const bug = { _id, title, severity, description, createdAt }
    bugService.save(bug, loggedinUser)
        .then(bug => res.send(bug))
        .catch(err => res.status(401).send('Not your bug...'))
})

app.delete('/api/bug/:bugId', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot delete bug')
    const { bugId } = req.params
    bugService.remove(bugId, loggedinUser)
        .then(() => res.send('Removed bug'))
        .catch(err => res.status(401).send('Not your bug...'))
})

// USERS API

app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body
    const user = { username, password }
    userService.login(user)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(401).send('Invalid login')
            }
        })
        .catch(err => res.status(401).send('Invalid Login'))
})

app.post('/api/auth/signup', (req, res) => {
    const { fullname, username, password } = req.body
    const user = { fullname, username, password }
    userService.save(user)
        .then(user => {
            res.send(user)
        })
        .catch(err => console.log(err))
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('logged out')
})

app.get('/api/users', (req, res) => {
    userService.query()
        .then(users => res.send(users))
})

app.delete('/api/users/:userId', (req, res) => {
    const { userId } = req.params
    userService.remove(userId)
        .then(() => res.send('okay'))
})

app.listen(PORT, () => console.log(`Server listening on port ${PORT}!`))