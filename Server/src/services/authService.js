import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const getUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const getUserByPhone = async (phone) => {
  return await User.findOne({ phone });
};

export const createUser = async ({
  username,
  fullname,
  email,
  password,
  dob,
  phone,
  whatsapp,
}) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    username,
    fullname,
    email,
    password: hashedPassword,
    dob,
    phone,
    whatsapp,
  });
  return await user.save();
};

const issueAuthTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "30d" }
  );

  return { accessToken, refreshToken };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const { accessToken, refreshToken } = issueAuthTokens(user._id);

  return { user, accessToken, refreshToken };
};

export const loginUserByPhone = async (phone) => {
  const user = await User.findOne({ phone });
  if (!user) throw new Error("User not found");

  const { accessToken, refreshToken } = issueAuthTokens(user._id);

  return { user, accessToken, refreshToken };
};
