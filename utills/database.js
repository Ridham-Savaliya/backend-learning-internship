const { Sequelize } = require("sequelize");
const fs = require('fs')
// Create a new instance of Sequelize for MySQL
// Create Sequelize instance
const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: process.env.DATABASE_DIALECT,
    dialectOptions: {
      ssl: {
        ca: fs.readFileSync('ssl/ca.pem'),
        // Use correct path
      },
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: false, // Disable logging SQL queries (optional)
  }
);





// if(sequelize.authenticate())
// {
//     console.log('sucess');

// }

// else
// {
//     console.log('denied!');

// }

module.exports = sequelize;
