const express = require('express')
const cors = require('cors')
const cookie = require('cookie-parser')
const DataBase = require('./configs/db')
const path = require('path')
const AuthRouter = require('./routers/Auth/auth.router')
const ExRouter = require('./routers/Expense/expense.router')
const manageIsUser = require('./middlewares/manageIsUser')
const app = express()

const congigCors = {
    origin:"*",
    Credential:true,
    methods:["GET","POST","PUT","PATCH","DELETE"]
}
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.options("",cors(congigCors))
app.use(cors(congigCors))
app.use(express.static(__dirname + "/public"))
app.use(cookie())
app.use('/api/auth',AuthRouter)
app.use('/api/expense',manageIsUser,ExRouter)

app.get('/',(req,res)=>{
    res.send({msg:"Welcome To Expense Tracker Application"})
})

app.listen(process.env.PORT,()=>{
    console.log("Server Start");
    DataBase()
})