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
        } else {
            alert("something went wrong")
        }
    } catch (err) {
        console.log(err)
    }
}