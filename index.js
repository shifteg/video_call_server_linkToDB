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

const statusMonitor = require('express-status-monitor');
app.use(statusMonitor());
io.on('connection', async socket => {

    try {

        console.log("connection 11 ocket.id : " + socket.id)
        var useId = socket.handshake.query.id;
        var useName = socket.handshake.query.name;
        var image = socket.handshake.query.image;
        // console.log("Newsocketconnection socket.handshake.query : " + socket.handshake.query)
        // console.log("connection id : " + useId)
        // console.log("connection name : " + useName)
        // console.log("connection image : " + image)
        // console.log("connection ocket.id : " + socket.id)
        // dict[useId] = socket.id;
        // const update= await
        updateUserData(useId, useName, image, socket.id, 1).then(result => {
            // console.log("connection-callDB 1 call result : " + result)

        })
    }
    catch (error) {
        console.log("connection-callDB error : ")
    }

    // console.log("connection Object  " + Object.keys(dict))
    // console.log(dict)
    // console.log("id" + socket.id)

    socket.on('send-call', async function (message) {
        console.log(message)

        try {
            let checkUserresult = await selectUser(message.friendId)
            console.log("accept-call updateUserData 1 sqlCheckUser+++++++++");


            if (checkUserresult.rows.length != 0) {
                try {
                    console.log("send-call checkUserresult if end-call88888888888888 ");
                    console.log(checkUserresult);
                    console.log(checkUserresult.rows.length);
                    console.log(checkUserresult.rows[0].socket_id);

                    // var callerName = checkUserresult[0].user_name
                    // var callerImage = checkUserresult[0].user_image_url
                    // var callerSocket = checkUserresult.rows[0].socket_id
                    var friendSocketVal = checkUserresult.rows[0].socket_id
                    var friendConnected = checkUserresult.rows[0].connected
                    var friendName = checkUserresult.rows[0].user_name
                    var friendImage = checkUserresult.rows[0].user_image_url
                    var friendStatus = checkUserresult.rows[0].status
                    console.log("friendConnected==1");
                    console.log(friendConnected);
                    let userIds = await selectMulitple(message.friendId, message.me_id)
                    const d = new Date();
                    var startDate = d
                    console.log(startDate);

                    var operationId = await insertOperation(userIds.rows[0].id, userIds.rows[1].id, 4, startDate)
                    console.log("operationId");
                    console.log(operationId.rows.insertId);

                    if (friendConnected == 1) {
                        if (friendStatus == 1) {
                            console.log("friendConnected if ==1");
                            await updatetUserStatus(message.me_id, 0)
                            //    await updatetUserStatus(message.friendId,1)
                         
                            io.to(friendSocketVal).emit('send-call', { "message": message.me_id, "username": friendName, "userimage": friendImage, "operation_id": operationId.rows.insertId })

                        } else {
                            console.log("friendStatus else ==0");
                            console.log(friendStatus);

                            try {

                                let checkMyesult = await selectUser(message.me_id)

                                console.log("send-call friendStatus 0 sqlCheckUser+++++++++");

                                if (checkMyesult.rows.length != 0) { 
                                    var mySocket = checkMyesult.rows[0].socket_id
                                 

                           
                                    await updatetUserStatus(message.me_id, 1)
                                    console.log("send-call  userbusyyyyyyyyyyyy");
                                    console.log("send-call mySocket");
                                    console.log(  mySocket);
                                    UpdateOperation(operationId.rows.insertId, 3, startDate)

                                    io.to(mySocket).emit('end-call', {  "answer_id": message.me_id, "event_type": "busy-call" , "operation_id": operationId.rows.insertId})    // if (message.event_type == "busy-call") {
                                    //     // user busy
                                    //     let userIds = await selectMulitple(message.call_id, message.me_id)
                                    //     const d = new Date();
                                    //     var startDate = d
                                    //     console.log(startDate);
                                    //     await insertOperation(userIds.rows[0].id, userIds.rows[1].id, 3, startDate)

                                    // }
                                                }

                            } catch (error) {
                                console.log("send-call error");
                                console.log(error);
                            }
                        }


                    } else {
                        console.log("friendConnected else ==0");
                        console.log(friendConnected);

                        try {

                            let checkMyesult = await selectUser(message.me_id)

                            console.log("send-call updateUserData 1 sqlCheckUser+++++++++");

                            if (checkMyesult.rows.length != 0) {
                                var mySocket = checkMyesult.rows[0].socket_id
                                io.to(mySocket).emit('end-call', { "answer_id": message.me_id, "event_type": "not_connected_call" })
                                await updatetUserStatus(message.me_id, 1)
                                let userIds = await selectMulitple(end.call_id, end.me_id)
                                const d = new Date();
                                var startDate = d
                                console.log(startDate);
                                insertOperation(userIds.rows[0].id, userIds.rows[1].id, 2, startDate)
                            }

                        } catch (error) {
                            console.log("send-call error");
                            console.log(error);
                        }
                    }

                    console.log("send-call sqlUpdateUser 1 result");
                }
                catch (error) {
                    console.log("send-call checkUserresult if ");
                    console.log("error 2");
                    console.log(error);
                }
            }

            else {
                let checkMyesult = await selectUser(message.me_id)
                var mySocket = checkMyesult.rows[0].socket_id
                io.to(mySocket).emit('end-call', {  "answer_id": message.me_id, "event_type": "not_join" })

                let userIds = await selectMulitple(message.me_id)
                const d = new Date();
                var startDate = d
                console.log(startDate);

                await insertOperation(userIds.rows[0].id, message.friendId, 1, startDate)

                console.log("checkUserresult else ");
                console.log("send-call ");
            }

        }
        catch (error) {
            console.log("send-callDB error : ")
            console.log(error);

        }

        /***************************************************************************************************************************** */
 
        console.log(message)
        // io.to(val).emit('send-call', { "message": message.me_id, "username": message.callerName, "userimage": message.callerImage })

    })

    socket.on('accept-call', async function (call) {

        console.log(call)
        // let val = dict[call.call_id];
        // console.log("friend ID : " + val)
        console.log("call messagefromcallerId : " + call.call_id)
        // console.log("call states : " + call.states)
        console.log("accept-call me_id : " + call.me_id)
 
        try {

            let checkUserresult = await selectUser(call.call_id)
            console.log("accept-call updateUserData 1 sqlCheckUser+++++++++");
       
            if (checkUserresult.rows.length != 0) {
                try {
                    console.log("accept-call checkUserresult if end-call88888888888888 ");
                    console.log(checkUserresult);
                    console.log(checkUserresult.rows.length);
                    console.log(checkUserresult.rows[0].socket_id);
                    // var callerName = checkUserresult[0].user_name
                    // var callerImage = checkUserresult[0].user_image_url
                    var callerSocket = checkUserresult.rows[0].socket_id
                    console.log("accept-call checkUserresult if callerSocket  ");
                    console.log(callerSocket);
                    await updatetUserStatus(call.me_id, 0)

                    let userIds = await selectMulitple(call.call_id, call.me_id)

                    console.log("accept-call sqlUpdateUser 1 result");
                    console.log(userIds);
                    console.log(userIds.rows[0]);
                    console.log(userIds.rows[1]);

                    const d = new Date();
                    var startDate = d
                    console.log(startDate);


                    console.log("operationId ccccccccccccccccc");
                  
                   await UpdateacceptOperation(call.operation_id, 8)

                    io.to(callerSocket).emit('accept-call', {  "answer_id": call.me_id, "operation_id": call.operation_id })

                }
                catch (error) {
                    console.log("accept-call checkUserresult if ");
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
    socket.on('closecam-call', async function (closecam) {
        console.log("closecam")

        console.log(closecam)

        try {

            let checkUserresult = await selectUser(closecam.call_id)
            console.log("closecam-call updateUserData 1 sqlCheckUser+++++++++");
            // // var callerId = checkUserresult.rows[0].user_mobile

            // console.log(checkUserresult.rows.length);
            // console.log(checkUserresult.rows);

            if (checkUserresult.rows.length != 0) {
                try {
                    console.log("closecam-call checkUserresult if end-call88888888888888 ");
                    console.log(checkUserresult);
                    console.log(checkUserresult.rows.length);
                    console.log(checkUserresult.rows[0].socket_id);

                    var callerSocket = checkUserresult.rows[0].socket_id
                    console.log("closecam-call checkUserresult if callerSocket  ");
                    console.log(callerSocket);
                    // await updatetUserStatus(call.me_id, 0)

                    io.to(callerSocket).emit('closecam-call', { "answer_id": closecam.call_id })
                    console.log("closecam-call sqlUpdateUser 1 result");
                    // console.log(result.rows[0]);
                }
                catch (error) {
                    console.log("closecam-call checkUserresult if ");
                    console.log("error 2");
                    console.log(error);

                }
            }

            else {
                console.log("checkUserresult else ");
                console.log("closecam-call ");
            }

        }
        catch (error) {
            console.log("closecam-callerror : ")
            console.log(error);

        }
     
    })


    socket.on('end-call', async function (end) {
        console.log("end-callttttttttttttttttttt ")
        console.log(end)
        // let val = dict[end.call_id];
        let eventType = end.event_type
        let operationId = end.operation_id
        console.log("operation_id");
        console.log(operationId);
        // console.log("end-call friend ID : " + val)
        console.log("end-call call messagefromcallerId : " + end.call_id)
        // console.log("end-call call states : " + end.states)
        console.log("end-call call end.event_type : " + end.event_type)
        console.log("end-call call eventType : " + eventType)
        const d = new Date();
        var endDate = d

        console.log(endDate);
        try {

            let checkUserresult = await selectUser(end.call_id)
            console.log("updateUserData 1 sqlCheckUser+++++++++");

          
            if (checkUserresult.rows.length != 0) {
                try {
                    console.log("checkUserresult if end-call88888888888888 ");
                    console.log(checkUserresult);
                    console.log(checkUserresult.rows.length);
                    console.log(checkUserresult.rows[0].socket_id);

                   
                    var callerSocket = checkUserresult.rows[0].socket_id
                    console.log("checkUserresult if callerSocket  ");
                    console.log(callerSocket);

                    await updatetUserStatus(end.call_id, 1)
                    await updatetUserStatus(end.me_id, 1)


                    io.to(callerSocket).emit('end-call', {"answer_id": end.call_id, "event_type": end.event_type, "operation_id": operationId })


                    let userIds = await selectMulitple(end.call_id, end.me_id)
                    console.log("userIds");

                    console.log(userIds);

                    const d = new Date();
                    var startDate = d

                    console.log(startDate);


                    if (end.event_type == "reject-call") {
                        // insertOperation(userIds.rows[0].id, userIds.rows[1].id, 5, startDate)
                        var updateoperation = await UpdateOperation(operationId, 5, startDate)

                    }
                    else if (end.event_type == "cancel-call") {
                        // insertOperation(userIds.rows[0].id, userIds.rows[1].id, 6, startDate)

                        console.log("cancel-calluuuuuuu");
                        console.log(operationId);
                        // var updateoperation=await  UpdateOperation(operationId,6,startDate)
                    }

                    else if (end.event_type == "end-call") {
                        console.log("checkUserresult if callerSocket  ");
                        console.log("updateoperation");


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

                
                    console.log("sqlUpdateUser 1 result");
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


async function updateUserData(useId, useName, image, socket_id, connected) {

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

                        await updatetUser(useId, useName, image, socket_id, connected)
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
                    await insertUser(useId, useName, image, socket_id, connected)
                    // console.log("user inserted ");
                }
            }
            catch (error) {
                try {
                
                }
                catch (error) {
                    console.log("error 3");

                }
                console.log("error 1");
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


async function selectMulitple(useId, me_id) {
    let req, res;
    console.log("selectMulitple *************** ");
    console.log(useId);

    // var useIdstring = useId.toString()
    try {
        console.log("selectMulitple");

        var sqlCheckUser = `SELECT  id  from connectios_users WHERE user_mobile in (?,?)`;
        let checkUserresult = await businesspool(req, res, sqlCheckUser, [useId, me_id])
        console.log("selectMulitple  ----");

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


async function insertUser(useId, useName, image, socket_id, connected) {
    let req, res;
    console.log("insertUser ppppppppppp");
    console.log(useId);
    console.log(useName);
    console.log(image);
    console.log(socket_id);
    console.log(connected);

    try {
        var sql = `INSERT INTO connectios_users (user_mobile, user_name,user_image_url,socket_id,connected) VALUES (?, ?,?,?,?)`;
        let result = await businesspool(req, res, sql, [useId, useName, image, socket_id, connected])
        console.log("updateUserData 1 result");

        console.log(result);
    }
    catch (error) {
        console.log("error 3");

    }
}

async function updatetUser(useId, useName, image, socket_id, connected) {
    let req, res;
    console.log("updatetUser ");

    try {
        var sqlUpdateUser = `UPDATE connectios_users SET user_name = ?,user_image_url = ?,socket_id = ?,connected=?  WHERE user_mobile = ?`;

        let result = await businesspool(req, res, sqlUpdateUser, [useName, image, socket_id, connected, useId])

        console.log("sqlUpdateUser 1 result");
        console.log(result.rows);
    }
    catch (error) {
        console.log("error 2");

    }

}

async function updatetUserConnected(useId, connected) {
    let req, res;
    console.log("updatetUser ");


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

        console.log("sqlUpdateUser 1 result");
        console.log(checkUserresult.rows[0]);

    }
    catch (error) {
        console.log("updatetUserStatus error 5552");
        console.log(error);

    }

}

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

