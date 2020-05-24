const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const Datastore = require('nedb')
const PORT = 3000

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(express.static('static'))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/static/index.html'))
})

app.get('/game', function (req, res) {
  res.sendFile(path.join(__dirname, '/static/game.html'))
})

app.get('/hex', function (req, res) {
  res.sendFile(path.join(__dirname, '/static/hex.html'))
})

app.get('/player', function (req, res) {
  res.sendFile(path.join(__dirname, '/static/player.html'))
})

app.get('/ally', function (req, res) {
  res.sendFile(path.join(__dirname, '/static/ally.html'))
})

const collection = new Datastore({
  filename: 'level.db',
  autoload: true,
})

app.post('/level', (req, res) => {
  collection.remove({}, { multi: true })
  collection.insert(req.body)
  res.end()
})

app.get('/level', async (req, res) => {
  collection.find({}, (error, data) => {
    if (error) res.status(500).end()
    const response = data[0]
    delete response._id
    res.json(data[0])
  })
})

app.get('/renderMap', function (req, res) {
  collection.find({}, (error, data) => {
    if (error) res.status(500).end()
    const response = data[0]
    delete response._id
    res.json(data[0])
  })
})

app.listen(PORT, function () {
  console.log('start serwera na porcie ' + PORT)
})
