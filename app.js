const express=require('express');
const path=require('path')

const bodyParser=require('body-parser')
const cors=require('cors')

const sequelize=require('./util/database')
const userRoute=require('./routes/user');
const { urlencoded } = require('body-parser');

const app=express()

app.use(bodyParser.json({extended:false}))
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

app.use('/user',userRoute)

sequelize.sync()
.then(result=>{
    app.listen(3000)
})
.catch(err=>{
    console.log(err)
})

