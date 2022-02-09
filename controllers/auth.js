const User = require('../models/user')
const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");

//REGISTER
const registerUser = async(req, res, next)=>{
    const firstname = req.body.firstname.toLowerCase()
    const lastname = req.body.lastname.toLowerCase()
    const username = req.body.username.toLowerCase()
    const email = req.body.email.toLowerCase()
    const password = req.body.password

// async..await is not allowed in global scope, must use a wrapper
async function main(userId, email, username, firstname, lastname) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL, // generated ethereal user
      pass: process.env.PASSWORD, // generated ethereal password
    },
  });

let mailOption = { 
    from: "mailsmartconnect@gmail.com", // sender address
    to: email, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?",
    html : `<h2 style='background:#8899aa; color : #fff; padding : 1rem'>Smart Connect</h2>
    <div style="font-size: 1rem">
    <h3 style="color: #8899aa" >Hello, <span style="color : #446; text-transform: capitalize">${firstname} ${lastname}</span></h3>
    <p style="color: #446">Welcome to <span style="color:#243eb3; font-weight: 600">Smart Connect. </span><br/>
    Click the button below to verify your email.</p>
    <br/>
    <a href="http://smart-job-search.herokuapp.com/api/v1/${userId}/${username}" style="color: #f3f3ff ; text-decoration:none">
        <button style="color: #f3f3ff ; width : 10rem; height: 3rem; text-align: center; background : #243eb3; border : none; cursor: pointer">
        Verify Email
        </button>
    </a>
    </div>`,
    // attachements : [
    //     {filename : "nanmeOfFile.jpg" , path : "./pathToFile/nanmeOfFile.jpg"}
    // ]
}


console.log(userId, email, firstname)
let info = await transporter.sendMail(mailOption, function(err, data){
    if(err){ 
        console.log(err)
    }else{
        console.log("sent...")
    }
})
}



    if(firstname && lastname && username && email && password){
       try{ 
            if(password.length < 8){
                return res.status(200).json({response: "Fail", message : "Password cannot be less than 8 characters"})
            }else{
                const salt = await bcrypt.genSalt(10)
                const hashedPasword = await bcrypt.hash(password, salt)
                const checkUser = await User.find().or([{email : email}, {username : username}])

                // if(checkUser.length > 0){
                //     return res.status(200).json({response: "Fail", message : "Username or email is registred. Please sign-in"})
                // }else{
                    const singupdData = await User.create({ firstname, lastname, username, email , password : hashedPasword })                    
                    await res.status(200).json({response : "Success", singupdData})

                    main(singupdData._id, email, username, firstname, lastname).catch(console.error);
                // }
            }
        }catch(error){
            res.status(200).json({response : "Fail", message : "An error occured. Please try again"})
        }
     }else{
         res.status(200).json({response: "Fail", message : "Please enter your firstname, lastname, Username, E-mail and Password"})
    }
}

const verifyEmail = async(req, res)=>{
    const {id, username} = req.params

    const currentUser = await User.findOne({_id : id, username : username})
    // const foundUser = await User.findOne({_id : id, username : username})
        if(!currentUser){
            return res.status(200).json({response: "Fail", message : "User not found in our database. Please sign up"})      
        }else{
            const verifiedUser = await currentUser.updateOne({emailVerified : true })
            res.status(200).json({response : "Success",  data : verifiedUser})
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


module.exports = {registerUser, verifyEmail, loginUser}


