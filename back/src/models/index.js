const Post = require("./Post");
const User = require("./User");

Post.belongsTo(User, { foreignKey: "userId", as: "author" });
User.hasMany(Post, { foreignKey: "userId", as: "posts" });

module.exports = { Post, User };
