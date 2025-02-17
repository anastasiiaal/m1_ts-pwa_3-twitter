const express = require("express");
const NotificationController = require("../controllers/NotificationController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/subscribe", authMiddleware, NotificationController.subscribe);
router.post("/unsubscribe", authMiddleware, NotificationController.unsubscribe);
router.get("/subscriptions", authMiddleware, NotificationController.getSubscriptions);

module.exports = router;
