const User = require('../models/user')
const bcrypt = require('bcrypt')

//REGISTER
const registerUser = async(req, res, next)=>{
    const firstname = req.body.firstname.toLowerCase()
    const lastname = req.body.lastname.toLowerCase()
    const username = req.body.username.toLowerCase()
    const email = req.body.email.toLowerCase()
    const password = req.body.password

    if(firstname && lastname && username && email && password){
       try{ 
            if(password.length < 8){
                return res.status(200).json({response: "Fail", message : "Password cannot be less than 8 characters"})
            }else{
                const salt = await bcrypt.genSalt(10)
                const hashedPasword = await bcrypt.hash(password, salt)
                const checkUser = await User.find().or([{email : email}, {username : username}])

                if(checkUser.length > 0){
                    return res.status(200).json({response: "Fail", message : "Username or email is registred. Please sign-in"})
                }else{
                    const singupdData = await User.create({ firstname, lastname, username, email , password : hashedPasword })
                    return res.status(200).json({response : "Success", singupdData})
                }
            }
        }catch(error){
            res.status(200).json({response : "Fail", message : "An error occured. Please try again"})
        }
     }else{
         res.status(200).json({response: "Fail", message : "Please enter your firstname, lastname, Username, E-mail and Password"})
    }
}


//LOGIN
const loginUser = async(req, res)=>{
    
    const emailOrUsername = req.body.emailOrUsername.toLowerCase()
    const password = req.body.password

    if(emailOrUsername  && password){
        try{ 
            const loginData = await User.findOne({$or : [{email : emailOrUsername}, {username : emailOrUsername}]})
            const checkedEmail = loginData.email 
            const checkedUsername = loginData.username 
            const storedPassword = loginData.password 
            
        if((checkedEmail === emailOrUsername) || (checkedUsername === emailOrUsername)){
            const checkedPassword = await bcrypt.compare(password, storedPassword)
            if(!checkedPassword){
                return res.status(200).json({response : "Fail", message : "Password Incorrect"})
            }
            return res.status(200).json({response : "Success", loginData})
        }else{
            return res.status(200).json({response: "Fail", message : "Email or Username not found in our database. Please try again"})
        }
        
        }catch(error){
            res.status(200).json({response: "Fail", message : "Username or email not found. Please try again"})
        }
    }else{
         res.status(200).json({response: "Fail", message : "Please enter your E-mail / Username and Password"})
    }
}


module.exports = {registerUser, loginUser}
