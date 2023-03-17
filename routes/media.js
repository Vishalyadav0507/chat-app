const router=require("express").Router()
const controller=require("../controller/media")
const auth=require("../middleware/auth")

router.post("/sendmedia",auth.authenticate,controller.postmedia)

module.exports=router