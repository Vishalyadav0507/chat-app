async function login(e) {
    try {
        e.preventDefault()
        const Data = {
            Email: e.target.Email.value,
            Password: e.target.Password.value
        }
        console.log(Data)
        const response = await axios.post("http://localhost:3000/user/login", Data)
        if (response.status === 201) {
            alert("login successfully")
            console.log(response.data.token)
            localStorage.setItem("token",response.data.token)
            window.location.href="chatPage.html"
        } else {
            alert("something went wrong")
        }
    } catch (err) {
        console.log(err)
    }
}