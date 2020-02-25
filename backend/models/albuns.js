const Sequelize  = require ('sequelize');

const sequelize = require('../util/database');

const Albuns = sequelize.define('albuns', {
    albumId: {        
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
        
    },
    name: {        
        type: Sequelize.STRING,
        allowNull: false
    },
    path: {        
        type: Sequelize.TEXT,
        allowNull: false
    },
    date: {        
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    description: {        
        type: Sequelize.TEXT
    }
    
});

module.exports = Albuns;