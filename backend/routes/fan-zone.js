const express = require("express");

const router = express.Router();

const fanZoneController = require('../controllers/fan-zone');

router.get('/get-user-email/:token', fanZoneController.getUserEmail);
router.post('/post-access-to-album' , fanZoneController.postAccessToAlbum);
router.get('/get-albuns-preview/:email', fanZoneController.getAlbunsPreview);
module.exports = router