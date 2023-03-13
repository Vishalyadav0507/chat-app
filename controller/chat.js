const chats=require("../model/chat")

const chat= async(req,res,next)=>{
    const user=req.user
    console.log(user.id)
    await chats.create({username:user.Name,message:req.body.msz,userId:user.id})
    
}

module.exports={
    chat:chat
}