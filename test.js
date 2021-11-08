
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// let socket;
//  let url = "https://chatsocketserver20211.herokuapp.com";

 var i="test"
//  var socket= io();
myFunction()
 function  myFunction(){
  //  var url = "http://172.16.1.160:3004"

     for(var i=0;  i<2000;   i++){
     console.log(`i`,{i })
   var  socket= io( "?id="+i+"&name="+i+"&image="+i+"")

  //    setTimeout(function () {
  // }, 3000);

   
      }

}
        
server.listen(process.env.PORT || 3005)