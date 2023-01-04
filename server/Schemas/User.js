const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    birthday: { type: String },
    currentLocation: { type: String }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);
// module.exports = {getCurrentBtcPrice}
