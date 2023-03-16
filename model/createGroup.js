const Sequelize = require("sequelize")
const sequelize = require("../util/database")

const CreateGroup = sequelize.define("group", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    groupname: {
        type: Sequelize.STRING,
        allowNull: false
    },
    userId: Sequelize.INTEGER
})
module.exports = CreateGroup