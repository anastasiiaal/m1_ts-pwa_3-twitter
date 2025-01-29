const { Post, Comment } = require("../models");

const PostController = {
    // create post
    create: async (req, res) => {
        try {
            const { author, text, url } = req.body;
            const post = await Post.create({ author, text, url });
            return res.status(201).json(post);
        } catch (error) {
            return res.status(500).json({ error: "Erreur lors de la création du post." });
        }
    },

    // get all posts
    getAll: async (req, res) => {
        try {
            const posts = await Post.findAll({ include: [{ model: Comment, as: "comments" }] });
            return res.status(200).json(posts);
        } catch (error) {
            return res.status(500).json({ error: "Erreur lors de la récupération des posts." });
        }
    },

    // get post by id
    getById: async (req, res) => {
        try {
            const post = await Post.findByPk(req.params.id, { include: [{ model: Comment, as: "comments" }] });
            if (!post) return res.status(404).json({ error: "Post non trouvé." });
            return res.status(200).json(post);
        } catch (error) {
            return res.status(500).json({ error: "Erreur lors de la récupération du post." });
        }
    },

    // update post
    update: async (req, res) => {
        try {
            const { author, text, url } = req.body;
            const post = await Post.findByPk(req.params.id);
            if (!post) return res.status(404).json({ error: "Post non trouvé." });

            await post.update({ author, text, url });
            return res.status(200).json(post);
        } catch (error) {
            return res.status(500).json({ error: "Erreur lors de la mise à jour du post." });
        }
    },

    // delete post
    delete: async (req, res) => {
        try {
            const post = await Post.findByPk(req.params.id);
            if (!post) return res.status(404).json({ error: "Post non trouvé." });

            await post.destroy();
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ error: "Erreur lors de la suppression du post." });
        }
    },
};

module.exports = PostController;
