const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

let port = 5000 || process.env.PORT;
let users = [];
let connections = [];

app.use(express.static('public'));

io.on('connect',function(socket){
    connections.push(socket);
    console.log(`Connected : ${connections.length} students are present.`);

    socket.on('disconnect',function(data){
        users.splice(users.indexOf(socket.username),1)
        updateUsernames();
        connections.splice(connections.indexOf(socket),1);
        console.log(`Disconnected : ${connections.length} students present now`)
    })

    socket.on('send message',function(data){
        io.sockets.emit('new message',{msg : data, user : socket.username});
    })

    socket.on('new user',function(data ,callback){
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    })

    function updateUsernames(){
        io.sockets.emit('get users',users);
    }
})

http.listen( port ,function()
{
    console.log(`Server is running ${port}!!`)
})