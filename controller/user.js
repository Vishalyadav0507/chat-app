const bcrypt = require('bcrypt')
const User = require('../model/user')
const jwt = require("jsonwebtoken")

function generateToken(Name, id, Email) {
    return jwt.sign({ Name: Name, id: id, Email: Email }, "somethingforToken")
}

function stringvalidater(str) {
    if (str == undefined || str.length === 0) {
        return true
    }
    else {
        return false
    }
}

const signup = async (req, res, next) => {
    try {
        const { Name, Number, Email, Password } = req.body;
        if (stringvalidater(Name) || stringvalidater(Number) || stringvalidater(Email) || stringvalidater(Password)) {
            return res.status(400).json({ err: "something is missing" })
        }

        const saltRound = 5;
        bcrypt.hash(Password, saltRound, async (err, hash) => {
            if (err) {
                return res.status(401).json({ err: "password did not save" })
            } else {
                User.create({
                    Name, Number, Email, Password: hash
                }).then(response => {
                    res.status(201).json({ message: "signup succesfully" })
                }).catch(err => {
                    res.status(404).json({ err: "user already exist" })
                })
            }
        })
    } catch (err) {
        res.status(501).json({ err: "something wrong" })
        console.log(err)
    }
}


const login = async (req, res, next) => {
    const { Email, Password } = req.body
    const ValideUser = await User.findAll({
        where: {
            Email: Email
        }
    })
    if (ValideUser.length > 0) {
        bcrypt.compare(Password, ValideUser[0].Password, (err, result) => {
            if (result == true) {

                const token = generateToken(ValideUser[0].Name, ValideUser[0].id, ValideUser[0].Email)
                res.status(201).json({ message: "login successfully", token: token })
            } else {
                res.status(401).json({ err: "password missmatched" })
            }
        })
    } else {
        res.status(401).json({ err: "user does not exists" })
    }
}

const getUser = async (req, res, next) => {
    try {
        const userID = req.user.id
        const allUser = await User.findAll()
        res.status(201).json({ allUser: allUser, userid: userID })
    } catch (err) {
        res.status(401).json({ err: "no user found" })
    }

}
module.exports = {
    signup: signup,
    login: login,
    getUser: getUser
}