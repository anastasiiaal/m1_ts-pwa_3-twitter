const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.MYSQL_URL, {
  logging: false,
});

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({
      // alter: true,
    })
    .then(() => console.log("BDD synchronisée"))
    .catch(err => console.error("Erreur de synchronisation de la BDD", err));;
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

module.exports = sequelize;
