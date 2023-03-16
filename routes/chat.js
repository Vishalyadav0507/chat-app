const express=require('express')
const router=express.Router()

const auth=require("../middleware/auth")
const chat=require("../controller/chat")

router.post('/message/:id',auth.authenticate,chat.chat)

router.get('/getmessage/:id',auth.authenticate,chat.getchat)

router.get('/group-chat/:groupId',auth.authenticate,chat.groupchat)

module.exports=router