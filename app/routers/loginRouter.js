const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Define a secret key for signing JWT tokens
const secretKey = 'mysecretkey';

// Sample user data
const users = [
  { email: 'user1@example.com', password: 'password1' },
  { email: 'user2@example.com', password: 'password2' },
];

// Login API endpoint
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    // Generate a JWT token and send it back to the client
    const token = jwt.sign({ email: user.email }, secretKey);
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid email or password' });
  }
});

module.exports = router;