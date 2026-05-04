// User.js - Clean final version
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      unique: true,
      minlength: [3, "Name must be at least 3 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      select: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
    Otp:
    {
      type: Number
    },
    OtpExpires:
    {
      type: Date
    },
    OtpVerified:
    {
      type: Boolean, default: false
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    lastSeen: {
      type: Date,
      default: Date.now, // ✅ Reference, not invoked — correct
    },
  },
  { timestamps: true }
);

// ✅ Hash password before saving — skips if not modified (handles updates too)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next(); // ✅ guard for OAuth users
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ✅ Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);