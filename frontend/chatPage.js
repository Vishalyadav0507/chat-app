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
            const response = await axios.post("http://localhost:3000/chat/message", msz, { headers: { "authentication": token } })
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

document.addEventListener("DOMContentLoaded", getmsz)
async function getmsz() {
    try {
        let lastmsgId = JSON.parse(localStorage.getItem('lastmsgId')) || 1;
        console.log(lastmsgId)
        const token = localStorage.getItem("token")

        const response = await axios.get(`http://localhost:3000/chat/getmessage/${lastmsgId}`, { headers: { "authentication": token } })

        lastmsgId += parseInt(response.data.message.length);


        let existingArray = JSON.parse(localStorage.getItem('messages')) || [];
        if (existingArray.length >= 10) {
            existingArray = [];
        }

        let responseArray = response.data.message;

        let mergedArray = existingArray.concat(responseArray);


        localStorage.setItem('lastmsgId', JSON.stringify(lastmsgId));

        localStorage.setItem('messages', JSON.stringify(mergedArray));
        console.log(mergedArray.length)
        for (let i = 0; i < mergedArray.length; i++) {
            showOnChatBox(mergedArray[i].username, mergedArray[i].message)

        }
    } catch (err) {
        console.log(err)
    }
}


function showOnChatBox(userName, msz) {
    const parentnode = document.getElementById("message")
    const childnode = `<p>${userName}:${msz}</p>`
    parentnode.innerHTML += childnode
}

async function createGroup(e) {
    try {
        const token=localStorage.getItem("token")
        e.preventDefault();
        const obj = {
            group: e.target.groupName.value
        }
        await axios.post("http://localhost:3000/group/create-group",obj,{headers:{"authentication": token }})
    } catch (err) {
        console.log(err)
    }

}

