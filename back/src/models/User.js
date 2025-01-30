const { DataTypes } = require("sequelize");
const sequelize = require("../utils/sequelize");

const User = sequelize.define("User", {
    pseudo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: true, // can be null when offline
    },
});

module.exports = User;
