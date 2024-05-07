const jwt = require("jsonwebtoken");
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

// Array to store refreshToken
let refreshTokens = [];

const authController = {
  // Generate access token
  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        // isAdmin: user.isAdmin, // check if admin
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "15d" }
    );
  },
  // Generate refresh token
  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        // isAdmin: user.isAdmin, // check if admin
      },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "365d" }
    );
  },
  // Login
  loginUser: async (req, res) => {
    try {
      const { username, password } = req.body;
      db.query(
        "SELECT * FROM users WHERE username = ?",
        [username],
        async (err, results) => {
          if (err) {
            console.error(err);
            return res.status(500).json(err);
          }
          if (results.length === 0) {
            return res.status(404).json({ error: "Wrong username!" });
          }
          const user = results[0];
          const validPassword = await bcrypt.compare(password, user.password);
          if (!validPassword) {
            return res.status(404).json({ error: "Wrong password!" });
          }
          if (user && validPassword) {
            generateTokenAndSetCookie.genAndSet(user.id, res);
            const refreshToken = authController.generateRefreshToken(user);
            // Save refresh token to redis
            client.set(
              user.id.toString(),
              refreshToken,
              "EX",
              365 * 24 * 60 * 60,
              (err, reply) => {
                if (err) {
                  console.log(err);
                }
              }
            );
            res.status(200).json({
              id: user.id,
              fullName: user.fullName,
              username: user.username,
              profilePic: user.profilePic,
            });
            // const accessToken = authController.generateAccessToken(user);
            // Add refresh token to array
            // refreshTokens.push(refreshToken);
            // // Save refresh token to cookie
            // res.cookie("refreshToken", refreshToken, {
            //   httpOnly: true,
            //   secure: false,
            //   path: "/",
            //   sameSite: "strict",
            // });
            // res.cookie("accessToken", accessToken, {
            //   httpOnly: true,
            //   secure: false,
            //   path: "/",
            //   sameSite: "strict",
            // });
          }
        }
      );
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
    }
  },
  // Logout
  userLogout: async (req, res) => {
    try {
      res.cookie("accessToken", "", { maxAge: 0 });
      res.status(200).json({ message: "Logged out successfully" });
      // delete refresh token from redis
      client.del(req.user.id.toString(), (err) => {
        if (err) {
          console.log(err);
        }
      });
    } catch (error) {
      console.log("Error in logout controller", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  // // Refresh Token
  // requestRefreshToken: async (req, res) => {
  //   // Take refresh token from user
  //   const refreshToken = req.cookies.refreshToken;
  //   if (!refreshToken) return res.status(401).json("You're not authenticated");
  //   if (!refreshTokens.includes(refreshToken)) {
  //     return res.status(403).json("Refresh token is not valid");
  //   }
  //   jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
  //     if (err) {
  //       console.log(err);
  //     }
  //     // Remove old refresh token from the array
  //     refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  //     // Create new access Token and refresh Token
  //     const newAccessToken = authController.generateAccessToken(user);
  //     const newRefreshToken = authController.generateRefreshToken(user);
  //     // Add refresh token to array
  //     refreshTokens.push(newRefreshToken);
  //     // Save refresh token to cookie
  //     res.cookie("refreshToken", newRefreshToken, {
  //       httpOnly: true,
  //       secure: false,
  //       path: "/",
  //       sameSite: "strict",
  //     });
  //     return res.status(200).json({ accessToken: newAccessToken });
  //   });
  // },
};

module.exports = authController;
