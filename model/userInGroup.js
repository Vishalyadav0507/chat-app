const Sequelize = require("sequelize")
const sequelize = require("../util/database")

const Groupinfo = sequelize.define("groupinfo", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    groupname:{
        type:Sequelize.STRING,
        allowNull: false
    }
})
module.exports = Groupinfo