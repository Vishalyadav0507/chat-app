const chats = require("../model/chat")
const { Op } = require("sequelize");

const chat = async (req, res, next) => {
    try {
        const user = req.user
        const response = await chats.create({ username: user.Name, message: req.body.msz, userId: user.id })
        if (response) {
            res.status(201).json({ body: response })
        }
    } catch (err) {
        res.status(401).json({ err: "something went wrong" })
    }
}
const getchat = async (req, res, next) => {
    try {
    
        const lastmsgId = req.params.id || 0
        console.log("id", lastmsgId)
        const message = await chats.findAll(
            {
                where:
                {
                    id: {
                        [Op.gt]: lastmsgId   //>sequelize operator [Op:gt]
                    }
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
module.exports = {
    chat: chat,
    getchat: getchat
}