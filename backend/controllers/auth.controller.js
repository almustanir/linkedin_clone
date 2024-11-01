import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if(!name || !username || !email || !password ) {
        return res.status(400).json({message: "All fiedls are required"});
    }

    const existingMail = await User.findOne({ email });
    if (existingMail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    //hash password 123456
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    res.cookie("jwt-linkedin", token, {
      httpOnly: true, //prevent xssattack
      maxAge: 3 * 24 * 60 * 60 * 1000,
      sameSite: "strict", //prevent CSRF attacks
      secure: process.env.NODE_ENV === "production", //prevent man-in the middle attacks
    });

    res.status(201).json({ message: "user registered successfully" });

    const profileUrl = process.env.CLIENT_URL + "/profile/" + user.username
    //postman
    //todo:send welcome email

    try {
        await sendWelcomeEmail(user.email, user.name,profileUrl)
    } catch (emailError) {
        console.error("Error sending welcome email", emailError);
    }
  } catch (error) {
    console.log("Error in  signup: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = (req, res) => {
  res.send("login");
};

export const logout = (req, res) => {
  res.send("logout");
};
