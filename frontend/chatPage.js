
async function sendmsz(e) {
    try {
        e.preventDefault();
        if (e.target.msz.value === '') {
            msg.innerHTML = "Please Enter message";
            setTimeout(() => {
                msg.innerHTML = "";
            }, 3000)
        }else{
        const msz = {
            msz: e.target.msz.value
        }
        const token = localStorage.getItem("token")
        const response = await axios.post("http://localhost:3000/chat/message", msz, { headers: { "authentication": token } })
        if (response.status === 201) {
            showOnChatBox(response.data.body.username, response.data.body.message)
        }}
    } catch (err) {
        console.log(err)
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const token = localStorage.getItem("token")
        const response = await axios.get("http://localhost:3000/chat/getmessage",{ headers: { "authentication": token } })
        
        if (response.status==201) {
            for(let i=0; i<response.data.message.length;i++){
                showOnChatBox(response.data.message[i].username, response.data.message[i].message)
            }
        }
    } catch (err) {
        console.log(err)
    }
})

function showOnChatBox(userName, msz) {
    const parentnode = document.getElementById("message")
    const childnode = `<p>${userName}:${msz}</p>`
    parentnode.innerHTML += childnode
}