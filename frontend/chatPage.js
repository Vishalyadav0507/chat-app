
async function sendmsz(e){
    e.preventDefault()
    const msz={
        msz:e.target.msz.value
    }
    const token=localStorage.getItem("token")
    await axios.post("http://localhost:3000/chat/message",msz,{ headers: { "authentication": token } })
}