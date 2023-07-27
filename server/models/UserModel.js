const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      User: {
        type: Number,
        default: 2001,
      },
      Admin: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);
