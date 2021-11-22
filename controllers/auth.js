const User = require('../models/user')
const bcrypt = require('bcrypt')

//REGISTER
const registerUser = async(req, res, next)=>{
    const username = req.body.username.toLowerCase()
    const email = req.body.email.toLowerCase()
    const password = req.body.password
   try{ 
        if(password.length < 8){
            return res.status(200).json({message : "Password cannot be less than 8 characters."})
        }else{
            const salt = await bcrypt.genSalt(10)
            const hashedPasword = await bcrypt.hash(password, salt)
            const checkUser = await User.find().or([{email : email}, {username : username}])

            if(checkUser.length > 0){
                return res.status(500).json({response: "Username or email is registred. Please sign-in"})
            }else{
                const singupdData = await User.create({ username, email , password : hashedPasword })
                return res.status(200).json({response : "Success", data : singupdData})
            }

        }
    }catch(error){
        res.status(500).json({response : "An error occured. Please try again."})
    }
}


//LOGIN
const loginUser = async(req, res)=>{
    
    const emailOrUsername = req.body.emailOrUsername.toLowerCase()
    const password = req.body.password

    try{ 
        const loginData = await User.findOne({$or : [{email : emailOrUsername}, {username : emailOrUsername}]})
        const checkedEmail = loginData.email 
        const checkedUsername = loginData.username 
        const storedPassword = loginData.password 
        
    if((checkedEmail === emailOrUsername) || (checkedUsername === emailOrUsername)){
        const checkedPassword = await bcrypt.compare(password, storedPassword)
        if(!checkedPassword){
            return res.status(200).json({response : "fail", message : "Password Incorrect."})
        }
        return res.status(200).json({response : "Success", data : loginData})
    }else{
        return res.status(404).json({message : "Email or Username not found in our database. Please try again."})
    }
    
    }catch(error){
        res.status(404).json({error : "User or Username not found. Please try again."})
    }
}


module.exports = {registerUser, loginUser}
