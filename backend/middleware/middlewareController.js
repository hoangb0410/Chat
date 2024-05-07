const jwt = require("jsonwebtoken");

const middlewareController = {
  // verify token
  verifyToken: async (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    if (accessToken) {
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          return res.status(403).json("Token is not valid");
        }
        req.user = user;
        next();
      });
    } else {
      return res.status(401).json("You're not authenticated");
    }
  },
  // verify Token, user or admin
  verifyTokenAndUserOrAdminAuth: (req, res, next) => {
    middlewareController.verifyToken(req, res, () => {
      if (req.user.id == req.params.id || req.user.isAdmin) {
        next();
      } else {
        return res.status(403).json("You're not allowed");
      }
    });
  },
  // verify Token and Admin
  verifyTokenAndAdminAuth: (req, res, next) => {
    middlewareController.verifyToken(req, res, () => {
      if (req.user.isAdmin) {
        next();
      } else {
        return res
          .status(403)
          .json("You're not allowed, only admin has permission!");
      }
    });
  },
};

module.exports = middlewareController;
