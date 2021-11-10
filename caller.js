const student={
    name:"alex",age:20,email:"alex@email.com"
}

// const stu_str=JSON.stringify(student)
// console.log(stu_str)

const Objectdata=JSON.parse(student)
console.log(Objectdata)
console.log(Objectdata.name)
console.log(Objectdata.age)
console.log(Objectdata.email)