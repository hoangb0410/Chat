const authController = require("../controllers/authController");
const protectRoute = require("../middleware/protectRoute");

const router = require("express").Router();
// Login
router.post("/login", authController.loginUser);
// // Refresh
// router.post("/refresh", authController.requestRefreshToken);
// Logout
router.post("/logout", protectRoute.protected, authController.userLogout);

module.exports = router;
