const Sequelize = require("sequelize")
const sequelize = require("../util/database")

const chat = sequelize.define("chat", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    message: Sequelize.STRING,

    // groupId: Sequelize.INTEGER
})

module.exports = chat