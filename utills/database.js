const { Sequelize } = require("sequelize");

// Create a new instance of Sequelize for MySQL
const sequelize = new Sequelize(process.env.DATABASE_NAME,process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
  host: process.env.DATABASE_HOST, // MySQL server
  dialect: process.env.DATABASE_DIALECT,
});

// if(sequelize.authenticate())
// {
//     console.log('sucess');

// }

// else
// {
//     console.log('denied!');

// }

module.exports = sequelize;
