const express=require('express')
const router=express.Router()

const auth=require("../middleware/auth")
const chat=require("../controller/chat")

router.post('/message',auth.authenticate,chat.chat)

module.exports=router