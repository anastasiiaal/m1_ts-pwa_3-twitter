const { DataTypes } = require("sequelize");
const sequelize = require("../utils/sequelize");

const Post = sequelize.define("Post", {
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Post;
