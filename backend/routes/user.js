const express = require("express");
const bcrypt = require("bcrypt");
// const User = require("../models/user");
// const jwt = require("jsonwebtoken");

const router = express.Router();

const userController = require('../controllers/user');

router.post('/login' , userController.postLogin);
router.post('/signup' , userController.postSignUp);
router.post('/confirmation' , userController.postConfirmation);





module.exports = router;