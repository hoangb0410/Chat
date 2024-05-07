const User = require("../models/User");
const bcrypt = require("bcrypt");
const client = require("../connectDB/connect_redis");
const mysql = require("mysql");
const generateTokenAndSetCookie = require("../utils/generateToken");

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

const userController = {
  //Register
  registerUser: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);
      const { fullName, username, password, confirmPassword, gender } =
        req.body;
      // mysql
      db.query(
        "SELECT username FROM users WHERE username = ?",
        [username],
        async (error, result) => {
          if (error) {
            console.log(error);
          }
          if (result.length > 0) {
            return res
              .status(400)
              .json({ error: "That username is already in use" });
          } else if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords don't match" });
          }
          db.query(
            "INSERT INTO users SET ?",
            {
              fullName: fullName,
              username: username,
              password: hashed,
              gender: gender,
              profilePic: `https://avatar.iran.liara.run/username?username=${username}`,
            },
            (error, results) => {
              if (error) {
                console.log(error);
              }
            }
          );
          db.query(
            "SELECT id, username FROM users WHERE username = ?",
            [username],
            async (error, result) => {
              if (error) {
                console.log(error);
              }
              if (result.length > 0) {
                const user = result[0];
                generateTokenAndSetCookie.genAndSet(user.id, res);
                res.status(200).json({ message: "register successfully" });
              }
            }
          );
        }
      );
      // mongodb
      // const newUser = await new User({
      //   username,
      //   profilePic: `https://avatar.iran.liara.run/username?username=${username}`,
      // });
      // const user = await newUser.save();
      // res.status(200).json(user);
      // db.query(
      //   "SELECT id FROM users WHERE username = ?",
      //   [username],
      //   async (error, result) => {
      //     if (error) {
      //       console.log(error);
      //     }
      //     if (result.length > 0) {
      //       generateTokenAndSetCookie.genAndSet(result[0].id, res);
      //     }
      //   }
      // );

      // res.status(200).json({ message: "register successfully" });
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
      console.log("Error in signup controller", err.message);
    }
  },
  getUsersForSidebar: async (req, res) => {
    try {
      const loggedInUserId = req.user.id;
      db.query(
        "SELECT id, username, fullName, username, gender, profilePic FROM users WHERE id != ?",
        [loggedInUserId],
        (err, results) => {
          if (err) {
            console.error("Error in getUsersForSidebar: ", err.message);
            return res.status(500).json({ error: "Internal server error" });
          }
          res.status(200).json(results);
        }
      );
    } catch (error) {
      console.error("Error in getUsersForSidebar: ", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  /*
  // Get all users
  getAllUsers: async (req, res) => {
    try {
      const user = await User.find();
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Get user by id
  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Update user
  updateUser: async (req, res) => {
    try {
      // Validate user ID
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      const {
        username,
        email,
        fullName,
        interest_site,
        isAdmin,
        interest_event,
      } = req.body;
      const updateData = {};
      updateData.username = username;
      updateData.email = email;
      updateData.fullName = fullName;
      updateData.interest_site = interest_site;
      updateData.interest_event = interest_event;
      // Only admin can edit isAdmin property
      if (isAdmin) {
        if (req.user.isAdmin) {
          updateData.isAdmin = isAdmin;
        } else {
          return res.status(403).json("Only admin can edit isAdmin");
        }
      }
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(req.body.password, salt);
        updateData.password = hashed;
      }
      // Update user in the database
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      );
      // Check if the user was found and updated
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
    }
  },
  // Delete user
  deleteUser: async (req, res) => {
    try {
      //const user = await User.findById(req.params.id);
      const user = await User.findByIdAndDelete(req.params.id); // Xoa that
      // remove refresh token from redis
      client.del(user.id.toString(), (err) => {
        if (err) {
          console.log(err);
        }
      });
      res.status(200).json("Delete successful!");
    } catch (err) {
      res.status(500).json(err);
    }
  },*/
};

module.exports = userController;
