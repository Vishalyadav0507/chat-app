const bcrypt = require('bcrypt')
const User = require('../model/user')

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
                    await User.create({ Name, Number, Email, Password: hash }).then(response=>{
                        res.status(201).json({ message: "signup succesfully" })
                    }).catch(err=>{
                        res.status(401).json({err:"user already exist"})
                    })
                }
            })
    } catch (err) {
        res.status(501).json({ err: "something wrong" })
        console.log(err)
    }
}

module.exports = {
    signup: signup
}