const contactController = require("../controllers/contactController");
const protectRoute = require("../middleware/protectRoute");

const router = require("express").Router();
router.delete("/:id", protectRoute.protected, contactController.deleteFriend);
module.exports = router;
