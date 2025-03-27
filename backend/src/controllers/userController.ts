import { Request, Response } from "express";
import userModel from "../models/userModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

interface IUser {
  _id: string;
  email: string;
  password: string;
  role: string;
}

// Create token
const createToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "", { expiresIn: "7d" });
};

// Login user
/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Login a user and generate a JWT token
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 description: User's password
 *     responses:
 *       200:
 *         description: User logged in successfully with a JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 token:
 *                   type: string
 *                 role:
 *                   type: string
 *       400:
 *         description: Invalid credentials or user does not exist
 *       500:
 *         description: Server error during login
 */
const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne<IUser>({ email });
    if (!user) {
      // return res.json({ success: false, message: "User Doesn't exist" });
      res = res.status(400);
      throw new Error("User Doesn't exist");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // return res.json({ success: false, message: "Invalid Credentials" });
      res = res.status(400);
      throw new Error("Invalid Credentials");
    }

    const token = createToken(user._id);
    res.json({ success: true, token, role: user.role });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

// Register user
/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Register a new user and generate a JWT token
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's name
 *               email:
 *                 type: string
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 description: User's password
 *     responses:
 *       200:
 *         description: User registered successfully with a JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 token:
 *                   type: string
 *                 role:
 *                   type: string
 *       400:
 *         description: User already exists or invalid input
 *       500:
 *         description: Server error during registration
 */
const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const exists = await userModel.findOne<IUser>({ email });
    if (exists) {
      // return res.json({ success: false, message: "User already exists" });
      res = res.status(400);
      throw new Error("User already exists");
      
    }

    if (!validator.isEmail(email)) {
      // return res.json({ success: false, message: "Please enter a valid email" });
      res = res.status(400);
      throw new Error("Please enter a valid email");
    }
    if (password.length < 6) {
      // return res.json({ success: false, message: "Password must be at least 8 characters" });
      res = res.status(400);
      throw new Error("Password must be at least 6 characters");
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT) || 10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user._id);
    res.json({ success: true, token, role: user.role });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

export { loginUser, registerUser };
