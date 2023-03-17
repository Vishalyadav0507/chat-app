const group = require("../model/createGroup")
const Groupinfo = require("../model/userInGroup")
const chat = require("../model/chat")

const createGroup = async (req, res, next) => {
    try {

        const response = await group.create({
            groupname: req.body.group, userId: req.user.id
        })

        res.status(201).json({ message: "group successfully created", response: response.dataValues })
    } catch (err) {
        console.log(err)
        res.status(401).json({ err: "group cannot created" })
    }
}

const getgroup = async (req, res, next) => {
    try {


        const response = await group.findAll(
            {
                attributes: ["id", "groupname"],
            })

        let data = []

        for (var i = 0; i < response.length; i++) {
            data.push(response[i].dataValues)
        }

        res.status(201).json({ response: data })

    } catch (err) {
        res.status(401).json({ err: "cannot get group" })
    }
}

const addUserInGroup = async (req, res, next) => {
    try {

        const userid = req.query.userId
        const groupid = req.query.groupId
        const adminUserId = req.user.id
        
        const checkAdmin = await group.findOne({
            where: {
                userId: adminUserId,
                id: groupid
            }
        })

        if (checkAdmin) {
            const addUserInGroup = await Groupinfo.create({
                groupId: groupid, userId: userid
            })

            res.status(201).json({ addUserInGroup, message: "successfully added in group" })
        }
        else {
            res.status(505).json("you are not admin of this group")
        }
    } catch (err) {
        console.log(err)
        res.status(401).json({ err: "user already exists in this group" })
    }
}

const deleteGroup = async (req, res, next) => {
    try {
        const groupId = req.params.id
        const userId = req.user.id
        await chat.destroy({
            where: {
                groupId: groupId
            }
        })
        const response = await group.destroy({
            where:
            {
                id: groupId,
                userId: userId
            }
        })
        if (response) {
            res.status(201).json({ response, message: "successfully deleted" })
        } else {
            res.status(501).json({ err: "you are not admin" })
        }
    } catch (err) {
        console.log(err)
        res.status(401).json({ err: "group not deleted" })
    }
}

const deleteUser=async(req,res,next)=>{
    try{
    const admin=req.user.id
    const groupId=req.query.groupId
    const userId=req.query.userId
    console.log(admin,groupId)
    const checkAdmin=await group.findOne({
        where:{
            id:groupId,
            userId:admin
        }
    })
    if(!checkAdmin){
        res.status(200).json({err:"you are not admin of this group"})
    }
    if(checkAdmin){
        const deleteUser=await Groupinfo.destroy({
            where:{
                userId:userId,
                groupId:groupId
            }
        })
        if(deleteUser){
            return res.status(201).json({message:"user deleleted"})
        }
    }
}catch(err){
    console.log(err)
    res.status(401).json({err:"user not deleted"})

}
}
module.exports = {
    createGroup: createGroup,
    getgroup: getgroup,
    addUserInGroup: addUserInGroup,
    deleteGroup: deleteGroup,
    deleteUser:deleteUser
}