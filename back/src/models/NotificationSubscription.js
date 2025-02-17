const { DataTypes } = require("sequelize");
const sequelize = require("../utils/sequelize");
const User = require("./User");

const NotificationSubscription = sequelize.define("NotificationSubscription", {
    endpoint: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    p256dh: {
        type: DataTypes.STRING,
        allowNull: false
    },
    auth: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

module.exports = NotificationSubscription;
