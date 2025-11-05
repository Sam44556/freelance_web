
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },       // text
  email: { type: String, unique: true, required: true },       // text
  password: { type: String, required: true },    // text (hashed)
  role: { type: String },        // "client" or "freelancer"
  provider: { type: String, default: 'credentials' }   // "client" or "freelancer"
});
const User = mongoose.model("User", userSchema);
export default User;