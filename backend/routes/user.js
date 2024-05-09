const userController = require("../controllers/userController");
const protectRoute = require("../middleware/protectRoute");

const router = require("express").Router();
// Register
router.post("/register", userController.registerUser);
// get user for sidebar
router.get("/", protectRoute.protected, userController.getUsersForSidebar);

// Update user
router.put("/update", protectRoute.protected, userController.updateUser);

// Delete user
router.delete("/", protectRoute.protected, userController.deleteUser);

// // Get all users
// router.get("/",middlewareController.verifyToken,userController.getAllUsers);
// // Get user by id
// router.get("/:id",middlewareController.verifyToken,userController.getUser);
// // Update user
// router.put("/update/:id",middlewareController.verifyTokenAndUserOrAdminAuth, userController.updateUser);

module.exports = router;
