const express = require('express');
var cors = require('cors')
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});

app.use(cors());
app.use(express.static(__dirname + '/dist'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/dist/index.html')
})

app.get('/:room', (req, res) => {
    res.sendFile(__dirname + '/dist/index.html')
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-connected', userId);
        socket.on('disconnect', () => {
            socket.broadcast.to(roomId).emit('user-disconnect', userId);
        })
    })
})


server.listen(8085);