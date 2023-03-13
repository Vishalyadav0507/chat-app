const group=require("../model/createGroup")

const createGroup=async(req,res,next)=>{
    try{
        const response=group.create({groupname:req.body.group,userid:req.user.id})
    }catch(err){
        res.status(401).json({err:"group cannot created"})
    }
}

module.exports={
    createGroup:createGroup
}