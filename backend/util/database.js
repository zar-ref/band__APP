const Sequelize = require('sequelize');

const sequelize = new Sequelize( 'band_app', 'root', '', { 
    dialect: 'mysql', 
    host: 'localhost' ,
    define: {
        timestamps: false
    },
    query:{raw:true}
    
});


module.exports = sequelize;