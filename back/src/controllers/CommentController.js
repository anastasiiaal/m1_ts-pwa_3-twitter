const { Comment } = require("../models");

const CommentController = {
    // add comment
    create: async (req, res) => {
        try {
            const { author, content, postId } = req.body;
            const comment = await Comment.create({ author, content, postId });
            return res.status(201).json(comment);
        } catch (error) {
            return res.status(500).json({ error: "Erreur lors de la création du commentaire." });
        }
    },

    // get all comments
    getAllByPost: async (req, res) => {
        try {
            const comments = await Comment.findAll({ where: { postId: req.params.postId } });
            return res.status(200).json(comments);
        } catch (error) {
            return res.status(500).json({ error: "Erreur lors de la récupération des commentaires." });
        }
    }
};

module.exports = CommentController;
