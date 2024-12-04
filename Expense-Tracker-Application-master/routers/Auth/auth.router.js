const {Router} = require('express')
const {Register, Login} = require('../../controllers/Auth/auth.controller')

const AuthRouter = Router()

AuthRouter.post('/register',Register)
AuthRouter.post('/login',Login)

module.exports = AuthRouter