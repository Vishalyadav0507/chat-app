const express=require('express');
const path=require('path')

const bodyParser=require('body-parser')
const cors=require('cors')

const sequelize=require('./util/database')
const User=require("./model/user")
const chats=require("./model/chat")
const userRoute=require('./routes/user');
const chatRoute=require("./routes/chat")

const app=express()

app.use(cors({
    origin: "http://127.0.0.1:5500",
})
)
app.use(bodyParser.json({extended:false}))
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user',userRoute)
app.use('/chat',chatRoute)

User.hasMany(chats)
chats.belongsTo(User)


sequelize.sync()
.then(result=>{
    app.listen(3000)
})
.catch(err=>{
    console.log(err)
})

