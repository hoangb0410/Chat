const router = require("express").Router();
const messageController = require("../controllers/messageController");
const protectRoute = require("../middleware/protectRoute");

router.get("/:id", protectRoute.protected, messageController.getMessages);

router.post("/send/:id", protectRoute.protected, messageController.sendMessage);

module.exports = router;
