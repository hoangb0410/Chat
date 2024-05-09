const requestController = require("../controllers/requestController");
const protectRoute = require("../middleware/protectRoute");
const router = require("express").Router();

router.post("/:id", protectRoute.protected, requestController.sendRequest);
router.delete(
  "/reject/:id",
  protectRoute.protected,
  requestController.rejectRequest
);
router.post(
  "/accept/:id",
  protectRoute.protected,
  requestController.acceptRequest
);

module.exports = router;
