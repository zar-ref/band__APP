const express = require("express");

const router = express.Router();

const adminZoneController = require('../controllers/admin-zone');

const multer = require("multer");

const angularAssetsAlbunsFolder = __dirname+ '/../../angular/src/assets/Albuns';
const albunsBackendDir = "Albuns";
///////////AlbumStorage

let AlbumStorage = multer.diskStorage({ //multers disk storage settings
    destination: (req, file, cb) => {
        
        dir = __dirname + '/../' + 'Albuns';
        cb(null, albunsBackendDir);
    },
    filename: (req, file, cb) => {
        
        cb(null, file.originalname);
    }
});

let uploadMusic = multer({ //multer settings
    storage: AlbumStorage
}).single('file');

////////////Image Storage
let ImageStorage = multer.diskStorage({ //multers disk storage settings
    destination: (req, file, cb) => {
        console.log("imaaaaagem" , file)
        console.log(angularAssetsAlbunsFolder)
        dir = __dirname + '/../' + 'Albuns';

        cb(null, albunsBackendDir);
    },
    filename: (req, file, cb) => {
        
        cb(null, file.originalname);
    }
});

let uploadImage = multer({ //multer settings
    storage: ImageStorage
}).single('image');



router.get('/users' , adminZoneController.getUsers);
router.post('/update-user-type', adminZoneController.postUpdateUserType );
router.post('/delete-user' , adminZoneController.postDeleteUser);
router.get('/albuns' , adminZoneController.getAlbuns);
router.post('/create-new-album', adminZoneController.postAlbum);
router.get('/get-album-max-id' , adminZoneController.getAlbunsMaxId);
router.post('/upload-music' , uploadMusic  , adminZoneController.postUploadMusic);
router.post('/upload-image', uploadImage, adminZoneController.postUploadImage);
router.post('/delete-music', adminZoneController.postDeleteMusic)
router.post('/delete-album-picture', adminZoneController.postDeleteAlbumPicture);
router.post('/download-music' , adminZoneController.postDownloadMusic);
router.post('/update-album-description' , adminZoneController.postUpdateAlbumDescription);
router.post('/update-album-name' , adminZoneController.postUpdateAlbumName);
router.post('/delete-album', adminZoneController.postDeleteAlbum);
module.exports = router