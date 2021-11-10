var caller

var answer
exports.getUserData = (caller, answer, usersData) => {
    // console.log("getUserData******************************************")
    console.log(usersData)
    caller = usersData.rows[0]
    console.log("calller***************************")
    console.log(caller)


    usersData.rows.forEach(row => {
                                console.log("forEach if");
                                console.log(row);


                                if(row.user_mobile==caller){
                                    caller = row
                                  }else if(row.user_mobile==answer) {

                                    answer= row

                                }
                            });

    return { _caller: caller, _answer: answer }

}



