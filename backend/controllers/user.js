const User = require('../models/user');
const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken");

require('dotenv').config();
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: process.env.EMAIL, 
      pass: process.env.PASSWORD
  }
});




exports.postLogin = (req, res, next) => {
    const userEmail = req.body.email;
    console.log(userEmail);
    let fetchedUser;
    User.findByPk(userEmail)
        .then(user => {
            if (!user) {
                return res.status(401).json({
                  message: "Autenticação Falhou no Email"
                });
            }
            if(user.role === "inactive"){
              return res.status(401).json({
                message: "Autenticação Falhou no Email por estar Inativo"
              });
            }
            console.log(user);
            fetchedUser = user;
            if(req.body.password === user.password) {
                return true;
            }
            return false;            

        })
        .then(result => {
            // console.log("resultado da prmise anterior" , result);
            if (!result) {
                return res.status(401).json({
                  message: "Autenticação Falhou na Password"
                });
            }
            const token = jwt.sign(
                { email: fetchedUser.email },
                "secret_this_should_be_longer",
                { expiresIn: "1d" }
              );
              res.status(200).json({
                token: token,
                expiresIn: 3600*24,
                role: fetchedUser.role
              
              });
        })
        .catch(err => {
          // console.log("estou no catch", err);
            return res.status(401).json({
              message: "Autenticação falhou no geral"
            });
        });
}

exports.postSignUp = (req, res, next) => {
  console.log("request", req.body);
  const newUserEmail = req.body.email;
  const newUserPassword = req.body.password;
  const newUserName = req.body.name
  console.log(process.env.EMAIL, process.env.PASSWORD);
  User.findByPk(newUserEmail)
    .then(user => {
      if(user){
        return res.status(401).json({
          message: "Utilizador já se inscreveu"
        });
      }
      
      User.create({
        email: newUserEmail,
        name: newUserName,
        password: newUserPassword,
        date: new Date(),
        role: "inactive"
      });
      const emailToken = jwt.sign(
        { email: newUserEmail },
        "secret_this_should_be_longer",
        { expiresIn: "1w" }
      );
      const emailConfirmationURL = `http://localhost:4200/confirmation/${emailToken}`;

      const mailOptions = {
        from: process.env.EMAIL, 
        to: newUserEmail,
        subject: 'Confirmação do Email - BAND_APP',
        html: `Por favor carregar no link seguinte para confirmar a inscrição<br><br>
        <a href="${emailConfirmationURL}">${emailConfirmationURL}</a>
        `
      };
      transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            console.log(err)
            return res.status(401).json({
              message: "Email não foi enviado"
            });
        }
        res.status(200).json({
          message: "Inscrição concluida com sucesso"
        });
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: "Inscrição falhou no geral"
      });
    })

}

exports.postConfirmation = (req, res, next) => {
  // console.log("request" , req.body);
  const emailToken = req.body.emailToken;
  console.log(emailToken);
  const userToConfirm = jwt.verify(emailToken,  "secret_this_should_be_longer");
  // console.log(userToConfirm.email);
  User.update(
      {role: "active"} ,
      {where: {email: userToConfirm.email}} 
    ).then(()=> {
      res.status(200).json({
          message: "Confirmação concluida com sucesso"
      });
    },
    err => {
      res.status(401).json({
        message: "Confirmação falhou"
    });
    })
  

      
  

};