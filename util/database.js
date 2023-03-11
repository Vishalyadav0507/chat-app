const Sequelize=require('sequelize')
const sequelize=new Sequelize("chatapp","root","Vishal@05",{dialect:"mysql",host:"localhost"})

module.exports=sequelize