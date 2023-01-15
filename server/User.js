import mongoose from "mongoose";

const User = new mongoose.Schema({
  name: { type: String, required: true },
  occupation: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

export default mongoose.model("User", User);
