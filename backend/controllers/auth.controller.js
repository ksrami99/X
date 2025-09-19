import bcrypt, { genSalt } from "bcryptjs";
import User from "../models/users.model.js";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { username, fullname, email, password } = req.body;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid Email formate" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be min of 6 chars" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: "Username already used" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already used" });
    }
    const salt = await genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullname,
      username,
      email,
      password: hashedPassword,
    });

    if (!newUser) {
      return res
        .status(400)
        .json({ error: "Something want wrong while creating user" });
    }

    generateTokenAndSetCookie(newUser._id, res);
    await newUser.save();

    const user = await User.findById(newUser._id).select("-password");

    res.status(201).json({ user, message: "User created Successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await User.findOne({ username });

    const validPassword = await bcrypt.compare(password, user?.password || "");

    if (!validPassword) {
      return res.status(400).json({ error: "Invalid Username or password" });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      fullname: user.fullname,
      email: user.email,
      username: user.username,
      coverImage: user.coverImage,
      followers: user.followers,
      followings: user.followings,
      bio: user.bio,
      link: user.link,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      message: "LoggedIn Success",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server Error" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json(user)
  } catch (error) {
    return res.status(500).json({ message: "Internal server Error" });
  }
};
