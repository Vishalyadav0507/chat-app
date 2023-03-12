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
        console.log(response.status)
        if(response.status==201){
            alert("Successfuly signed up")
            window.location.href ='login.html'
        }
        else if(response.status==404){
            alert("User already exists, Please Logins")
        }
    } catch (err) {
        console.log(err)
    }
}