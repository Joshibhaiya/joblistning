import userModel from "../models/userModel.js";
import bcryptjs from "bcryptjs";

export const registrationController = async (req, res, next) => {
    
        const { username, email, password } = req.body;

        // Validate inputs
        if (!username) return next("username is required");
        if (!email) return next("Email is required");
        if (!password) return next("Password is required123");

        // Check if user with the same email exists
        // const existingUser = await userModel.findOne({ email });
        // if (existingUser) return next("Email is already in use");

        // Create new user
        const user = await userModel.create({
            username,
            email,
            password,
        });
// token
const token = user.createJWT();

        res.status(201).send({
            success: true,
            message: "User created successfully",
            username:{
                username:user.username,
                email:user.email,
                lastName:user.lastName,
                location:user.location
            },
            token,
        });
    } ;

   

export const loginController = async (req, res, next) => {
    const { email, password } = req.body;

    // Validate inputs
    if (!email) return next("Email is required");
    if (!password) return next("Password is required");

    try {
        // Check if the user exists
        const user = await userModel.findOne({ email }).select("+password");
        if (!user) return next("User not found");

        // Check if the password is correct
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) return next("Invalid credentials");

        // Generate token
        user.password = undefined;
        const token = user.createJWT();

        res.status(200).send({
            success: true,
            message: "Login successful",
            user: {
                username: user.username,
                email: user.email,
                lastName: user.lastName,
                location: user.location,
            },
            token,
        });
    } catch (error) {
        return next("Error in login: " + error.message);
    }
};







export const getAllUsersController = async (req, res, next) => {
    try {
        // Retrieve all users, excluding the password field for security
        const users = await userModel.find({}).select("-password");

        // Check if users exist
        if (!users || users.length === 0) {
            return next("No users found");
        }

        // Send the response with all users
        res.status(200).send({
            success: true,
            message: "All users retrieved successfully",
            users: users.map(user => ({
                username: user.username,
                email: user.email,
                lastName: user.lastName,
                location: user.location
            })),
        });
    } catch (error) {
        return next("Error in fetching users: " + error.message);
    }
};

