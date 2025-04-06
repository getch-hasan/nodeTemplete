import bcrypt from "bcrypt";
import { Request, Response } from "express";
import User from "../models/user.model";
import { generateAccessToken, generateRefreshToken } from "../utils/token.util";

// ✅ Registration with Password Hashing
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Save the user to the database
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    // Generate tokens
    const accessToken = generateAccessToken(newUser._id.toString());
    const refreshToken = generateRefreshToken(newUser._id.toString());

    // Respond with the new user and tokens
    res.status(201).json({ user: newUser, accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ error: "Error creating user" });
  }
};

// ✅ Login with Password Verification

export const logIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid email" });
      return;
    }

    // Compare entered password with stored hash
    const isMatch = await user.comparePassword(password);
    console.log(isMatch);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid password" });
      return;
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    // Successful login
    res.status(200).json({
      message: "Login Successful",
      user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Get All Users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
};
