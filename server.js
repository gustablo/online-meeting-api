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
    client.on('join', function (name) {
        users[client.id] = { id: client.id, name };

        io.to(client.id).emit('joined', client.id);
        client.broadcast.emit('update', { id: client.id, users });
    });

    client.on('send', blob => {
        client.broadcast.emit('blob', { id: client.id, blob });
    });

    client.on('disconnect', _ => {
        delete users[client.id];

        client.broadcast.emit('update', { id: client.id, users });

        client.broadcast.emit('user_disconnected', client.id);
    });
});

http.listen(process.env.PORT || 3000, () => console.log('listening on port 3000'));