const express=require('express');
const app=express()
const path=require('path')

const bodyParser=require('body-parser')
const cors=require('cors')

const dotenv = require('dotenv');

dotenv.config();

app.use(cors());

// const io = require('socket.io')(5000);
const { Server } = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = new Server(server);

// io.on('connection', socket => {
//     socket.on('send-message', room => {
//         console.log(room);
//         io.emit('receive-message', room);
//     });
// })

io.on('connection', (socket) => {
	socket.on('send message', (chat) => {
		io.emit('send message', (chat));
	});
});


const sequelize=require('./util/database')
const User=require("./model/user")
const chats=require("./model/chat")
const group=require("./model/createGroup")
const userInGroup=require("./model/userInGroup")


const userRoute=require('./routes/user');
const chatRoute=require("./routes/chat")
const groupRoute=require("./routes/group")
const mediaRoute=require("./routes/media")



app.use(bodyParser.json({extended:false}))
app.use(express.static(path.join(__dirname, 'frontend')));

app.use('/user',userRoute)
app.use('/chat',chatRoute)
app.use("/group",groupRoute)
app.use("/media",mediaRoute)

User.hasMany(chats)
chats.belongsTo(User)

group.hasMany(chats)
chats.belongsTo(group)


User.belongsToMany(group, {through: userInGroup})
group.belongsToMany(User, {through: userInGroup})

app.use((req,res)=>{
    res.sendFile(path.join(__dirname,`frontend/${req.url}`))
})


sequelize.sync()
.then(result=>{
    server.listen(process.env.PORT || 3000)
})
.catch(err=>{
    console.log(err)
})

