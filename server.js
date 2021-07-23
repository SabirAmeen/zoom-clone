const express = require('express');
var cors = require('cors')
const app = express();
const { ExpressPeerServer } = require('peer');
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

app.get('/getPort', (req, res) => {
    res.status(200).send({ port: process.env.PORT || 8085 });
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

server.listen(process.env.PORT || 8085);

const peerServer = ExpressPeerServer(server, {
    path: '/myapp'
  });
  
app.use('/peerjs', peerServer);