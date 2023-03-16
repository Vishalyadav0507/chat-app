async function sendmsz(e) {
    try {
        e.preventDefault();
        if (e.target.msz.value === '') {
            msg.innerHTML = "Please Enter message";
            setTimeout(() => {
                msg.innerHTML = "";
            }, 3000)
        } else {
            const msz = {
                msz: e.target.msz.value
            }
            const token = localStorage.getItem("token")
            const groupid = localStorage.getItem("groupid")?localStorage.getItem("groupid"): 0;

            const response = await axios.post(`http://localhost:3000/chat/message/${groupid}`, msz, { headers: { "authentication": token } })

            if (response.status === 201) {
                showOnChatBox(response.data.body.username, response.data.body.message)
            }
        }
    } catch (err) {
        console.log(err)
    }
}
// setInterval(()=>{
//     message.innerHTML=""
//    getmsz()
// },1000)

const groupid=localStorage.getItem("groupid")?localStorage.getItem("groupid"):0;
if(groupid<0){
    
    document.addEventListener("DOMContentLoaded", getmsz)
}else{
    document.addEventListener("DOMContentLoaded",groupChat(groupid))
}


async function getmsz() {
    try {
        let lastmsgId = JSON.parse(localStorage.getItem('lastmsgId'))?JSON.parse(localStorage.getItem('lastmsgId')) : 0;
        const token = localStorage.getItem("token")

        const responseMsz = await axios.get(`http://localhost:3000/chat/getmessage/${lastmsgId}`, { headers: { "authentication": token } })
        const respMsz = responseMsz.data.message  //chat response

        lastmsgId += parseInt(respMsz.length);
        let resLength = respMsz.length

        let existingArray = JSON.parse(localStorage.getItem('messages')) || [];

        if (existingArray.length >= 10) {
            while (resLength > 0) {
                existingArray.shift()
                resLength--
            }
        }

        let responseArray = respMsz;

        let mergedArray = existingArray.concat(responseArray);


        localStorage.setItem('lastmsgId', JSON.stringify(lastmsgId));

        localStorage.setItem('messages', JSON.stringify(mergedArray));

        for (let i = 0; i < mergedArray.length; i++) {
            showOnChatBox(mergedArray[i].username, mergedArray[i].message)

        }
        const getGroup = await axios.get("http://localhost:3000/group/get-group", { headers: { "authentication": token } })
        const Groupdata = getGroup.data.response
        if(Groupdata.length==0){
            localStorage.setItem("groupid", 0)
        }
        for (var i = 0; i < Groupdata.length; i++) {
            showgroup(Groupdata[i])
        }

    } catch (err) {
        console.log(err)
    }
}

async function createGroup(e) {
    try {
        console.log("hii")
        const token = localStorage.getItem("token")
        e.preventDefault();
        const obj = {
            group: e.target.groupName.value
        }
        const response = await axios.post("http://localhost:3000/group/create-group", obj, { headers: { "authentication": token } })
        if (response.status == 201) {
            const resp = response.data.response
            alert(`group successfully created " ${resp.groupname}"`)
            showgroup(resp)
        }
    } catch (err) {
        console.log(err)
    }
}

async function getUser(groupid) {
    try {
        const token = localStorage.getItem("token")
        console.log(groupid)
        const allUser = await axios.get("http://localhost:3000/user/get-user", { headers: { "authentication": token } })
        const userDetails = allUser.data.allUser
        for (var i = 0; i < userDetails.length; i++) {

            if (allUser.data.userid == userDetails[i].id) {
                continue
            } else {
                const parentnode = document.getElementById(groupid)
                const childnode = `<li id="${userDetails[i].id}">${userDetails[i].Name} <button id="${userDetails[i].id}" onclick="addUser(${userDetails[i].id},${groupid})" >add in group</button></li>`
                parentnode.innerHTML += childnode
            }
        }

    } catch (err) {
        console.log(err)
    }
}

async function addUser(userid, groupid) {
    try {
        console.log(groupid)
        
        const token = localStorage.getItem("token")
        const response = await axios.get(`http://localhost:3000/group/add-user?userId=${userid}&groupId=${groupid}`, { headers: { "authentication": token } })
        
        document.getElementById(userid).style.visibility = "hidden"

    } catch (err) {
        console.log(err)
    }
}
async function groupChat(groupid) {
    const token = localStorage.getItem("token")
    message.innerHTML = ""

    localStorage.setItem("groupid", groupid)
    const response = await axios.get(`http://localhost:3000/chat/group-chat/${groupid}`, { headers: { "authentication": token } })
    for (var i = 0; i < response.data.message.length; i++) {
        showOnChatBox(response.data.message[i].username, response.data.message[i].message)
    }
    groups.innerHTML=""
    const getGroup = await axios.get("http://localhost:3000/group/get-group", { headers: { "authentication": token } })
    const Groupdata = getGroup.data.response
    if(Groupdata.length==0){
        localStorage.setItem("groupid", 0)
    }
    for (var i = 0; i < Groupdata.length; i++) {
        showgroup(Groupdata[i])
    }
}

async function deleteGroup(groupid){
    try{
    const token=localStorage.getItem("token")
    const response= await axios.delete(`http://localhost:3000/group/delete-group/${groupid}`,{ headers: { "authentication": token }})
    if(response.status==201){
        const parentnode=document.getElementById("groups")
        const childnode=document.getElementById(groupid)
        parentnode.removeChild(childnode)
    }
}catch(err){
        alert("you are not admin of this group")
}
}

function exit() {
    localStorage.setItem("groupid", 0)
    groups.innerHTML=""
    message.innerHTML=""
    getmsz()
}

function showOnChatBox(userName, msz) {
    const parentnode = document.getElementById("message")
    const childnode = `<p>${userName}:${msz}</p>`
    parentnode.innerHTML += childnode
}

function showgroup(resp) {
    const parentnode = document.getElementById('groups')
    const childnode = `<p id="${resp.id}">${resp.groupname} <button onclick='groupChat(${resp.id})'>chat</button> <button id="addUser" onclick="getUser(${resp.id})" >add user</button><button onclick="deleteGroup(${resp.id})" >delete</button> <button onclick="exit(${resp.id})">exit</button> </p>`
    parentnode.innerHTML += childnode
}