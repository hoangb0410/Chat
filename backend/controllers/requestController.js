const mysql = require("mysql");

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});
const requestController = {
  sendRequest: async (req, res) => {
    try {
      db.query(
        "INSERT INTO friend_request SET ?",
        {
          senderId: req.user.id,
          recipientId: req.params.id,
        },
        (error, results) => {
          if (error) {
            console.log(error);
          }
          res.status(200).json({ message: "sent request successfully" });
        }
      );
    } catch (error) {
      console.log("Error in sentRequest controller: ", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  rejectRequest: async (req, res) => {
    try {
      db.query(
        "DELETE FROM friend_request WHERE senderId = ? AND recipientId = ?",
        [req.params.id, req.user.id],
        (error, results) => {
          if (error) {
            console.log(error);
          }
          res.status(200).json("rejected friend request");
        }
      );
    } catch (error) {
      console.log("Error in rejectRequest controller: ", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  acceptRequest: async (req, res) => {
    try {
      db.query(
        "DELETE FROM friend_request WHERE senderId = ? AND recipientId = ?",
        [req.params.id, req.user.id],
        (error, results) => {
          if (error) {
            console.log(error);
          }
          db.query(
            "CALL insert_contact(?,?)",
            [req.params.id, req.user.id],
            (error, results) => {
              if (error) {
                console.log(error);
              }
            }
          );
          res.status(200).json("accepted friend request");
        }
      );
    } catch (error) {
      console.log("Error in acceptRequest controller: ", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = requestController;
