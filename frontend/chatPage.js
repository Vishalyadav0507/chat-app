let socket = io();

const token = localStorage.getItem("token")

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

            const groupid = localStorage.getItem("groupid") ? localStorage.getItem("groupid") : 0;

            const response = await axios.post(`http://localhost:3000/chat/message/${groupid}`,
                msz,
                {
                    headers:
                    {
                        "authentication": token
                    }
                }
            )
            socket.emit('send-message', msz);
            if (response.status === 201) {
                showOnChatBox(response.data.body.username, response.data.body.message)
                message.value = ''
            }
        }
    } catch (err) {
        console.log(err)
    }
}


const groupid = localStorage.getItem("groupid") ? localStorage.getItem("groupid") : 0;
if (groupid <= 0) {
    document.addEventListener("DOMContentLoaded", getmsz)
} else {
    document.addEventListener("DOMContentLoaded", groupChat(groupid))
}


async function getmsz() {
    try {
        const messageConainer = document.querySelector('.container')
        messageConainer.innerHTML = ""
        let lastmsgId = JSON.parse(localStorage.getItem('lastmsgId')) ? JSON.parse(localStorage.getItem('lastmsgId')) : 0;

        const responseMsz = await axios.get(`http://localhost:3000/chat/getmessage/${lastmsgId}`,
            {
                headers:
                {
                    "authentication": token
                }
            })
        const respMsz = responseMsz.data.message  //chat response
        if (respMsz.length > 0) {
            lastmsgId = parseInt(respMsz[respMsz.length - 1].id);
        }
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

        const loginId = parseJwt(token).id


        for (let i = 0; i < mergedArray.length; i++) {
            showOnChatBox(mergedArray[i].username, mergedArray[i].message, loginId, mergedArray[i].userId)

        }
        const getGroup = await axios.get("http://localhost:3000/group/get-group",
            {
                headers:
                {
                    "authentication": token
                }
            }
        )
        const Groupdata = getGroup.data.response
        if (Groupdata.length == 0) {
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

        const token = localStorage.getItem("token")
        e.preventDefault();
        const obj = {
            group: e.target.groupName.value
        }
        const response = await axios.post("http://localhost:3000/group/create-group",
            obj,
            {
                headers:
                {
                    "authentication": token
                }
            }
        )
        if (response.status == 201) {
            const resp = response.data.response
            alert(`group successfully created " ${resp.groupname}"`)
            console.log(response.data.response)
            showgroup(resp)
        }
    } catch (err) {
        console.log(err)
    }
}

async function getUser(groupid) {
    try {
        console.log(groupid)
        const allUser = await axios.get("http://localhost:3000/user/get-user",
            {
                headers:
                {
                    "authentication": token
                }
            }
        )
        const userDetails = allUser.data.allUser
        for (var i = 0; i < userDetails.length; i++) {

            if (allUser.data.userid == userDetails[i].id) {
                continue
            } else {
                const parentnode = document.getElementById(groupid)
                const childnode = `<li styple="padding-top:10px;" id="${userDetails[i].id}">${userDetails[i].Name} 
                <button class="btn btn-success" id="${userDetails[i].id}" onclick="addUser(${userDetails[i].id},${groupid})">add in group</button>
                <button class="btn btn-warning" onclick='deleteUser(${userDetails[i].id},${groupid})'>remove User</button></li>`
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
        const response = await axios.get(`http://localhost:3000/group/add-user?userId=${userid}&&groupId=${groupid}`, { headers: { "authentication": token } })

        if (response.status == 201) {
            alert("user added")
        }

    } catch (err) {
        if (err.status == 505) {
            {
                alert("you are not admin of this group")
            }
        } else {

            alert(`User already exists`)
        }
    }
}


async function groupChat(groupid) {
    const loginId = parseJwt(token).id
    const messageConainer = document.querySelector('.container')
    messageConainer.innerHTML = ""
    console.log("hello")
    localStorage.setItem("groupid", groupid)
    const response = await axios.get(`http://localhost:3000/chat/group-chat/${groupid}`, { headers: { "authentication": token } })
    for (var i = 0; i < response.data.message.length; i++) {
        showOnChatBox(response.data.message[i].username, response.data.message[i].message, loginId, response.data.message[i].userId)
    }
    groups.innerHTML = ""
    const getGroup = await axios.get("http://localhost:3000/group/get-group", { headers: { "authentication": token } })
    const Groupdata = getGroup.data.response

    for (var i = 0; i < Groupdata.length; i++) {
        showgroup(Groupdata[i])
    }
}


async function deleteGroup(groupid) {
    try {
        console.log(groupid)
        localStorage.setItem("groupid", 0)
        const response = await axios.delete(`http://localhost:3000/group/delete-group/${groupid}`, { headers: { "authentication": token } })
        if (response.status == 201) {
            const parentnode = document.getElementById("groups")
            const childnode = document.getElementById(groupid)
            parentnode.removeChild(childnode)
        }
    } catch (err) {
        alert("you are not admin of this group")
    }
}

async function deleteUser(userid, groupid) {
    try {
        const res = await axios.delete(`http://localhost:3000/group/user-delete?userId=${userid}&&groupId=${groupid}`, { headers: { "authentication": token } })

        if (res.status == 201) {
            alert("user successfully deleted")
        }
        console.log(res.status)
        if (res.status == 200) {
            alert("you are not admin of this group")
        }
    } catch (err) {
        alert('user not deleted')
        console.log(err)
    }

}


function exit() {
    if (localStorage.getItem("groupid") != 0) {
        localStorage.setItem("groupid", 0)
        groups.innerHTML = ""
        // message.innerHTML = ""
        getmsz()
    }
}

async function sendFile(e) {
    e.preventDefault()
    const groupid = localStorage.getItem("groupid")
    const file = document.getElementById('file').value
    // const fileData=file.files[0];
    console.log(file)
    // const formData=new FormData();
    // formData.append('file',fileData);
    // console.log(formData);

    const response = await axios.post("http://localhost:3000/media/sendmedia", { file, groupid }, { headers: { "authentication": token, 'Content-Type': 'multipart/form-data' } })
    console.log(response)
}


function showOnChatBox(userName, msz, loginId, userid) {
    if (loginId == userid) {
        const messageConainer = document.querySelector('.container')
        const messageElement = document.createElement('div')
        messageElement.innerText = `${userName}:${msz}`
        messageElement.classList.add('right')
        messageConainer.append(messageElement)
    } else {
        const messageConainer = document.querySelector('.container')
        const messageElement = document.createElement('div')
        messageElement.innerText = `${userName}:${msz}`
        messageElement.classList.add('left')
        messageConainer.append(messageElement)
    }
}

function showgroup(resp) {
    console.log(resp)
    const parentnode = document.getElementById('groups')
    const childnode = `<h4 id="${resp.groupId}">${resp.groupname} 
    <button class="btn btn-success" onclick='groupChat(${resp.groupId})'>chat</button> 
    <button id="addUser" onclick="getUser(${resp.groupId})" class="btn btn-secondary" >add user</button> 
    <button onclick="deleteGroup(${resp.groupId})" class="btn btn-danger" >delete</button> 
    <button onclick="exit(${resp.groupId})" class="btn btn-warning">exit</button> </h4>`
    parentnode.innerHTML += childnode
}
const logout = () => {
    localStorage.removeItem("lastmsgId")
    localStorage.removeItem("groupid")
    localStorage.removeItem("token")
    location.href = "login.html"
}
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}