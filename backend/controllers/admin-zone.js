const User = require('../models/user');
const Albuns = require('../models/albuns');
const AlbunsRelations = require('../models/albunsUsersRelation');
const connection = require('../util/database');
const jwt = require("jsonwebtoken");
const fs = require("fs");
const fsExtra = require("fs-extra");
const multer = require("multer");
const path = require("path");

const albunsDir = __dirname + '/../Albuns/';
let angularAssetsAlbunsFolder = __dirname+ '/../../angular/src/assets/Albuns/';
angularAssetsAlbunsFolder = albunsDir;

const imageTypes = ['jpeg', 'JPEG', 'jpg', 'JPG', 'png', 'PNG'];

    /////////GESTÂO DE UTILIZADORES

exports.getUsers = (req, res, next) => {
    console.log("estou aqui");
    let fetchedUsers;
    User.findAll({attributes: ['email', 'name', 'date', 'role'], order:[['date' , 'DESC']]})
        .then(users => {
            console.log(users);
            fetchedUsers = users;
            res.status(200).json({
                users: fetchedUsers
            });
        }),
        err => {
            console.log(err)
        };
}

exports.postUpdateUserType = (req, res, next) => {
    const userToUpdate = req.body.email;
    const roleToUpdate = req.body.role;
    User.update(
        {role: roleToUpdate},
        {where: {email: userToUpdate}}
    ).then(()=>{
        res.status(200).json({
            message:"Utilizador Atualizado com sucesso"
        });
    },
    err => {
        res.status(401).json({
            message: "Atualização Falhou"
        });
    });
}

exports.postDeleteUser = (req, res, next) => {
    const userToDelete = req.body.email;
    User.destroy({
        where: {
            email: userToDelete
        }
    })
    .then(()=>{
        let promise;
        promise = AlbunsRelations.destroy({where: {email: userToDelete} })
        return Promise.resolve(promise) 
    
    }).then(result => {
        res.status(200).json({
        message:"Utilizador Apagado com sucesso"
        });
    }).catch(err => {
        res.status(401).json({
            message: "Apagar Falhou"
        });
    })
}

    /////GESTÂO DE ALBUNS  

exports.postAlbum = (req, res, next) => {
    const newAlbumName = req.body.newAlbumName;
    const newAlbumDescription = req.body.newAlbumDescription;
    console.log('                                 antes de procurar');
    Albuns.findOne({where:{name: newAlbumName}})
        .then(album =>{
            console.log('                              na procura de procurar');
            if(album){
                // console.log("album     ",album);
                res.status(401).json({
                    message: "Já existe um album com este nome!"
                });
            }
            else{
                console.log('                 cldepois de procurar');
                const newAlbumDir = angularAssetsAlbunsFolder + req.body.newAlbumDir;
                

                console.log(newAlbumDir);
                console.log(newAlbumName)
                Albuns.create({
                    name: newAlbumName,
                    path: newAlbumDir,
                    date: new Date(),
                    description: newAlbumDescription
                }).then(response =>{
                    console.log(response);
                    return res.status(200).json({
                    message: "Album Criado"

                     });
                }).catch(err => console.log(err));
                
            }

        },
        err =>{
            console.log(err);
            res.status(401).json({
                message: "Erro a atualizar a base de dados!"
            });
        })
}

exports.getAlbunsMaxId = (req, res, next) => {
    let maxAlbumId;
    
    connection.query("SELECT `AUTO_INCREMENT` FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'band_app' AND TABLE_NAME = 'albuns'", {raw:true})
        .then(result => {
            maxAlbumId = result[0][0].AUTO_INCREMENT;
            res.status(200).json({
                message:"ok",
                maxAlbumId: maxAlbumId
            });
        }).catch(err => {
            res.status(401).json({
                error: err
            });
        })

}


exports.postUploadMusic = (req, res, next) => {
    console.log("diretoria = " , req.body.dir);

    // const albunsDir= __dirname + '/../Albuns/';
    // const dir = __dirname + `/../Albuns/${req.body.dir}/` ;
    const dir = angularAssetsAlbunsFolder + `${req.body.dir}/`;
    // console.log("no controller com filename = "  ,req.file.filename);
    // console.log("dir= " , dir);
    // console.log("temp dir = ", albunsDir);
    fsExtra.move(angularAssetsAlbunsFolder + req.file.filename, dir+req.file.filename, { overwrite: true } , err =>{
        if(err){
            console.log(err);
        }
        
    });
   res.status(200).json({
        message: "Upload de de musica completo"
    });
}

exports.postUploadImage = (req, res, next) =>{
    console.log("diretoria = " , req.body.dir);

    // const albunsDir= __dirname + '/../Albuns/';
    // const dir = __dirname + `/../Albuns/${req.body.dir}/` ;
    const dir = angularAssetsAlbunsFolder +  `${req.body.dir}/`;
    fsExtra.move(angularAssetsAlbunsFolder + req.file.filename, dir+req.file.filename, { overwrite: true } , err =>{
        if(err){
            console.log(err);
        }
        
    });
   res.status(200).json({
        message: "Upload de imagem completo"
    });
}

exports.getAlbuns =  (req, res, next) => {
    let fetchedAlbuns = [];
    
    Albuns.findAll({attributes: ['albumId', 'name', 'path', 'date', 'description'], order:[['albumId' , 'DESC']]})
        .then(albuns => {
            // console.log("na get albuns com --> ", albuns.length);
            // fetchedAlbuns = albuns;
             albuns.forEach(album =>{
                // console.log("album no for each");
                // console.log(album);
                let imgUrl = "";
                let musicsUrls = []

                fs.readdirSync(album.path).forEach(file => {
                    // let pathToFile = album.path + '/' + file;
                    let pathToFile = file;
                    console.log(pathToFile);
                    if(   imageTypes.includes(file.split('.')[1]) ){
                        imgUrl = pathToFile;
                        
                    }
                    else {
                            musicsUrls.push(pathToFile);
                    }   
                    
                        
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
            // console.log("terminou");
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

exports.postDeleteMusic  = (req, res, next) => {

    const fileToDelete = angularAssetsAlbunsFolder + `${req.body.albumId}/${req.body.musicToDelete}`;
    fsExtra.removeSync(fileToDelete)
    res.status(200).json(
        {message:"Música Apagada com sucesso"}
    )
}

exports.postDownloadMusic =  (req, res, next) => {
    const dir = albunsDir + req.body.dir;
    const music = albunsDir + req.body.music;
    // console.log("music to download = " , music);
    const filePath = albunsDir + req.body.dir + '/' + req.body.music;
    // res.download(dir + '/'+req.body.music);
    res.sendFile(path.resolve(filePath));
}

exports.postDeleteAlbumPicture = (req, res, next) => {
    const fileToDelete = angularAssetsAlbunsFolder + `${req.body.albumId}/${req.body.imgToDelete}`;
    console.log("diretoria a apagar = " ,fileToDelete);
    fsExtra.removeSync(fileToDelete)
    res.status(200).json(
        {message:"Imagem Apagada com sucesso"}
    )


}

exports.postUpdateAlbumDescription =  (req, res, next) => {

    const albumId = req.body.albumId;
    const newAlbumDescription = req.body.newAlbumDescription;

    Albuns.update(
        {description: newAlbumDescription} ,
        {where: {albumId: albumId}} 
      ).then(()=> {
        res.status(200).json({
            message: "Descrição alterada com sucesso"
        });
      },
      err => {
        res.status(401).json({
          message: "Alteração da descrição falhou"
      });
      })
}

exports.postUpdateAlbumName =  (req, res, next) => {

    const albumId= req.body.albumId;
    const newAlbumName = req.body.newAlbumName;
    console.log("na post update " , albumId);
    Albuns.update(
        {name: newAlbumName} ,
        {where: {albumId: albumId}} 
      ).then(()=> {
        res.status(200).json({
            message: "Nome alterado com sucesso"
        });
      },
      err => {
        res.status(401).json({
          message: "Alteração do Nome falhou"
      });
      })

}

exports.postDeleteAlbum =  (req, res, next) => {
    const albumToDelete = req.body.albumId;
    fsExtra.removeSync(albunsDir + albumToDelete.toString())
    Albuns.destroy({
        where: {
            albumId: albumToDelete
        }
    })
    .then(()=>{
        let promise;
        promise = AlbunsRelations.destroy({where: {albumId: albumToDelete} })
        return Promise.resolve(promise)      
    
    }).then(result => {
        res.status(200).json({
            message:"Album Apagado com sucesso"
        });
    })
    .catch(err => {
        console.log("no catch com erro = ",err);
        res.status(401).json({
            message: "Apagar Falhou"
        });
    })



}