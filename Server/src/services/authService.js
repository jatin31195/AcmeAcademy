import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const createUser = async (userData) => {
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);

  const newUser = new User({
    ...userData,
    password: hashedPassword,
  });

  return await newUser.save();
};

export const getUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const getUserByPhone = async (phone) => {
  return await User.findOne({ phone });
};
