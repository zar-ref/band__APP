const Sequelize  = require ('sequelize');

const sequelize = require('../util/database');


const User = sequelize.define('user', {
    email: {        
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    name: {        
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {        
        type: Sequelize.STRING,
        allowNull: false
    },
    date: {        
        type: Sequelize.DATEONLY,
        allowNull: false
    },

    role: {        
        type: Sequelize.STRING,
        allowNull: false
    }
    
});

module.exports = User;