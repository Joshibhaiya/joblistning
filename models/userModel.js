import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      validate: validator.isEmail,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    location: {
      type: String,
      default: "India",
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving to the database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// compare the pass word
userSchema.methods.comparePassword = async function (userPassword){
const isMatch =await bcrypt.compare(userPassword, this.password);
return isMatch;
} 

// Generate JWT Token
userSchema.methods.createJWT = function () {
  return jsonwebtoken.sign(
    { userId: this._id, username: this.username },
    process.env.JWT_SECRET,  // Make sure this environment variable is set
    {
      expiresIn: "1h", // Token will expire in 1 hour
    }
  );
};

export default mongoose.model("User", userSchema);
