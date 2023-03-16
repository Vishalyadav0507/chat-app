const group = require("../model/createGroup")
const Groupinfo = require("../model/userInGroup")

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
        // const userid = req.user.id

        const response = await group.findAll(
            {
                attributes: ["id", "groupname"],
                // where: { userId: userid }
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
// ?userId=${userid}&groupId=${groupid}
const addUserInGroup = async (req, res, next) => {
    try {
        console.log("new route")
        const userid = req.query.userId
        const groupid = req.query.groupId

        const addUserInGroup = await Groupinfo.create({
            groupId: groupid, userId: userid
        })

        const getGroup = await group.update({
            userIngroup: userid
        },
            {
                where:
                {
                    id: groupid
                }
            })
        res.status(201).json({ addUserInGroup, message: "successfully added in group" })

    } catch (err) {
        console.log(err)
        res.status(401).json({ err: "user already exists in this group" })
    }
}

const deleteGroup = async (req, res, next) => {
    try {
        const groupId = req.params.id
        const userId = req.user.id
        const response = await group.destroy({
            where:
            {
                id: groupId,
                userId: userId
            }
        })
        if(response){
            res.status(201).json({response ,message:"successfully deleted"})
        }else{
            res.status(501).json({err:"you are not admin"})
        }
    } catch (err) {
        console.log(err)
        res.status(401).json({ err: "group not deleted" })
    }
}
module.exports = {
    createGroup: createGroup,
    getgroup: getgroup,
    addUserInGroup: addUserInGroup,
    deleteGroup:deleteGroup
}