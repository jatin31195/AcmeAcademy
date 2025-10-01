import * as userService from "../services/authService.js";

export const registerUser = async (req, res) => {
  try {
    const { username, fullname, email, password, dob, phone, whatsapp } = req.body;

    // Check if user already exists
    const existingEmail = await userService.getUserByEmail(email);
    if (existingEmail) return res.status(400).json({ message: "Email already registered" });

    const existingPhone = await userService.getUserByPhone(phone);
    if (existingPhone) return res.status(400).json({ message: "Phone number already registered" });

    const user = await userService.createUser({
      username,
      fullname,
      email,
      password,
      dob,
      phone,
      whatsapp,
    });

    res.status(201).json({ message: "User created successfully", userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
