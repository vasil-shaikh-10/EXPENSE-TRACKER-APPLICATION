const mongoose = require('mongoose')
const bcrypt=require('bcrypt')
const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        require:true,
        unique:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true,
    },
    role:{
        type:String,
        enum: ["user", "admin"], // Define allowed roles
        default: "user",
    }
})

UserSchema.pre('save',async function (next) {
    if(!this.isModified('password')) next()
    this.password = await bcrypt.hash(this.password,10)
    next();
})

UserSchema.methods.comparePassword=async function (password) {
    return await bcrypt.compare(password,this.password)
}

const User = mongoose.model('User',UserSchema)

module.exports = User