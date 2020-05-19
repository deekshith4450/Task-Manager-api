const mongoose=require('mongoose')


mongoose.connect(process.env.MONGODB_URL,{useUnifiedTopology:true,useCreateIndex:true})





// Tasks.create({
//     description:'Play vollyball',

// }).then((task) =>{
//     console.log('Inserted successfully')
//     console.log(task)
// }).catch((error) =>
// {
//     console.log('Error!',error)
// })

// Tasks.find({}).then((task) =>{
//     console.log('Inserted successfully')
//     console.log(task)
// }).catch((error) =>
// {
//     console.log('Error!',error)
// })



// const task=new Tasks({
//     description:'         wake ealry        ',
//     completed:true
// })

// task.save().then(() =>{
//     console.log(task)
// }).catch((error)=>{
//     console.log(error)
// })


// const me=new User({
//     name:'     Akhil  ',
//     email:'aAAk0@gamil.com     ',
//     age:'24'
//     // password:'naaklckpvmodpv'
// })

// me.save().then(() =>{
//     console.log(me)
// }).catch((error) =>{
//     console.log('Error!',error)
// })