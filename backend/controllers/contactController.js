const mysql = require("mysql");

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

const contactController = {
  deleteFriend: async (req, res) => {
    try {
      db.query(
        "DELETE FROM contacts WHERE (userId = ? AND friendId = ?) OR (userId = ? AND friendId = ?)",
        [req.user.id, req.params.id, req.params.id, req.user.id],
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            res.status(200).json({ message: "delete friend successfully" });
          }
        }
      );
    } catch (error) {
      console.log("Error in deleteFriend controller: ", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = contactController;
