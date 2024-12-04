const mongoose = require('mongoose')
require('dotenv').config()
const DataBase = async()=>{
    await mongoose.connect(process.env.MONGODB_URL)
    console.log(process.env.MONGODB_URL)
    console.log("DataBase Connect");
}

module.exports = DataBase