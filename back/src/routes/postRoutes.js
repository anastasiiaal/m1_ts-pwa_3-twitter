const express = require("express");
const PostController = require("../controllers/PostController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, PostController.create);
router.get("/", authMiddleware, PostController.getAll);
router.get("/user/:id", PostController.getByUserId);
router.get("/:id", authMiddleware, PostController.getById);
router.put("/:id", authMiddleware, PostController.update);
router.delete("/:id", authMiddleware, PostController.delete);

module.exports = router;
