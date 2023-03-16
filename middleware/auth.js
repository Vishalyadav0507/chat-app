const jwt = require('jsonwebtoken')
const User = require('../model/user')

const authenticate = (req, res, next) => {
    try {
        const token = req.header('authentication')

        const user = jwt.verify(token, "somethingforToken")

        User.findByPk(user.id).then(user => {
            req.user = user
            next()
        })
            .catch(err => {
                res.status(500).json({ err: err })
            })
    }
    catch (err) {
        console.log(err)
        res.status(501).json({ err: "something went wrong" })
    }
}

module.exports = { authenticate: authenticate }