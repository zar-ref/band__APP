const path  = require("path");
const bodyParser  = require('body-parser');
const express = require('express');
const sequelize = require('./util/database');
const cors = require('cors');
// const multer = require("multer");
//Routes
const userRoutes = require("./routes/user");
const adminZoneRoutes = require("./routes/admin-zone");
const fanZoneRoutes = require("./routes/fan-zone");


const User = require('./models/user');
const Albuns = require('./models/albuns');
const AlbunsUsersRelation = require('./models/albunsUsersRelation')


const app = express();

app.use(bodyParser.json());
app.use("/Albuns/" , express.static("Albuns"));

///     CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
});

// app.use(cors({origin: true}));
// User.belongsToMany(Albuns, {through: AlbunsUsersRelation});
// Albuns.belongsToMany(User, {through: AlbunsUsersRelation});




// app.use(multer().single('file'));
app.use( "/api/user", userRoutes);
app.use("/api/admin-zone" , adminZoneRoutes );
app.use("/api/fan-zone" , fanZoneRoutes );



module.exports = app;
