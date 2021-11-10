//requires express module

const express = require('express');
const app = express();
//requires  httpmodule

const http = require('http')
const businesspool = require('./businessPool')

const setUserData = require('./setUsersdData')
// var PORT = process.env.PORT || 3001;
// create server

const server = http.createServer(app);
// const io = require('socket.io')(server);
const io = require('socket.io')(server, { origins: '*:*' });
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

        if (selectUserdata.rows.length != 0) {

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


        } else {
            return res.send("user not join app");

        }


    } else {
        return res.send("data is null");

    }

    res.send("Welcome to Homepage");
});

app.get('/logs', async function (req, res) {

    console.log('logs1');

    if (req.query.id != null) {

        let selectUserLogs = await selectAllUserLogs(req.query.id)

        console.log('logs2 selectUserLogs');

        console.log(selectUserLogs);

        if (selectUserLogs.rows.length != 0) {
            return res.send(selectUserLogs);
        } else {
            return res.send("no logs");
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
        console.log("connection 1  .handshake.query.id : ")

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
        console.log("send-call1")


        try {
            console.log(message)
            let messageCallerId = message.me_id
            let messageAnswerId = message.friendId
            const d = new Date();
            var startDate = d
            console.log(startDate);
            let usersSortDataSendCall = await getUserDataAndSort(messageCallerId, messageAnswerId)
            var callerData = usersSortDataSendCall._caller;
            var answerData = usersSortDataSendCall._answer;

            console.log("send-call2 ");
            console.log(answerData.id);

            if (answerData.id != null) {

                try {
                    console.log("send-call3");
                    console.log(answerData);
                    console.log(answerData.socket_id);
                    console.log("send-call4 try ")

                    console.log(answerData.connected)
                    console.log(answerData.status)

                    if (answerData.connected == 1) {
                        if (answerData.status == 1) {
                            console.log(answerData)
                            console.log("send-call5 friendConnected if ==1");
                            var operationId = await insertOperation(callerData.id, answerData.id, 4, startDate)
                            await updatetUserStatus(callerData.id, 0)
                            io.to(answerData.socket_id).emit('send-call', { "message": callerData.user_mobile, "username": callerData.user_name, "user-image": callerData.user_image_url, "operation_id": operationId.rows.insertId })

                        } else {
                            console.log("send-call6 friendStatus else ==0");
                            try {
                                console.log("send-call7  call-busy ");
                                try {
                                    var operationId = await insertOperation(callerData.id, answerData.id, 3, startDate)

                                    io.to(callerData.socket_id).emit('end-call', { "answer_id": answerData.user_mobile, "event_type": "busy-call", "operation_id": operationId.rows.insertId })
                                } catch (error) {
                                    console.log("send-call8  error ");

                                    console.log(error);
                                };


                            } catch (error) {
                                console.log("send-call9 error3");
                                console.log(error);
                            }
                        }

                    } else {
                        console.log("send-call10 else ==0");
                        console.log(answerData.connected);

                        try {

                            console.log("send-call11 end-call not_connected_call");

                            try {
                                var operationId = await insertOperation(callerData.id, answerData.id, 2, startDate)

                                io.to(callerData.socket_id).emit('end-call', { "answer_id": answerData.user_mobile, "event_type": "not_connected_call", "operation_id": operationId.rows.insertId })

                            } catch (error) {
                                console.log(error);
                            };
                            console.log("send-call12");
                            // }

                        } catch (error) {
                            console.log("send-call13  error");
                            console.log(error);
                        }
                    }

                }
                catch (error) {

                    console.log("send-call14 error");
                    console.log(error);
                }
            }

            else {
                console.log("send-call15 ");
                var operationId = await insertOperation(callerData.id, messageAnswerId, 1, startDate)
                io.to(callerData.socket_id).emit('end-call', { "answer_id": messageAnswerId, "event_type": "not_join", "operation_id": operationId.rows.insertId })
            }

        }
        catch (error) {
            console.log("send-call16 error")
            console.log(error);

        }
    })
    /***************************************************************************************************************************** */

    socket.on('accept-call', async function (accept) {
        console.log("accept-call1")
        console.log(accept)

        try {
            /************************* */
            const d = new Date();
            var startDate = d
            console.log(startDate);

            let acceptCallerId = accept.me_id
            let accepteAnswerId = accept.friendId

            let usersSortDataAcceptCall = await getUserDataAndSort(acceptCallerId, accepteAnswerId)
            let callerData = usersSortDataAcceptCall._caller;
            let answerData = usersSortDataAcceptCall._answer;

            /******************************************************************************************************************************* */

            console.log("accept-call2");

            if (answerData.id != 0) {
                try {

                    console.log("accept-call3");
                    await updatetUserStatus(callerData.id, 0)
                    console.log("accept-call4");
                    await UpdateacceptOperation(accept.operation_id, 8)
                    io.to(answerData.socket_id).emit('accept-call', { "answer_id": acceptCallerId, "operation_id": accept.operation_id })

                }
                catch (error) {
                    console.log("accept-call5 error ");
                    console.log(error);
                }
            }
            else {
                console.log("accept-call6 else");
            }
        }
        catch (error) {
            console.log("accept-call7 error")
            console.log(error);

        }
    })


    /***************************************************************************************************************************************************** */
    socket.on('close-camera-call', async function (closecamera) {
        console.log("close-camera-call1")
        console.log(closecamera)

        try {
            /************************* */
            let closeCameraCallerId = closecamera.me_id
            let closeCameraAnswerId = closecamera.friendId
            let usersSortDataCloseCamera = await getUserDataAndSort(closeCameraCallerId, closeCameraAnswerId)
            let callerData = usersSortDataCloseCamera._caller;
            let answerData = usersSortDataCloseCamera._answer;

            /******************************************************************************************************************************* */
            console.log("close-camera-call2 ");

            if (answerData.id != 0) {
                try {
                    io.to(answerData.socket_id).emit('close-camera-call', { "answer_id": answerData.user_mobile, "states": closecamera.states })
                }
                catch (error) {
                    console.log("close-camera-call3 error  ");
                    console.log(error);
                }
            }
            else {
                console.log("close-camera-call4 else ");
            }
        }
        catch (error) {
            console.log("close-camera-call5 error : ")
            console.log(error);
        }
    })


    socket.on('end-call', async function (end) {
        console.log("end-call1")
        console.log(end)

        try {

            /************************* */
            let endCallerId = end.me_id
            let endAnswerId = end.friendId
            let usersSortDataEnd = await getUserDataAndSort(endCallerId, endAnswerId)
            let callerData = usersSortDataEnd._caller;
            let answerData = usersSortDataEnd._answer;

            /******************************************************************************************************************************* */
            let eventType = end.event_type
            let operationId = end.operation_id

            console.log("end operation_id");
            console.log(operationId);

            const d = new Date();
            var endDate = d
            console.log(endDate);

            console.log("end-call2");

            if (answerData.id != 0) {
                try {

                    await updatetUserStatus(end.friendId, 1)
                    await updatetUserStatus(end.me_id, 1)

                    if (eventType == "reject-call") {
                        console.log("end-call3 reject");
                        io.to(answerData.socket_id).emit('end-call', { "answer_id": callerData.user_mobile, "event_type": eventType, "operation_id": operationId })
                        var updateoperation = await UpdateOperation(operationId, 5, endDate)

                    }
                    else if (eventType == "cancel-call") {

                        console.log("end-call4 cancel-call");

                        io.to(answerData.socket_id).emit('end-call', { "answer_id": callerData.user_mobile, "event_type": eventType, "operation_id": operationId })


                    }

                    else if (eventType == "end-call") {
                        console.log("end-call5 end-call");

                        io.to(answerData.socket_id).emit('end-call', { "answer_id": callerData.user_mobile, "event_type": eventType, "operation_id": operationId })

                        var operationData = await selectOperation(operationId)

                        if (operationData.rows.end_date == null) {
                            console.log("end-call6 end-Date");

                            var updateoperation = await UpdateOperation(operationId, 8, endDate)

                        } else {

                        }
                        // console.log(updateoperation);

                    }
                }
                catch (error) {
                    console.log("end-call7 error ");

                    console.log(error);

                }
            }

            else {
                console.log("end-call8 else");
                ;
            }

        }
        catch (error) {
            console.log("end-call9 error")
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
                let checkUserresult = await selectUser(useId)
                if (checkUserresult.rows.length != 0) {
                    try {

                        await updatetUser(useId, useName, image, socket_id, status)

                    }
                    catch (error) {

                    }
                }

                else {
                    await insertUser(useId, useName, image, socket_id)
                }
            }
            catch (error) {

                console.log("updateUserData error 1");
                console.log(error);
            }

        }
        else {
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

        var sqlCheckUser = `SELECT * FROM connectios_users WHERE user_mobile =?`;
        let checkUserresult = await businesspool(req, res, sqlCheckUser, [useId])


        if (checkUserresult.rows.length != 0) {

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

async function getUserDataAndSort(caller, answer) {

    let getUsersData = await selectMulitple(caller, answer)

    let SortUserData = setUserData.getUserData(caller, answer, getUsersData)

    console.log("returndata77777777777777777777777")

    console.log(SortUserData._caller)
    console.log(SortUserData._answer)

    return SortUserData;

}

async function selectMulitple(caller_id, answer_id) {
    let req, res;
    console.log("selectMulitple *************** ");
    console.log(caller_id);

    try {
        console.log("selectMulitple");

        var sqlCheckUser = `SELECT  * from connectios_users WHERE user_mobile in (?,?)`;
        let checkUserresult = await businesspool(req, res, sqlCheckUser, [caller_id, answer_id])
        console.log("selectMulitple  ----");
        console.log(checkUserresult);

        if (checkUserresult.rows.length != 0) {

            // console.log(checkUserresult.rows[0].user_mobile);
            // console.log(checkUserresult.rows[0].user_name);
            // console.log(checkUserresult.rows[0].socket_id);
            // console.log("checkUserresultssssssssssssss");

            return checkUserresult;

        } else {
            console.log("no  Mulitple users");
            return null;

        }

    }
    catch (error) {
        console.log("error 4");
        console.log(error);
        return null;
    }
}


async function insertUser(useId, useName, image, socket_id) {
    let req, res;
    console.log("insertUser ppppppppppp");
    console.log(useId + useName + image + socket_id);

    try {
        var sql = `INSERT INTO connectios_users (user_mobile, user_name,user_image_url,socket_id) VALUES (?, ?,?,?)`;
        await businesspool(req, res, sql, [useId, useName, image, socket_id])

    }
    catch (error) {
        console.log(" insertUser error 3");
        console.log(error);
    }
}

async function updatetUser(useId, useName, image, socket_id, status) {
    let req, res;
    console.log("updatetUser ");
    console.log(useId);
    try {
        var sqlUpdateUser = `UPDATE connectios_users SET user_name = ?,user_image_url = ?,socket_id = ?,status=?  WHERE user_mobile = ?`;

        await businesspool(req, res, sqlUpdateUser, [useName, image, socket_id, status, useId])

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




async function selectAllUserLogs(userId) {
    let req, res;
    console.log("selectAllUserLogs1 ");
    console.log(userId);

    try {

        var sqlAllUserLogs = ` SELECT * FROM connectios_users c, logs_history logs  WHERE  c.user_mobile= ?  AND (c.id = logs.user_id   or c.id = logs.to_id)`;
        let alUserLogsResult = await businesspool(req, res, sqlAllUserLogs, [userId])

        console.log("selectAllUserLogs22 ");

        if (alUserLogsResult.rows.length != 0) {

            console.log("selectAllUserLogs");
            console.log(alUserLogsResult.rows);

        } else {

            console.log("no  selectAllUserLogs ");
        }

        return alUserLogsResult;
    }
    catch (error) {
        console.log("error 4");
        console.log(error);

    }
}

// selectAllUserLogs(0)

// SELECT *
// FROM connectios_users c, logs_history l
// WHERE  c.user_mobile= 0
// AND (c.id = l.user_id 
// or c.id = l.to_id)



//listen to port 3000 on pc
// server.listen(3002)

// getUserDataAndSort()

server.listen(process.env.PORT || 3004)

