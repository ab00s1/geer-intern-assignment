const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// authenticating user using JWT
function authenticate(req, res, next) {
    const header = req.headers["authorization"];

    const token = header && header.split(" ")[1];

    if(!token) return res.status(401).json({message: "No token found"});
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({message: "Invalid Token!"});

        req.userId = decoded.userId;
        next();
    });
}

// registering new user
const register = async (req, res) => {
  try {
    const { username, email, password, photo } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      photo,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// signing in existing user
const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  user.status = 'active';
  await user.save();

  res.status(200).json({ message: 'User signed in successfully', token });
};

// changing password
const forgot = async (req, res) => {
  const { email, newPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedNewPassword;
  await user.save();

  res.status(200).json({ message: 'Password updated successfully' });
};

// logging out user
const logout = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  user.status = 'inactive';
  await user.save();

  res.status(200).json({ message: 'User logged out successfully' });
};

module.exports = { register, signin, forgot, authenticate, logout };