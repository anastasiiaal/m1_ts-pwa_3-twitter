const { DataTypes } = require("sequelize");
const sequelize = require("../utils/sequelize");
const Post = require("./Post");

const Comment = sequelize.define("Comment", {
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Posts",
    },
    onDelete: "CASCADE",
  }
});

module.exports = Comment;
