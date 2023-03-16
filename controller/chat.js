const chats = require("../model/chat")
const { Op } = require("sequelize");

const chat = async (req, res, next) => {
    try {
        const user = req.user
        const groupid = req.params.id

        const response = await chats.create({
            username: user.Name, groupId: groupid, message: req.body.msz, userId: user.id
        })
        if (response) {
            res.status(201).json({ body: response })
        }
    } catch (err) {
        console.log(err)
        res.status(401).json({ err: "message not send" })
    }
}
const getchat = async (req, res, next) => {
    try {

        const lastmsgId = req.params.id

        const message = await chats.findAll(
            {
                where:
                {
                    id: {
                        [Op.gt]: lastmsgId   //>sequelize operator [Op:gt]
                    }, groupId: { [Op.eq]: 0 }
                }
            })
        if (message.length >= 0) {
            res.status(201).json({ message: message })
        } else {
            res.status(401).json({ err: "empty chats" })
        }
    } catch (err) {
        res.status(401).json({ err: err })
        console.log(err)
    }

}

const groupchat = async (req, res, next) => {
    try {
        const groupid = req.params.groupId
        const message = await chats.findAll({
            where: {
                groupId: groupid
            }
        })
        res.status(201).json({ message: message })
    } catch (err) {
        res.status(401).json(err)
    }
}
module.exports = {
    chat: chat,
    getchat: getchat,
    groupchat: groupchat
}