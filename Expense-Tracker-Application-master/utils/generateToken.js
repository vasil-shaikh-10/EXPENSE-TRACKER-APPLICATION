const cookie = require('cookie-parser')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const GenerateTokenAndSetCookie =async(userId,res)=>{
    try {
        console.log(process.env.JWT_SECRET)
        let token = jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:'15d'});
        res.status(201).cookie("jwt-ExpenseTracker",token,{
            maxAge:15 * 24 * 60 * 60 * 1000, // 15 days in MS
            httpOnly:true,
            sameSite:"strict"
        })
        return token;
    } catch (error) {
        console.log("Error In GenrateTokenAndSetCookie :- ",error.message)
        res.status(500).json({message:'Internal Error :- ',error:error})
    }
}

module.exports = GenerateTokenAndSetCookie