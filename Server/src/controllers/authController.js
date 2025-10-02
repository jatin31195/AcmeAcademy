import * as userService from "../services/authService.js";

export const registerUser = async (req, res) => {
  try {
    const { username, fullname, email, password, dob, phone, whatsapp } = req.body;

    const existingEmail = await userService.getUserByEmail(email);
    if (existingEmail) return res.status(400).json({ message: "Email already registered" });

    const existingPhone = await userService.getUserByPhone(phone);
    if (existingPhone) return res.status(400).json({ message: "Phone number already registered" });

    const user = await userService.createUser({ username, fullname, email, password, dob, phone, whatsapp });

    res.status(201).json({ message: "User created successfully", userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await userService.loginUser({ email, password });

    const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production" ? true : false, 
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", 
};

    res
      .cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 24 * 60 * 60 * 1000 })
      .cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000 })
      .status(200)
      .json({ message: "Login successful", userId: user._id, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message || "Login failed" });
  }
};
