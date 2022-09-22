const { Sequelize } = require("sequelize");
const env = process.env;

const configDb = {
  host: env.DB_HOST,
  database: env.DB_DATABASE,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  dialect: env.DB_DIALECT,
};

const sequelize = new Sequelize(configDb);

module.exports = sequelize;
