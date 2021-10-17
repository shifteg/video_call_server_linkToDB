//requires express module

const express = require('express');
const app = express();
//requires  httpmodule

const http = require('http')
// var PORT = process.env.PORT || 3001;
// create server

const server = http.createServer(app);
const io = require('socket.io')(server);
//show static files in 'public' directory

const fs = require('fs');

//tells to host server on localhost:3000
app.set('views', 'Views');

app.use(express.static('Views'));
//Playing variables:
app.use(express.static('public'));
console.log('Server is running');
const dns = require('dns');
const publicIp = require('public-ip');

// (async () => {
// 	console.log(await publicIp.v4());
// 	//=> '46.5.21.123'

// 	console.log(await publicIp.v6());
// 	//=> 'fe80::200:f8ff:fe21:67cf'
// })();

dns.lookup('www.google.com',
    (err, addresses, family) => {

        // Print the address found of user
        console.log('addresses:', addresses);

        // Print the family found of user  
        console.log('family:', family);
    });


app.get('/', (req, res) => {
    return res.render('index.html')
})

var dict = {};

// var myMap = new Map();

var ip = require("ip");
console.dir("server id ip for test : " + ip.address());
console.dir("server id ip for test : " + ip.PORT);
console.dir("server id ip for test : " + ip.env);
// app.listen(3000)
//Socket.io Connection------------------
io.on('connection', socket => {

    console.log("Newsocketconnection : " + socket.id)
    console.log("Newsocketconnection : " + socket.data)
    var dataid = socket.handshake.query.data; // => "value"
    console.log("Newsocketconnection data : " + dataid)
    // console.log("New socket connection: " + socket)
    // socket.emit('your-socket',{"id":socket.id})
    dict[dataid] = socket.id;
    // io.sockets.emit('connection', { "myId": socket.id })
    io.to(socket.id).emit('connection', { "myId": socket.id })
    console.log("Newsocketconnection Object.keys(obj) " + Object.keys(dict))
    console.log(dict)
    console.log("  id  " + socket.id)

    socket.on('send-message', function (message) {

        console.log(message)

        let val = dict[message.friendId];
        console.log("send-message friend ID : " + val)
        console.log("send-message message friendId : " + message.friendId)
        console.log("send-message message meId : " + message.meId)
        console.log("send-message message : " + message.message)
        console.log(message)

        io.to(val).emit('send-message', { "message": message.meId, "username": message.callername })

    })

    socket.on('accept-call', function (call) {

        console.log(call)
        let val = dict[call.callID];
        console.log("friend ID : " + val)
        console.log("call messagefromcallerId : " + call.callID)
        console.log("call states : " + call.states)
        console.log("accept-call meId : " + call.meId)
        // console.log(  "call"+ call.message)


        io.to(val).emit('accept-call', { "states": call.states, "answerid": call.meId })

    })

    socket.on('cancel-call', function (cancel) {

        console.log(cancel)
        let val = dict[cancel.callID];
        console.log("cancel-call friend ID : " + val)
        console.log("cancel-call call messagefromcallerId : " + cancel.callID)
        console.log("cancel-call call states : " + cancel.states)
        // console.log(  "call"+ call.message)
        io.to(val).emit('cancel-call', { "states": cancel.states, "answerid": cancel.callID })

    })

    socket.on('reject-call', function (reject) {
       console.log(reject)
       let val = dict[reject.callID];

        console.log("reject-callfriend ID : " + val)
        console.log("reject-call call messagefromcallerId : " + reject.callID)
        console.log("reject-call call states : " + reject.states)
        // console.log(  "call"+ call.message)
        io.to(val).emit('reject-call', { "states": reject.states , "answerid": reject.callID})
    })


    socket.on('end-call', function (end) {

        console.log(end)
        let val = dict[end.callID];
        console.log("end-call friend ID : " + val)
        console.log("end-call call messagefromcallerId : " + end.callID)
        console.log("end-call call states : " + end.states)
        // console.log(  "call"+ call.message)
        io.to(val).emit('end-call', { "states": end.states, "answerid": end.callID })

    })

})

//listen to port 3000 on pc
// server.listen(3002)
server.listen(process.env.PORT || 3004)

