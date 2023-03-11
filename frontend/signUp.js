async function signUp(e) {
    try {
        e.preventDefault()

        const userData = {
            Name: e.target.Name.value,
            Email: e.target.Email.value,
            Number: e.target.Num.value,
            Password: e.target.Password.value,
        }
        
        const response = await axios.post('http://localhost:3000/user/signup',userData)
    } catch (err) {
        console.log(err)
    }
}