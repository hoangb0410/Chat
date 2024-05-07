const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    profilePic: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     username: { type: String, required: true, min: 6, max: 20, unique: true },
//     fullname: { type: String, min: 5, max: 30 },
//     email: { type: String, required: true, max: 50, unique: true },
//     password: { type: String, required: true, min: 6 },
//     isAdmin: { type: Boolean, default: false },
//     interest_site: [{ type: mongoose.Schema.Types.ObjectId, ref: "Site" }],
//     interest_event: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("User", userSchema);
