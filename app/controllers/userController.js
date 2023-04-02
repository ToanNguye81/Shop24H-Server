

const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');


//Generate Token
const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

//Signup function
const signup = async (req, res) => {
  // Check input data
  const errors = validationResult(req);
  const { userName, email, password } = req.body;

  // Nếu có lỗi, trả về thông báo lỗi
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Tạo người dùng mới
    const user = await User.create({
      userName,
      email,
      password: hashedPassword,
      role: "customer"
    });
    await user.save();

    // Tạo token cho người dùng
    const token = generateToken(user);

    // Trả về thông tin người dùng và token
    res.status(201).json({ user, token });
  } catch (err) {
    // Trả về thông báo lỗi nếu có lỗi xảy ra trong quá trình tạo người dùng
    res.status(400).json({ message: err.message });
  }
};

//Login Function
const login = async (req, res) => {

  const { email, password } = req.body;
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        message: 'Authentication failed: not found user' 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        message: 'Authentication failed: not Match' 
      });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role,userName:user.userName },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: "Get all user successfully",
      data: users
    });
  } catch (err) {

    res.status(500).json({ message: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    Object.assign(user, req.body);
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.remove();
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  signup,
  login,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};