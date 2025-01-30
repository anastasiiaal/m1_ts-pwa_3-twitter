const { DataTypes } = require("sequelize");
const sequelize = require("../utils/sequelize");
const User = require("./User");

const Post = sequelize.define("Post", {
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
    onDelete: "CASCADE",
  },
});

module.exports = Post;
