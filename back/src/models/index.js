const Post = require("./Post");
const Comment = require("./Comment");

Post.hasMany(Comment, { foreignKey: "postId", as: "comments" });
Comment.belongsTo(Post, { foreignKey: "postId", as: "post" });

module.exports = { Post, Comment };
