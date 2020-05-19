const express =require('express')
require('./db/mongoosedb')

const usersRouter =require('./routers/userRouter')
const tasksRouter =require('./routers/taskRouter')

const app =express()
app.use(express.json())
app.use(usersRouter)
app.use(tasksRouter)

const port =process.env.PORT 

app.listen(port,() =>{
    console.log('Server started at '+port)
})