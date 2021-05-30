var app = require('express')();

var http = require('http').Server(app);
var io = require('socket.io')(http, {
    cors: {
        origin: '*',
    }
});

const users = {};

app.get('/', (req, res) => {
    res.send('server is running');
});

io.on('connection', (client) => {
    client.on('join', function(name){
        console.log('Joined: ' + name);
        users[client.id] = { id: client.id, name };
        client.broadcast.emit('update', client.id)
      });

    client.on('send', blob => {
        console.log(blob);
        client.broadcast.emit('blob', { id: client.id, blob });
    });
});

http.listen(3000, () => console.log('listening on port 3000'));