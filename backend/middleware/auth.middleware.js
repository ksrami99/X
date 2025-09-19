import jwt from "jsonwebtoken";
import User from "../models/users.model.js";

export const jwtAuth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      res.status(400).json({ error: "Unauthorized: Invalid Token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      res.status(400).json({ error: "Unauthorized: Invalid Token" });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      res.status(400).json({ error: "Unauthorized: Invalid Token" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
