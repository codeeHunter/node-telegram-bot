const { Sequelize } = require("sequelize");

module.exports = new Sequelize("telegram_bot", "root", "root", {
  host: "185.10.184.68",
  port: "6432",
  dialect: "postgres",
});
