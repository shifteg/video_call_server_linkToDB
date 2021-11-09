//requires express module

const express = require('express');
const app = express();
//requires  httpmodule

const http = require('http')
const businesspool = require('./businessPool')

// var PORT = process.env.PORT || 3001;
// create server

const server = http.createServer(app);
// const io = require('socket.io')(server);
const io = require('socket.io')(server, { origins: '*:*'});
//show static files in 'public' directory

const fs = require('fs');

//tells to host server on localhost:3000
app.set('views', 'Views');

app.use(express.static('Views'));


//Playing variables:
app.use(express.static('public'));
// app.use(express.bodyParser());

console.log('Server is running');
const dns = require('dns');
const publicIp = require('public-ip');

var mysql = require('mysql');
// var connectionDB = mysql.createConnection({
//     host: 'sql11.freemysqlhosting.net',
//     user: 'sql11448702',
//     password: 'vl4aMukt9T',
//     database: 'sql11448702'

// });

// calldb
// call
//0123456789Db!@|#
// pluW4vhvjniR9duz
// connection.connect();


// connectionDB.connect(function (err) {
//     if (err) {
//         console.error('error connecting: ' + err.stack);
//         return;
//     }

//     console.log('connected as id ' + connectionDB.threadId);
// });

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

app.get('/notconnect', async function (req, res) {

    //sends response to client or browser
    // console.log(req.query.id)
    // console.log(req.query.connect_status)
    if (req.query.id != null) {

        let selectUserdata = await selectUser(req.query.id)
        console.log('selectUserdata  :');
        console.log(selectUserdata);
        console.log('selectUserdata 33 :');

          if(selectUserdata.rows.length != 0){ 

               if (req.query.connect_status === "true") {
            console.log('notconnect if :');

            await updatetUserConnected(req.query.id, 1)
            return res.send("user connected ");

        } else if (req.query.connect_status === "false") {
            console.log('notconnect else  if :');

            await updatetUserConnected(req.query.id, 0)
            return res.send("user not connected ");

        }
        else {
            console.log('notconnect else :');
            return res.send(" connect_status error");
        }
    
    
    }else{
            return res.send("user not join app");

        }

     
    } else { 
        return res.send("data is null");

    }

    res.send("Welcome to Homepage");
});

// var dict = {};

// var myMap = new Map();

var ip = require("ip");
const { resolve } = require('path');
const { rejects } = require('assert');
console.dir("server id ip for test : " + ip.address());
// console.dir("server id ip for test : " + ip.PORT);
// console.dir("server id ip for test : " + ip.env);
// app.listen(3000)
//Socket.io Connection------------------
// io.engine.generateId = function (req) {
//     // generate a new custom id here
//     return 1
// }

// const statusMonitor = require('express-status-monitor');
// app.use(statusMonitor());


// for(var i=0;  i<=2;   i++){ }
  
//   var  socket= io( "?id="+i+"&name="+i+"&image="+i+"")

io.on('connection', async socket => {

    try {
        // var useId = i;
        //     var useName = i;
        //     var image =i;
        //     var socket1 =i; 
        console.log("connection 1  socket : " + socket)
        console.log("connection 1  .handshake.query.id : "  )

        console.log(socket.handshake.query.id)

        if (socket.handshake.query.id != null) {

            var useId = socket.handshake.query.id;
            var useName = socket.handshake.query.name;
            var image = socket.handshake.query.image;
            console.log(useId)
            console.log(useName)
            console.log(image)


            // console.log("Newsocketconnection socket.handshake.query : " + socket.handshake.query)
            // console.log("connection id : " + useId)
            // console.log("connection name : " + useName)
            // console.log("connection image : " + image)
            // console.log("connection ocket.id : " + socket.id)
            // dict[useId] = socket.id;
            // const update= await

           await updateUserData(useId, useName, image, socket.id, 1);
        } else {

            console.log("socket query =null")
        }

    }
    catch (error) {
        console.log("connection-callDB error : ")
        console.log(error)

    }

    // console.log("connection Object  " + Object.keys(dict))
    // console.log(dict)
    // console.log("id" + socket.id)

    socket.on('send-call', async function (message) {
        console.log("message1112")

        console.log(message)

        try {
            const d = new Date();
            var startDate = d
            console.log(startDate);
            let selectFriend = await selectUser(message.friendId)
            let selectMe = await selectUser(message.me_id)

            console.log("send-call send 1 sqlCheckUser+++++++++");


            if (selectFriend.rows.length != 0) {
                try {
                    console.log("send-call send if end-call88888888888888 ");
                    console.log(selectFriend);
                    console.log(selectFriend.rows.length);
                    console.log(selectFriend.rows[0].socket_id);

                    // var callerName = checkUserresult[0].user_name
                    // var callerImage = checkUserresult[0].user_image_url
                    // var callerSocket = checkUserresult.rows[0].socket_id
                    // var friendSocketVal = selectFriend.rows[0].socket_id
                    // var friendConnected = selectFriend.rows[0].connected
                    // var friendName = selectFriend.rows[0].user_name
                    // var friendImage = selectFriend.rows[0].user_image_url
                    // var friendStatus = selectFriend.rows[0].status
                    console.log("friendConnected==1");
                    // console.log(friendConnected);
                   
                    console.log("send-calluserIds")
                  
                    // console.log("operationId");
                    // console.log(operationId.rows.insertId);

                    if (selectFriend.rows[0].connected == 1) {
                        if (selectFriend.rows[0].status == 1) {
                            // var userIds = await selectMulitple( message.friendId,message.me_id)

                            console.log(selectMe)
         
                            console.log("friendConnected if ==1");
                            var operationId = await insertOperation(selectMe.rows[0].id,  selectFriend.rows[0].id, 4, startDate)

                            await updatetUserStatus(message.me_id, 0)
                            //    await updatetUserStatus(message.friendId,1)
                            console.log("send-call-data");
                            // console.log(userIds.rows );
                            // console.log(userIds.rows[1].user_mobile);

                            // console.log(userIds.rows[1].user_name);

                            io.to( selectFriend.rows[0].socket_id).emit('send-call', { "message": selectMe.rows[0].user_mobile, "username": selectMe.rows[0].user_name, "user-image": selectMe.rows[0].user_image_url, "operation_id": operationId.rows.insertId })

                            // userIds.rows.forEach(row => {
                            //     console.log("forEach if");
                            //     console.log(row);


                            //     if(row.user_mobile==message.me_id){

                            //         io.to(friendSocketVal).emit('send-call', { "message": row.user_mobile, "username": row.user_name, "user-image": row.user_image_url, "operation_id": operationId.rows.insertId })

                            //     }else{

                            //         // console.log("forEach else ");
                            //         // console.log(row);


                            //     }
                            // });


                        } else {
                            console.log("friendStatus else ==0");
                            // console.log(friendStatus);
                            try {

                                // let checkMyesult = await selectUser(message.me_id)
                                // var userIds = await selectMulitple(message.friendId, message.me_id)
                                // let selectFriend = await selectUser(message.friendId)
                                // let selectMe = await selectUser(message.me_id)

                                console.log(userIds)
                                console.log("send-call end-call-busy ");
    
                                if (userIds.rows.length != 0) {
                                    try {
                                        var operationId = await insertOperation(selectMe.rows[0].id, selectFriend.rows[0].id, 3, startDate)
                                        io.to(selectMe.rows[0].socket_id).emit('end-call', { "answer_id": message.friendId, "event_type": "busy-call", "operation_id": operationId.rows.insertId })


                                        // userIds.rows.forEach(row => {
                                        //     console.log("forEach if call-busy");
                                        //     console.log(row.id);
                                        //     console.log(row.socket_id);
                                        //     if (row.user_mobile == message.me_id) {
                                        //         console.log(row.user_mobile);                            // console.log("send-calluserIds2");
                                        //         console.log(message.me_id);
                                        //         io.to(row.socket_id).emit('end-call', { "answer_id": message.friendId, "event_type": "busy-call", "operation_id": operationId.rows.insertId })
                                        //         console.log("*********if user not connected **********");                            // console.log("send-calluserIds2");
    
                                        //         updatetUserStatus(message.me_id, 1)
    
                                        //     } else {
    
    
                                        //     }
                                        // });
                                    } catch (error) {
                                        console.log(error);
                                    };
                                   console.log("*************************");
                                 }
    
                            } catch (error) {
                                console.log("send-call error33");
                                console.log(error);
                            }
                            // try {

                            //     let checkMyesult = await selectUser(message.me_id)

                            //     console.log("send-call friendStatus 0 sqlCheckUser+++++++++");

                            //     if (checkMyesult.rows.length != 0) { 
                            //         var mySocket = checkMyesult.rows[0].socket_id
                                 

                           
                            //         await updatetUserStatus(message.me_id, 1)
                            //         console.log("send-call  userbusyyyyyyyyyyyy");
                            //         console.log("send-call mySocket");
                            //         console.log(  mySocket);
                            //         // UpdateOperation(operationId.rows.insertId, 3, startDate)
                            //         var operationId = await insertOperation(userIds.rows[0].id,  userIds.rows[1].id, 3, startDate)

                                  
                                  
                            //         io.to(mySocket).emit('end-call', {  "answer_id": message.me_id, "event_type": "busy-call" , "operation_id": operationId.rows.insertId})    // if (message.event_type == "busy-call") {
                            //         //     // user busy
                            //         //     let userIds = await selectMulitple(message.friendId, message.me_id)
                            //         //     const d = new Date();
                            //         //     var startDate = d
                            //         //     console.log(startDate);
                            //         //     await insertOperation(userIds.rows[0].id, userIds.rows[1].id, 3, startDate)

                            //         // }
                            //                     }

                            // } catch (error) {
                            //     console.log("send-call error");
                            //     console.log(error);
                            // }
                        }


                    } else {
                        console.log("friendConnected else ==0");
                        console.log(friendConnected);

                        try {

                            // let checkMyesult = await selectUser(message.me_id)
                            var userIds = await selectMulitple(message.friendId, message.me_id)
                            console.log(userIds)
                            console.log("send-call end-call s ");

                            if (userIds.rows.length != 0) {
                                try {
                                    var operationId = await insertOperation(selectMe.rows[0].id, selectFriend.rows[0].id, 2, startDate)
                                   
                                    io.to(selectMe.rows[0].socket_id).emit('end-call', { "answer_id": message.friendId, "event_type": "not_connected_call", "operation_id": operationId.rows.insertId })

                                    // userIds.rows.forEach(row => {
                                    //     console.log("forEach if not_connected_call");
                                    //     console.log(row.id);
                                    //     console.log(row.socket_id);
                                    //     if (row.user_mobile == message.me_id) {
                                    //         console.log(row.user_mobile);                            // console.log("send-calluserIds2");
                                    //         console.log(message.me_id);
                                    //         console.log("*********if user not connected **********");                            // console.log("send-calluserIds2");

                                    //         updatetUserStatus(message.me_id, 1)

                                    //     } else {


                                    //     }
                                    // });
                                } catch (error) {
                                    console.log(error);
                                };
                               console.log("*************************");
                             }

                        } catch (error) {
                            console.log("send-call error33");
                            console.log(error);
                        }
                    }

                    // console.log("send-call sqlUpdateUser 1 result");
                }
                catch (error) {
                    console.log("send-call checkUserresult if ");
                    console.log("error 2");
                    console.log(error);
                }
            }

            else {

                // let userIds = await selectMulitple(message.me_id)
                // const d = new Date();
                // var startDate = d
                // console.log(startDate);
                console.log("checkUserresult else ");
                console.log("send-call ");
               
                var operationId =   await insertOperation(selectMe.rows[0].id, message.friendId, 1, startDate)
                // let checkMyesult = await selectUser(message.me_id)
                // var mySocket = checkMyesult.rows[0].socket_id
                io.to(selectMe.rows[0].socket_id).emit('end-call', {  "answer_id": message.me_id, "event_type": "not_join", "operation_id": operationId.rows.insertId })

            }

        }
        catch (error) {
            console.log("send-callDB error : ")
            console.log(error);

        }

        /***************************************************************************************************************************** */
 
        console.log(message)
        // io.to(val).emit('send-call', { "message": message.me_id, "username": message.callerName, "use-rimage": message.callerImage })

    })

    socket.on('accept-call', async function (accept) {

        console.log(accept)
        // let val = dict[call.friendId];
        // console.log("friend ID : " + val)
        console.log("accept-call messagefromcallerId : " + accept.friendId)
        // console.log("call states : " + call.states)
        console.log("accept-call me_id : " + accept.me_id)
 
        try {

            let checkAcceptUserresult = await selectUser(accept.friendId)
            console.log("accept-call accept 1 sqlCheckUser+++++++++");
       
            if (checkAcceptUserresult.rows.length != 0) {
                try {
                    console.log("accept-call checkUserresult if end-call88888888888888 ");
                    console.log(checkAcceptUserresult);
                    console.log(checkAcceptUserresult.rows.length);
                    console.log(checkAcceptUserresult.rows[0].socket_id);
                    // var callerName = checkUserresult[0].user_name
                    // var callerImage = checkUserresult[0].user_image_url
                    var callerAcceptSocket = checkAcceptUserresult.rows[0].socket_id
                    console.log("accept-call checkAcceptUserresult if callerAcceptSocket  ");
                    console.log(callerAcceptSocket);
                  
                    await updatetUserStatus(accept.me_id, 0)

                    let AcceptuserIds = await selectMulitple(accept.friendId, accept.me_id)

                    // console.log("accept-call sqlUpdateUser 1 result");
                    console.log(AcceptuserIds);
                    console.log(AcceptuserIds.rows[0]);
                    console.log(AcceptuserIds.rows[1]);

                    const d = new Date();
                    var startDate = d
                    console.log(startDate);


                    console.log("accept-call operationId ccccccccccccccccc");
                  
                   await UpdateacceptOperation(accept.operation_id, 8)
                   console.log(callerAcceptSocket);

                    io.to(callerAcceptSocket).emit('accept-call', {  "answer_id": accept.me_id, "operation_id": accept.operation_id })

                }
                catch (error) {
                    console.log("accept-call checkAcceptUserresult if ");
                    console.log("accept-call error 2");
                    console.log(error);

                }
            }

            else {
                console.log("accept-call checkAcceptUserresult else ");
                console.log("accept-call ");
            }

        }
        catch (error) {
            console.log("accept-call error : ")
            console.log(error);

        }
    })
    socket.on('close-camera-call', async function (closecam) {
        console.log("closecam")

        console.log(closecam)

        try {

            let checkUserresult = await selectUser(closecam.friendId)
            console.log("close-camera-call accept 1 sqlCheckUser+++++++++");
            // // var callerId = checkUserresult.rows[0].user_mobile

            // console.log(checkUserresult.rows.length);
            // console.log(checkUserresult.rows);

            if (checkUserresult.rows.length != 0) {
                try {
                    console.log("close-camera-call checkUserresult if end-call88888888888888 ");
                    console.log(checkUserresult);
                    console.log(checkUserresult.rows.length);
                    console.log(checkUserresult.rows[0].socket_id);

                    var callerSocket = checkUserresult.rows[0].socket_id
                    console.log("close-camera-call checkUserresult if callerSocket  ");
                    console.log(callerSocket);
                    // await updatetUserStatus(call.me_id, 0)

                    io.to(callerSocket).emit('close-camera-call', { "answer_id": closecam.friendId,"states":closecam.states })
                    // console.log("close-camera-call sqlUpdateUser 1 result");
                    // console.log(result.rows[0]);
                }
                catch (error) {
                    console.log("close-camera-call checkUserresult if ");
                    console.log("error 2");
                    console.log(error);

                }
            }

            else {
                console.log("checkUserresult else ");
                console.log("close-camera-call ");
            }

        }
        catch (error) {
            console.log("close-camera-call error : ")
            console.log(error);

        }
     
    })


    socket.on('end-call', async function (end) {
        console.log("end-callttttttttttttttttttt ")
        console.log(end)
        // let val = dict[end.friendId];
        let eventType = end.event_type
        let operationId = end.operation_id
        console.log("operation_id");
        console.log(operationId);
        // console.log("end-call friend ID : " + val)
        console.log("end-call call messagefromcallerId : " + end.friendId)
        // console.log("end-call call states : " + end.states)
        console.log("end-call call end.event_type : " + end.event_type)
        console.log("end-call call eventType : " + eventType)
        const d = new Date();
        var endDate = d

        console.log(endDate);
        try {

            let checkUserresult = await selectUser(end.friendId)
            console.log("end 1 sqlCheckUser+++++++++");

          
            if (checkUserresult.rows.length != 0) {
                try {
                    console.log("checkUserresult if end-call88888888888888 ");
                    console.log(checkUserresult);
                    console.log(checkUserresult.rows.length);
                    console.log(checkUserresult.rows[0].socket_id);

                   
                    var callerSocket = checkUserresult.rows[0].socket_id
                    console.log("checkUserresult if callerSocket  ");
                    console.log(callerSocket);

                    await updatetUserStatus(end.friendId, 1)
                    await updatetUserStatus(end.me_id, 1)


                    // io.to(callerSocket).emit('end-call', {"answer_id": end.friendId, "event_type": end.event_type, "operation_id": operationId })


                    let userIds = await selectMulitple(end.friendId, end.me_id)
                    console.log("userIds");

                    console.log(userIds);

                    const d = new Date();
                    var startDate = d

                    console.log(startDate);


                    if (end.event_type == "reject-call") {
                        // insertOperation(userIds.rows[0].id, userIds.rows[1].id, 5, startDate)
                        io.to(callerSocket).emit('end-call', {"answer_id": end.me_id, "event_type": end.event_type, "operation_id": operationId })

                        var updateoperation = await UpdateOperation(operationId, 5, startDate)

                    }
                    else if (end.event_type == "cancel-call") {
                        // insertOperation(userIds.rows[0].id, userIds.rows[1].id, 6, startDate)

                        console.log("cancel-calluuuuuuu");
                        console.log(operationId);
                        console.log(callerSocket);
                        io.to(callerSocket).emit('end-call', {"answer_id": end.friendId, "event_type": end.event_type, "operation_id": operationId })

                        // var updateoperation = await UpdateOperation(operationId, 6, startDate)

                        // io.to(callerSocket).emit('end-call', {"answer_id": end.me_id, "event_type": end.event_type, "operation_id": operationId })

                        // var updateoperation=await  UpdateOperation(operationId,6,startDate)
                    }

                    else if (end.event_type == "end-call") {
                        console.log("checkUserresult if callerSocket  ");
                        console.log("updateoperation");

                        io.to(callerSocket).emit('end-call', {"answer_id": end.friendId, "event_type": end.event_type, "operation_id": operationId })

                        console.log("end.me_id");
                        console.log(end.me_id);

                        var operationData = await selectOperation(operationId)
                        console.log("operationDatarrrrrrrrr");
                        console.log(operationData);
                        console.log(operationData.rows.end_date);

                        if (operationData.rows.end_date == null) {

                            var updateoperation = await UpdateOperation(operationId, 8, startDate)

                        } else {

                        }

                        // var updateoperation=await UpdateOperation(operationId,8,startDate)

                        console.log(updateoperation);


                    }

                
                    // console.log("sqlUpdateUser 1 result");
                }
                catch (error) {
                    console.log("checkUserresult if ");
                    console.log("error 2");
                    console.log(error);

                }
            }

            else {
                console.log("checkUserresult else ");
                console.log("end-call ");
            }

        }
        catch (error) {
            console.log("end-callDB error : ")
            console.log(error);

        }


    })

   })
 
async function updateUserData(useId, useName, image, socket_id, status) {

    console.log("updateUserData : " + useId)
    // return new Promise(function (resolve, reject) {
    // return new Promise((resolve, reject) => {

    try {
        if (useId != null) {

            let req, res;

            try {

                // console.log("getupdateUserDataUserData if  : " + useId)
                // // selectUser(useId)
                // // var sqlCheckUser = `SELECT * FROM connectios_users WHERE user_mobile =?`;
                // console.log("updateUserData7777777777777 if  : ")

                let checkUserresult = await selectUser(useId)
                // console.log("updateUserData 1 sqlCheckUser+++++++++");
                // // // var callerId = checkUserresult.rows[0].user_mobile

                // console.log(checkUserresult.rows.length);
                // console.log(checkUserresult.rows);
                // // console.log(checkUserresult.rows[0].socket_id);


                if (checkUserresult.rows.length != 0) {
                    try {
                        // console.log("checkUserresult if ");

                        await updatetUser(useId, useName, image, socket_id, status)
                        // var sqlUpdateUser = `UPDATE connectios_users SET socket_id = ? WHERE user_mobile = ?`;
                        // let result = await businesspool(req, res, sqlUpdateUser, [socket_id, useId])

                        // console.log("sqlUpdateUser 1 result");
                        // console.log(result.rows[0]);
                    }
                    catch (error) {
                        // console.log("checkUserresult if ");
                        // console.log("error 2");

                    }
                }

                else {
                    // console.log("checkUserresult else ");
                    await insertUser(useId, useName, image, socket_id)
                    // console.log("user inserted ");
                }
            }
            catch (error) {
                // try {
                
                // }
                // catch (error) {
                //     console.log("error 3");
                //     console.log(error);


                // }
                console.log("updateUserData error 1");
                console.log(error);
            }

        }
        else {
            // return result;
            console.log("getUserData 8 :else ")

        }
    } catch (error) {
        console.log("getUserData 9 error  : " + error)

    }

}

async function selectUser(useId) {
    let req, res;
    console.log("selectUser *************** ");
    console.log(useId);
 
    try {
        // console.log("selectUser");
        // console.log("businesspooloooooooooooooo");
        var sqlCheckUser = `SELECT * FROM connectios_users WHERE user_mobile =?`;
        let checkUserresult = await businesspool(req, res, sqlCheckUser, [useId])
        // console.log("selectUser  ----");

        if (checkUserresult.rows.length != 0) {
            // console.log(checkUserresult.rows[0].user_mobile);
            // console.log(checkUserresult.rows[0].user_name);
            // console.log(checkUserresult.rows[0].socket_id);
        } else {
            console.log("no user");
        }

        return checkUserresult;
    }
    catch (error) {
        console.log("error 4");
        console.log(error);

    }
}

// async function selectUserByPhoneNumber(useId) {
//     let req, res;
//     console.log("selectUser *************** ");
//     console.log(useId);
 
//     try {
//         // console.log("selectUser");
//         // console.log("businesspooloooooooooooooo");
//         var sqlCheckUser = `SELECT * FROM connectios_users WHERE user_mobile =?`;
//         let checkUserresult = await businesspool(req, res, sqlCheckUser, [useId])
//         // console.log("selectUser  ----");

//         if (checkUserresult.rows.length != 0) {
//             // console.log(checkUserresult.rows[0].user_mobile);
//             // console.log(checkUserresult.rows[0].user_name);
//             // console.log(checkUserresult.rows[0].socket_id);
//         } else {
//             console.log("no user");
//         }

//         return checkUserresult;
//     }
//     catch (error) {
//         console.log("error 4");
//         console.log(error);

//     }
// }

async function selectMulitple(useId, me_id) {
    let req, res;
    console.log("selectMulitple *************** ");
    console.log(useId);

    // var useIdstring = useId.toString()
    try {
        console.log("selectMulitple");

        var sqlCheckUser = `SELECT  id ,user_mobile,user_name,user_image_url,socket_id  from connectios_users WHERE user_mobile in (?,?)`;
        let checkUserresult = await businesspool(req, res, sqlCheckUser, [useId, me_id])
        console.log("selectMulitple  ----");
        console.log(checkUserresult);

        if (checkUserresult.rows.length != 0) {
            console.log(checkUserresult.rows[0].user_mobile);
            console.log(checkUserresult.rows[0].user_name);
            console.log(checkUserresult.rows[0].socket_id);
            console.log("checkUserresultssssssssssssss");
        } else {
            console.log("no  Mulitple users");
        }

        return checkUserresult;
    }
    catch (error) {
        console.log("error 4");
        console.log(error);

    }
}


async function insertUser(useId, useName, image, socket_id) {
    let req, res;
    console.log("insertUser ppppppppppp");
    console.log(useId + useName + image + socket_id    );

    // console.log(useId);
    // console.log(useName);
    // console.log(image);
    // console.log(socket_id);
    // console.log(connected);

    try {
        var sql = `INSERT INTO connectios_users (user_mobile, user_name,user_image_url,socket_id) VALUES (?, ?,?,?)`;
        let result = await businesspool(req, res, sql, [useId, useName, image, socket_id])
        // console.log("updateUserData 1 result");

        // console.log(result);
    }
    catch (error) {
        console.log(" insertUser error 3");
        console.log(  error  );
    }
}

async function updatetUser(useId, useName, image, socket_id, status) {
    let req, res;
    console.log("updatetUser ");
    console.log(useId);
    try {
        var sqlUpdateUser = `UPDATE connectios_users SET user_name = ?,user_image_url = ?,socket_id = ?,status=?  WHERE user_mobile = ?`;

        let result = await businesspool(req, res, sqlUpdateUser, [useName, image, socket_id, status, useId])

        // console.log("sqlUpdateUser 1 result");
        // console.log(result.rows);
    }
    catch (error) {
        console.log("error 2");

    }

}

async function updatetUserConnected(useId, connected) {
    let req, res;
    console.log("updatetUserConnected ");


    try {
        var sqlUpdateUser = `UPDATE connectios_users SET  connected=?  WHERE user_mobile = ?`;
        let checkUserresult = await businesspool(req, res, sqlUpdateUser, [connected, useId])

        // console.log("sqlUpdateUser 1 result");
        // console.log(checkUserresult.rows[0]);

    }
    catch (error) {
        console.log("error 2");

    }

}

async function updatetUserStatus(useId, status) {
    let req, res;
    console.log("updatetUserStatus ");


    try {
        var sqlUpdateUser = `UPDATE connectios_users SET status = ?    WHERE user_mobile = ?`;
        let checkUserresult = await businesspool(req, res, sqlUpdateUser, [status, useId])

        // console.log("sqlUpdateUser 1 result");
        // console.log(checkUserresult.rows[0]);

    }
    catch (error) {
        console.log("updatetUserStatus error 5552");
        console.log(error);

    }

}

// async function updatetUserConnected(useId, connected) {
//     let req, res;
//     console.log("updatetUserStatus ");


//     try {
//         var sqlUpdateUser = `UPDATE connectios_users SET connected = ?    WHERE user_mobile = ?`;
//         let checkUserUpdateConnected = await businesspool(req, res, sqlUpdateUser, [connected, useId])

//         console.log("sqlUpdateUser 1 result");
//         console.log(checkUserUpdateConnected);
//         // console.log(checkUserresult.rows[0]);

//     }
//     catch (error) {
//         console.log("updatetUserStatus error 5552");
//         console.log(error);

//     }

// }

async function insertOperation(from, to, status, startDate) {
    let req, res;
    console.log("insertUser ");

    try {
        var sql = `INSERT INTO logs_history (user_id,to_id,status,start_date) VALUES (?,?,?,?)`;
        let result = await businesspool(req, res, sql, [from, to, status, startDate])
        console.log("insertOperation 1 result");
        console.log(result);
        return result;
    }
    catch (error) {
        console.log("insertOperation error 1");
        console.log(error);

    }
}

async function UpdateOperation(operationId, status, endTime) {
    let req, res;
    console.log("insertUser ");

    try {
        var sqlUpdateOperation = `UPDATE logs_history SET status = ?, end_date = ?   WHERE id = ?`;
        let checkUOperationResult = await businesspool(req, res, sqlUpdateOperation, [status, endTime, operationId])

        // var sql = `INSERT INTO logs_history (user_id,to_id,status,start_date) VALUES (?,?,?,?)`;
        // let result = await businesspool(req, res, sql, [from, to, status, startDate])
        console.log("UpdateOperation 1 result");
        console.log(checkUOperationResult);
        return checkUOperationResult;
    }
    catch (error) {
        console.log("UpdateOperation error 1");
        console.log(error);

    }
}

async function UpdateacceptOperation(operationId, status) {
    let req, res;
    console.log("insertUser ");

    try {
        var sqlUpdateOperation = `UPDATE logs_history SET status = ?  WHERE id = ?`;
        let checkUOperationResult = await businesspool(req, res, sqlUpdateOperation, [status, operationId])

        // var sql = `INSERT INTO logs_history (user_id,to_id,status,start_date) VALUES (?,?,?,?)`;
        // let result = await businesspool(req, res, sql, [from, to, status, startDate])
        console.log("UpdateOperation 1 result");
        console.log(checkUOperationResult);
        return checkUOperationResult;
    }
    catch (error) {
        console.log("UpdateOperation error 1");
        console.log(error);

    }
}

async function selectOperation(operationId) {
    let req, res;
    console.log("selectOperation *************** ");
    console.log(operationId);

    // var useIdstring = useId.toString()
    try {
        console.log("selectOperation");

        var sqlChecOperation = `SELECT  end_date  from logs_history WHERE id in (?)`;
        let checkOperationresult = await businesspool(req, res, sqlChecOperation, [operationId])
        console.log("selectOperation  ----");

        if (checkOperationresult.rows.length != 0) {
            console.log(checkOperationresult.rows[0].end_date);

            console.log("checkOperationresulttttttttttttt");

        } else {

            console.log("no  selectOperation ");
        }

        return checkOperationresult;
    }
    catch (error) {
        console.log("error 4");
        console.log(error);

    }
}
//listen to port 3000 on pc
// server.listen(3002)
server.listen(process.env.PORT || 3004)

