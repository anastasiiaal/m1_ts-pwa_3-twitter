const express = require("express");
const CommentController = require("../controllers/CommentController");

const router = express.Router();

router.post("/", CommentController.create);
router.get("/:postId", CommentController.getAllByPost);

module.exports = router;
