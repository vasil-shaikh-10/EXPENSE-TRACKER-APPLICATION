const { string } = require('joi')
const mongoose = require('mongoose')

const ExSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,ref:'User',required:true
    },
    category:{
        type:String
    },
    amount:{
        type:Number
    },
    description:{
        type:String
    },
    date:{
        type:Date
    },
    type:{
        type:String
    }
})

const Expense = mongoose.model('ExpenseData',ExSchema)

module.exports = Expense