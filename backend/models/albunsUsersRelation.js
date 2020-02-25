const Sequelize  = require ('sequelize');

const sequelize = require('../util/database');

const User = require('./user');
const Albuns = require('./albuns');


const Albumuserrelation = sequelize.define("albumuserrelation", {
    albumId: {        
        type: Sequelize.INTEGER,
        references: {
            model: Albuns,
            key: "albumId"
        },
        primaryKey: true
        
    },
    email: {        
        type: Sequelize.STRING,
        references: {
            model: User,
            key: "email"
        },
        primaryKey: true
    }

});

module.exports = Albumuserrelation;