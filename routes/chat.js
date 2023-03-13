const express=require('express')
const router=express.Router()

const auth=require("../middleware/auth")
const chat=require("../controller/chat")

router.post('/message',auth.authenticate,chat.chat)
router.get('/getmessage/:id',auth.authenticate,chat.getchat)

module.exports=router