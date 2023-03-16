const express=require('express')
const router=express.Router()

const userController=require('../controller/user')
const auth=require("../middleware/auth")

router.post('/signup',userController.signup)

router.post('/login',userController.login)

router.get('/get-user',auth.authenticate,userController.getUser)

module.exports=router