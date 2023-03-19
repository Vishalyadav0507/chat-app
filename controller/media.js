const S3Services=require('../services/s3_instance')
const chat=require("../model/chat")

const postmedia=async(req,res,next)=>{
    try {
        const user = req.user

        const { fileData,groupid } = req.body

        const stringified = JSON.stringify(fileData);

        const fileName = `mediachat${user.id}/${new Date()}.txt`;

    
        const fileURL = await S3Services.uploadS3(stringified, fileName)
        if (groupid==0) {
            const response = await chat.create({
                username: user.Name, message:fileURL , userId: user.id
            })
            if (response) {
                res.status(201).json({ fileURL, success: true })
            }
        } else {
            const response = await chat.create({
                username: user.Name, message:fileURL , userId: user.id, groupId: groupid
            })
            if (response) {
                res.status(201).json({ fileURL, success: true })
            }
        }
    
    } catch (err) {
        res.status(401).json({ success: false, err: err })
        console.log(err)
    }
    
}

module.exports={
    postmedia:postmedia
}