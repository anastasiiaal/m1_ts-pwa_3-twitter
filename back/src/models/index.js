const Post = require("./Post");
const User = require("./User");
const NotificationSubscription = require("./NotificationSubscription");

Post.belongsTo(User, { foreignKey: "userId", as: "author" });
User.hasMany(Post, { foreignKey: "userId", as: "posts" });

User.hasMany(NotificationSubscription, { foreignKey: "userId", onDelete: "CASCADE" });
NotificationSubscription.belongsTo(User, { foreignKey: "userId" });

module.exports = { Post, User };
