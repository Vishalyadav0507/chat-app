const express=require("express")
const router=express.Router()

const auth=require("../middleware/auth")
const group=require("../controller/group")

router.post("/create-group",auth.authenticate,group.createGroup)

module.exports=router