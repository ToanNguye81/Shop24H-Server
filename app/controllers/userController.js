

// //Ver 1====================================================================
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../models/userModel');

// const register = async (req, res) => {
//   const { userName, email, password } = req.body;
//   console.log("Register")

//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'Email already exists' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 12);
//     const user = await User.create({
//       userName,
//       email,
//       password: hashedPassword,
//     });

//     const token = jwt.sign(
//       { userId: user._id, email: user.email, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' }
//     );

//     res.status(201).json({ token });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// const login = async (req, res) => {
//   const { email, password } = req.body;

// try {
//   const user = await User.findOne({ email });
//   if (!user) {
//     return res.status(401).json({ message: 'Authentication failed' });
//   }

//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) {
//     return res.status(401).json({ message: 'Authentication failed' });
//   }

//   const token = jwt.sign(
//     { userId: user._id, email: user.email, role: user.role },
//     process.env.JWT_SECRET,
//     { expiresIn: '1h' }
//   );

//   res.json({ token });
// } catch (error) {
//   res.status(500).json({ message: 'Server error' });
// }
// };

// module.exports = { register, login };



// //===========================Ver 2

// const User = require('../models/userModel');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const { validationResult } = require('express-validator');

// // Controller to handle user signup
// export const signup = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(422).json({
//       errors: errors.array()
//     });
//   }

//   const { name, email, password } = req.body;
//   try {
//     let user = await User.findOne({ email });
//     if (user) {
//       return res.status(400).json({ error: "User already exists" });
//     }

//     user = new User({
//       name,
//       email,
//       password,
//       role:"customer",
//     });

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(password, salt);

//     await user.save();

//     const payload = {
//       user: {
//         id: user.id,
//         role: user.role,
//       },
//     };

//     jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
//       if (err) throw err;
//       res.json({ token });
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// };

// // Controller to handle user login
// export const login = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(422).json({
//       errors: errors.array()
//     });
//   }

//   const { email, password } = req.body;
//   try {
//     let user = await User.findOne({ email });

//     if (!user) {
//       return res.status(400).json({ error: 'Invalid credentials' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(400).json({ error: 'Invalid credentials' });
//     }

//     const payload = {
//       user: {
//         id: user.id,
//         role: user.role,
//       },
//     };

//     jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
//       if (err) throw err;
//       res.json({ token });
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// };


// //Ver 2.1================================
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
// const User = require('../models/userModel');

// const signUp = async (req, res, next) => {
//   try {
//     const { email, password, role } = req.body;
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User already exists' });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({ email, password: hashedPassword, role });
//     const result = await user.save();
//     const token = jwt.sign({ email: result.email, role: result.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     res.status(201).json({ message: 'User created', token });
//   } catch (error) {
//     next(error);
//   }
// };

// const login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ message: 'Authentication failed' });
//     }
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: 'Authentication failed' });
//     }
//     const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     res.status(200).json({ message: 'Authentication successful', token });
//   } catch (error) {
//     next(error);
//   }
// };

// const getAllUsers = async (req, res, next) => {
//   try {
//     const users = await User.find();
//     res.status(200).json(users);
//   } catch (error) {
//     next(error);
//   }
// };

// const getCurrentUser = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.user.userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.status(200).json(user);
//   } catch (error) {
//     next(error);
//   }
// };

// const updateCurrentUser = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await User.findByIdAndUpdate(
//       req.user.userId,
//       { email, password: hashedPassword },
//       { new: true }
//     );
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     res.status(200).json({ message: 'User updated', token });
//   } catch (error) {
//     next(error);
//   }
// };

// const getUserById = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.status(200).json(user);
//   } catch (error) {
//     next(error);
//   }
// };

// const updateUserById = async (req, res, next) => {
//   try {
//     const { email, password, role } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await User.findByIdAndUpdate(
//       req.params.id,
//       { email, password: hashedPassword, role },
//       { new: true }
//     );
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.status(200).json({ message: "User updated", user });
//   } catch (error) {
//     next(error);
//   }
// };

// const deleteUserById = async (req, res, next) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.status(200).json({ message: "User deleted", user });
//   } catch (error) {
//     next(error);
//   }
// };

// module.exports = {
//   getAllUsers,
//   getCurrentUser,
//   updateCurrentUser,
//   getUserById,
//   updateUserById,
//   deleteUserById,
//   signUp,
//   login,
// };

//Ver 3 ================================================
// const User = require('../models/userModel');
// const jwt = require('jsonwebtoken');

// const generateToken = (user) => {
//   return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
// };

// const signup = async (req, res) => {
//   try {
//     const user = new User(req.body);
//     await user.save();
//     const token = generateToken(user);
//     res.status(201).json({ user, token });
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findByCredentials(email, password);
//     const token = generateToken(user);
//     res.json({ user, token });
//   } catch (err) {
//     res.status(400).json({ message });
//   }
// };

// const getUsers = async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// const getUserById = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// const updateUser = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     Object.assign(user, req.body);
//     await user.save();
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// const deleteUser = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     await user.remove();
//     res.json({ message: 'User deleted' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// module.exports = {
//   signup,
//   login,
//   getUsers,
//   getUserById,
//   updateUser,
//   deleteUser,};

const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const signup = async (req, res) => {
  const errors = validationResult(req);
  const { userName, email, password } = req.body
  console.log("SignUp")

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      userName,
      email,
      password: hashedPassword,
      role: "customer"
    });
    await user.save();
    const token = generateToken(user);
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const login = async (req, res) => {
  console.log("Login")
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed: not found user' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Authentication failed: not Match' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getUsers = async (req, res) => {
  console.log("Get Usser")
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