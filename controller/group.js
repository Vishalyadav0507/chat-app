const group = require("../model/createGroup")
const Groupinfo = require("../model/userInGroup")
const chat = require("../model/chat")
const sequelize = require("../util/database")

const createGroup = async (req, res, next) => {
    try {
        const t = await sequelize.transaction()
        const response = await group.create({
            groupname: req.body.group,
            userId: req.user.id
        }, { transaction: t })
        const resp = await Groupinfo.create({
            groupId: response.dataValues.id,
            userId: req.user.id,
            groupname: response.dataValues.groupname
        }, { transaction: t })
        await t.commit()
        res.status(201).json({ message: "group successfully created", response: resp.dataValues })
    } catch (err) {
        console.log(err)
        await t.rollback()
        res.status(401).json({ err: "group cannot created" })
    }
}

const getgroup = async (req, res, next) => {
    try {
        const userid = req.user.id
        const found = await Groupinfo.findAll({
            attributes: ["groupId", "groupname"],
            where: { userId: userid }
        })
        let data = []

        for (var i = 0; i < found.length; i++) {
            data.push(found[i].dataValues)
        }

        res.status(201).json({ response: data })
    }
    catch (err) {
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
        console.log(checkAdmin)
        if (checkAdmin) {
            const addUserInGroup = await Groupinfo.create({
                groupId: groupid, userId: userid, groupname: checkAdmin.dataValues.groupname
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
        const t = await sequelize.transaction()
        await chat.destroy({
            where: {
                groupId: groupId
            }
        }, { transaction: t })
        const response = await group.destroy({
            where:
            {
                id: groupId,
                userId: userId
            }
        }, { transaction: t })
        await t.commit()
        if (response) {
            res.status(201).json({ response, message: "successfully deleted" })
        } else {
            res.status(501).json({ err: "you are not admin" })
        }
    } catch (err) {
        await t.rollback()
        console.log(err)
        res.status(401).json({ err: "group not deleted" })
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const admin = req.user.id
        const groupId = req.query.groupId
        const userId = req.query.userId
        console.log(admin, groupId)
        const checkAdmin = await group.findOne({
            where: {
                id: groupId,
                userId: admin
            }
        })
        if (!checkAdmin) {
            res.status(200).json({ err: "you are not admin of this group" })
        }
        if (checkAdmin) {
            const deleteUser = await Groupinfo.destroy({
                where: {
                    userId: userId,
                    groupId: groupId
                }
            })
            if (deleteUser) {
                return res.status(201).json({ message: "user deleleted" })
            }
        }
    } catch (err) {
        console.log(err)
        res.status(401).json({ err: "user not deleted" })

    }
}
module.exports = {
    createGroup: createGroup,
    getgroup: getgroup,
    addUserInGroup: addUserInGroup,
    deleteGroup: deleteGroup,
    deleteUser: deleteUser
}