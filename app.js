const express=require('express');
const path=require('path')

const bodyParser=require('body-parser')
const cors=require('cors')

const sequelize=require('./util/database')
const User=require("./model/user")
const chats=require("./model/chat")
const group=require("./model/createGroup")

const userRoute=require('./routes/user');
const chatRoute=require("./routes/chat")
const groupRoute=require("./routes/group")

const app=express()

app.use(cors({
    origin: "http://127.0.0.1:5500",
})
)
app.use(bodyParser.json({extended:false}))
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user',userRoute)
app.use('/chat',chatRoute)
app.use("/group",groupRoute)

User.hasMany(chats)
chats.belongsTo(User)

User.hasMany(group)
group.belongsTo(User)

sequelize.sync()
.then(result=>{
    app.listen(3000)
})
.catch(err=>{
    console.log(err)
})

