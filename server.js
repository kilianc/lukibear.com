/*!
 * server.js
 * Created by Kilian Ciuffolo on Oct 8, 2015
 * (c) 2015 lukibear http://lukibear.com
 */

'use strict'

const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const serve = require('express').static

app.use(serve(__dirname + '/dist'))

io.on('connection', function (socket) {
  socket.on('move', function (data) {
    data.id = socket.id
    socket.broadcast.volatile.emit('guest:move', data)
  })
  socket.on('disconnect', function () {
    socket.broadcast.emit('guest:disconnect', socket.id)
  })
})

server.listen(8080)

/*!
 * Quit if SIGINT
 */
process.on('SIGINT', function() {
  console.log('> caught interrupt signal')
  process.exit()
})
