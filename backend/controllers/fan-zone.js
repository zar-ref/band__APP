const User = require('../models/user');
const Albuns = require('../models/albuns');
const albunsUserRelation = require('../models/albunsUsersRelation');
const jwt = require("jsonwebtoken");
const path = require("path");
const fsExtra = require("fs-extra");
const fs = require("fs");

const imageTypes = ['jpeg', 'JPEG', 'jpg', 'JPG', 'png', 'PNG'];

exports.getUserEmail = (req, res, next) => {
    const userEmailToken = req.params.token;
    const userEmail = jwt.verify(userEmailToken,  "secret_this_should_be_longer");
    res.status(200).json({
        message: "Utilizador encontrado com sucesso",
        email: userEmail.email
    })
}



exports.getAlbunsPreview =  (req, res, next) => {
    let fetchedAlbuns = [];
    const userEmail = req.params.email;
    let hasAccess = [];

    Albuns.findAll({attributes: ['albumId', 'name', 'path', 'date', 'description'], order:[['albumId' , 'DESC']]})
        .then(  albuns => {
            
            let promise;
               albuns.forEach( album =>{
                
                let imgUrl = "";
                let musicsUrls = []

                fs.readdirSync(album.path).forEach(file => {
                    let pathToFile = file;
                    if(   imageTypes.includes(file.split('.')[1]) ){
                        imgUrl = pathToFile;
                        
                    }
                    else {
                            musicsUrls.push(pathToFile);
                    }  
                }); 
                promise = albunsUserRelation.findOne({
                    attributes: ['albumId', 'email'],
                    where:{
                        albumId: album.albumId , 
                        email: userEmail
                    }
                }).then(userRelation => {
                    let albumAccess = false
                    if(userRelation){
                        albumAccess = true;
                    }
                    hasAccess.push(albumAccess);
                    return userRelation;
                });   

                fetchedAlbuns.push({
                    albumId:  album.albumId,
                    name: album.name,
                    path: album.path,
                    date: album.date,
                    description: album.description,
                    imgUrl: imgUrl,
                    musicsUrls: musicsUrls
                });
            

            });
           return Promise.resolve(promise)
        }).then(result => {
                
            for (let i = 0; i < fetchedAlbuns.length; i++) {
                fetchedAlbuns[i].hasAccess = hasAccess[i];                    
            }
            res.status(200).json({
                    albuns: fetchedAlbuns
            });
        })
        .catch(err => {
            console.log(err)
            return res.status(401).json({
                message: "Erro ao obter os Albuns"
            })
        });
}


exports.postAccessToAlbum = (req, res, next) => {
    console.log(req.body.albumId + ' + ' + req.body.user);
    const userEmail = req.body.user;
    const albumId = req.body.albumId;
    albunsUserRelation.create({
        albumId: albumId,
        email: userEmail
    }).then(response => {
        console.log(response);
        return res.status(200).json({
            message: "Acesso obtido com sucesso"
        });
    }).catch(err => {
        console.log(err);
        return res.status(401).json({
            message:"Erro ao obter acesso"
        });
    });



}