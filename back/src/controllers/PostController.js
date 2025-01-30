const { Post, User } = require("../models");

const PostController = {
    // create post
    create: async (req, res) => {
        try {
            const { text, image } = req.body;

            if (!text) {
                return res.status(400).json({ error: "Text is required." });
            }

            const post = await Post.create({
                text,
                image: image || null,
                userId: req.user.id,
            });

            console.log("Post created successfully");
            return res.status(201).json(post);
        } catch (error) {
            console.error("Error creating post:", error);
            return res.status(500).json({ error: "Erreur lors de la création du post." });
        }
    },

    // get all posts
    getAll: async (req, res) => {
        try {
            const posts = await Post.findAll({
                include: [
                    {
                        model: User,
                        as: "author",
                        attributes: ["pseudo"],
                    },
                ],
                order: [["createdAt", "DESC"]],
            });

            res.status(200).json(posts);
        } catch (error) {
            console.error("Error fetching posts:", error);
            res.status(500).json({ error: "Error fetching posts" });
        }
    },

    // get post by id
    getById: async (req, res) => {
        try {
            const post = await Post.findOne({ where: { id: req.params.id, userId: req.user.id } });
            if (!post) return res.status(404).json({ error: "Post non trouvé ou non autorisé." });
            return res.status(200).json(post);
        } catch (error) {
            return res.status(500).json({ error: "Erreur lors de la récupération du post." });
        }
    },

    // update post
    update: async (req, res) => {
        try {
            const { text, url } = req.body;
            const post = await Post.findOne({ where: { id: req.params.id, userId: req.user.id } });

            if (!post) return res.status(404).json({ error: "Post non trouvé ou non autorisé." });

            await post.update({ text, url });
            return res.status(200).json(post);
        } catch (error) {
            return res.status(500).json({ error: "Erreur lors de la mise à jour du post." });
        }
    },

    // delete post
    delete: async (req, res) => {
        try {
            const post = await Post.findOne({ where: { id: req.params.id, userId: req.user.id } });
            if (!post) return res.status(404).json({ error: "Post non trouvé ou non autorisé." });

            await post.destroy();
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ error: "Erreur lors de la suppression du post." });
        }
    },
};

module.exports = PostController;
