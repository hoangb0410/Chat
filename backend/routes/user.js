const userController = require("../controllers/userController");
const protectRoute = require("../middleware/protectRoute");

const router = require("express").Router();
// Register
router.post("/register", userController.registerUser);

router.get("/", protectRoute.protected, userController.getUsersForSidebar);
// // Get all users
// router.get("/",middlewareController.verifyToken,userController.getAllUsers);
// // Get user by id
// router.get("/:id",middlewareController.verifyToken,userController.getUser);
// // Update user
// router.put("/update/:id",middlewareController.verifyTokenAndUserOrAdminAuth, userController.updateUser);
// // Delete user
// router.delete("/:id",middlewareController.verifyTokenAndUserOrAdminAuth,userController.deleteUser);

module.exports = router;
