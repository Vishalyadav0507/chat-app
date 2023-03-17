const express=require("express")
const router=express.Router()

const auth=require("../middleware/auth")
const group=require("../controller/group")

router.post("/create-group",auth.authenticate,group.createGroup)

router.get("/get-group",group.getgroup)

router.delete("/delete-group/:id",auth.authenticate,group.deleteGroup)

router.delete("/user-delete",auth.authenticate,group.deleteUser)

router.get("/add-user",auth.authenticate,group.addUserInGroup)

module.exports=router