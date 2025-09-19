import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    
}, { timestamps: true });

const User = mongoose.Model("User", userSchema);
