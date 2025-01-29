const express = require("express");
const PostController = require("../controllers/PostController");

const router = express.Router();

router.post("/", PostController.create);
router.get("/", PostController.getAll);
router.get("/:id", PostController.getById);
router.put("/:id", PostController.update);
router.delete("/:id", PostController.delete);

module.exports = router;
