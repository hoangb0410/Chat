const jwt = require("jsonwebtoken");
const mysql = require("mysql");
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

const protectRoute = {
  protected: async (req, res, next) => {
    try {
      const token = req.cookies.accessToken;
      if (!token) {
        return res
          .status(401)
          .json({ error: "Unauthorized - No Token Provided" });
      }
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);
      if (!decoded) {
        return res.status(401).json({ error: "Unauthorized - Invalid Token" });
      }
      db.query(
        "SELECT * FROM users WHERE id = ?",
        [decoded.userId],
        (err, results) => {
          if (err) {
            console.error("Error in protectRoute middleware: ", err.message);
            return res.status(500).json({ error: "Internal server error" });
          }
          const user = results[0]; // Assuming userId is unique
          if (!user) {
            return res.status(404).json({ error: "User not found" });
          }
          req.user = user;
          next();
        }
      );
    } catch (error) {
      console.log("Error in protectRoute middleware: ", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = protectRoute;
